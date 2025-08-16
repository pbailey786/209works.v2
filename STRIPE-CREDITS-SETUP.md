# Stripe Credits & Job Seeker Pro Setup Guide

## Overview

This guide covers:
1. Setting up credit top-ups (+1 and +5 credits) for employers
2. Implementing job seeker pro subscription
3. Managing credit balances in Supabase
4. Integrating Stripe webhooks with Clerk Billing

**Key Architecture:**
- **Credits balance**: Stored in Supabase (not Clerk)
- **Payment processing**: Clerk Billing (Stripe under the hood)
- **Feature gating**: Clerk entitlements (`has()` checks)

---

## 1. Database Setup (Supabase)

### Create credit tracking tables:

```sql
-- Employer credit balance
create table employer_credits (
  employer_id uuid primary key references profiles(id),
  balance int not null default 0,
  updated_at timestamptz default now()
);

-- Credit transaction ledger
create table credit_ledger (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references profiles(id),
  delta int not null,             -- +1, +5, -1, etc.
  reason text not null,           -- 'topup_1', 'topup_5', 'job_post', 'monthly_grant'
  stripe_session_id text,         -- Link to Stripe checkout session
  created_at timestamptz default now()
);

-- Job seeker subscriptions
create table job_seeker_subscriptions (
  user_id uuid primary key references profiles(id),
  status text not null default 'inactive', -- 'active', 'inactive', 'cancelled'
  stripe_subscription_id text,
  started_at timestamptz,
  ends_at timestamptz,
  updated_at timestamptz default now()
);
```

---

## 2. Stripe Products Setup (in Clerk Billing)

### Credit Top-ups (One-time payments):
- [ ] **Credit Top-Up: +1** — $49 one-time
- [ ] **Credit Top-Up: +5** — $199 one-time (save $46!)

### Job Seeker Pro (Subscription):
- [ ] **Job Seeker Pro** — $9.99/month
  - AI-powered job matching
  - Priority application status
  - Unlimited saved searches
  - Resume optimization tips

---

## 3. Implementation Files

### `/lib/credits.ts` - Credit management utilities

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCreditsBalance(employerId: string): Promise<number> {
  const { data, error } = await supabase
    .from('employer_credits')
    .select('balance')
    .eq('employer_id', employerId)
    .single();
  
  if (error || !data) return 0;
  return data.balance;
}

export async function adjustCredits(
  employerId: string, 
  delta: number, 
  reason: string,
  stripeSessionId?: string
): Promise<void> {
  // Add to ledger
  await supabase.from('credit_ledger').insert({
    employer_id: employerId,
    delta,
    reason,
    stripe_session_id: stripeSessionId
  });

  // Update balance
  await supabase.rpc('update_credit_balance', {
    p_employer_id: employerId,
    p_delta: delta
  });
}

export async function grantMonthlyCreditsIfDue(
  userId: string, 
  monthlyAmount: number
): Promise<void> {
  // Check if already granted this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: existing } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('employer_id', userId)
    .eq('reason', `monthly_grant_${monthlyAmount}`)
    .gte('created_at', startOfMonth.toISOString())
    .single();

  if (!existing) {
    await adjustCredits(userId, monthlyAmount, `monthly_grant_${monthlyAmount}`);
  }
}
```

### `/app/api/topup/route.ts` - Credit purchase endpoint

```typescript
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_MAP = {
  topup_1: process.env.STRIPE_PRICE_TOPUP_1!,  // Price ID from Stripe
  topup_5: process.env.STRIPE_PRICE_TOPUP_5!,
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { sku } = await req.json(); // 'topup_1' or 'topup_5'
  const priceId = PRICE_MAP[sku as keyof typeof PRICE_MAP];
  
  if (!priceId) {
    return new Response("Invalid SKU", { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/employer/credits?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/employer/credits?canceled=true`,
    metadata: { 
      userId, 
      sku,
      type: 'credit_topup'
    },
  });

  return Response.json({ url: session.url });
}
```

### `/app/api/webhooks/stripe/route.ts` - Stripe webhook handler

```typescript
import { headers } from "next/headers";
import Stripe from "stripe";
import { adjustCredits } from "@/lib/credits";
import { activateJobSeekerPro } from "@/lib/subscriptions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // Handle credit top-ups
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.metadata?.type === 'credit_topup') {
      const { userId, sku } = session.metadata;
      const credits = sku === 'topup_5' ? 5 : 1;
      
      await adjustCredits(
        userId, 
        credits, 
        sku, 
        session.id
      );
    }
  }

  // Handle job seeker pro subscription
  if (event.type === "customer.subscription.created" || 
      event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    
    if (subscription.metadata?.type === 'job_seeker_pro') {
      await activateJobSeekerPro(
        subscription.metadata.userId,
        subscription.id,
        subscription.status
      );
    }
  }

  return new Response(null, { status: 200 });
}
```

### `/components/AddCredits.tsx` - UI Component

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Zap } from 'lucide-react';

interface AddCreditsProps {
  currentBalance: number;
  onPurchase?: () => void;
}

export function AddCredits({ currentBalance, onPurchase }: AddCreditsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (sku: 'topup_1' | 'topup_5') => {
    setLoading(sku);
    
    try {
      const res = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku }),
      });

      const { url } = await res.json();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Purchase failed:', error);
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Job Credits</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current balance: {currentBalance} credits
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:border-primary" 
                onClick={() => handlePurchase('topup_1')}>
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">+1 Credit</h3>
              <p className="text-2xl font-bold mb-2">$49</p>
              <p className="text-sm text-muted-foreground">
                Post one job listing
              </p>
              <Button 
                className="mt-4 w-full" 
                disabled={loading !== null}
              >
                {loading === 'topup_1' ? 'Processing...' : 'Buy Now'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary border-primary/20" 
                onClick={() => handlePurchase('topup_5')}>
            <CardContent className="p-6 text-center">
              <div className="relative">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Save $46
                </span>
              </div>
              <h3 className="font-semibold mb-1">+5 Credits</h3>
              <p className="text-2xl font-bold mb-2">$199</p>
              <p className="text-sm text-muted-foreground">
                Post five job listings
              </p>
              <Button 
                className="mt-4 w-full" 
                variant="default"
                disabled={loading !== null}
              >
                {loading === 'topup_5' ? 'Processing...' : 'Best Value'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <span className="font-medium">Credits never expire.</span> Use them whenever you need to post a job.
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## 4. Monthly Credit Grants

### Automated monthly credit distribution:

```typescript
// /app/api/cron/monthly-credits/route.ts
import { auth } from "@clerk/nextjs/server";
import { grantMonthlyCreditsIfDue } from "@/lib/credits";

export async function GET() {
  // This would be called by a cron job or Clerk webhook
  const { has, userId } = await auth();
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Determine monthly credits based on plan
  let monthlyCredits = 0;
  
  if (has({ feature: "plan_credits_monthly_12" })) {
    monthlyCredits = 12;
  } else if (has({ feature: "plan_credits_monthly_6" })) {
    monthlyCredits = 6;
  } else if (has({ feature: "plan_credits_monthly_3" })) {
    monthlyCredits = 3;
  }

  if (monthlyCredits > 0) {
    await grantMonthlyCreditsIfDue(userId, monthlyCredits);
  }

  return new Response("OK");
}
```

---

## 5. Job Seeker Pro Implementation

### Features to implement:
- [ ] AI-powered job matching algorithm
- [ ] Priority application status display
- [ ] Unlimited saved searches
- [ ] Resume optimization tips UI
- [ ] Premium badge on applications

### Subscription check:

```typescript
// Check if user has Job Seeker Pro
export async function hasJobSeekerPro(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('job_seeker_subscriptions')
    .select('status')
    .eq('user_id', userId)
    .single();
  
  return data?.status === 'active';
}
```

---

## 6. UX Implementation Rules

1. **Zero balance behavior:**
   - Disable "Post Job" button
   - Show prominent "Add Credits" CTA
   - Display current balance clearly

2. **Free plan access:**
   - Always allow credit purchases
   - Show "Upgrade for monthly credits" prompt

3. **Credit persistence:**
   - Credits never expire
   - Keep balance on plan downgrade
   - Only stop monthly grants on cancellation

4. **Pro discounts:**
   - Check `has({ feature: "premium_discount_50" })` 
   - Apply 50% discount to Featured/SmartMatch posts

---

## 7. Testing Checklist

- [ ] Credit purchase flow (+1 and +5)
- [ ] Stripe webhook receives events
- [ ] Credits added to balance after payment
- [ ] Monthly grants applied correctly per plan
- [ ] Job Seeker Pro subscription activates
- [ ] Balance displays correctly in UI
- [ ] Post Job button disabled at 0 credits
- [ ] Credit ledger tracks all transactions

---

## 8. Environment Variables Needed

```env
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_TOPUP_1=price_xxx  # +1 credit price ID
STRIPE_PRICE_TOPUP_5=price_xxx  # +5 credits price ID
STRIPE_PRICE_JOBSEEKER_PRO=price_xxx  # Job Seeker Pro price ID

# Already in .env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 9. Supabase RPC Function

Create this function in Supabase SQL editor for atomic credit updates:

```sql
create or replace function update_credit_balance(
  p_employer_id uuid,
  p_delta int
) returns void as $$
begin
  insert into employer_credits (employer_id, balance)
  values (p_employer_id, greatest(0, p_delta))
  on conflict (employer_id)
  do update set 
    balance = greatest(0, employer_credits.balance + p_delta),
    updated_at = now();
end;
$$ language plpgsql;
```

This prevents negative balances and handles race conditions.