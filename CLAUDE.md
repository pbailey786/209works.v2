# CLAUDE.md - AI Assistant Instructions for 209works-v2

## Project Overview

This is a Next.js 15.4.6 job board application using TypeScript, React 19, and Tailwind CSS v4. The project is in early development stage with basic Next.js app structure initialized.

## Tech Stack

- **Framework**: Next.js 15.4.6 with App Router and Turbopack
- **Language**: TypeScript 5
- **UI**: 
  - Tailwind CSS v4 with PostCSS
  - shadcn/ui components (New York style)
  - Lucide React icons
  - class-variance-authority for component variants
- **Package Manager**: npm
- **Code Quality**: ESLint with Next.js configuration

## Project Structure

```
209works-v2/
├── app/                    # Next.js app directory
│   ├── favicon.ico
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/
│   └── utils.ts           # Utility functions (cn for className merging)
├── public/                # Static assets
├── MD files/              # Project documentation
│   ├── API-ENDPOINTS-DESIGN.md
│   ├── BUILD-CHECKLIST.md
│   ├── CLAUDE-IMPLEMENTATION-GUIDE.md
│   ├── ESSENTIAL-PAGES-REDESIGN.md
│   ├── FIGMA-TO-CODE-MAPPING.md
│   └── JOBBOARD-MASTER-PLAN.md
├── components.json        # shadcn/ui configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── eslint.config.mjs     # ESLint configuration
├── postcss.config.mjs    # PostCSS configuration
└── next.config.ts        # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style and Conventions

### TypeScript Configuration
- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` maps to root directory
- Target: ES2017

### Component Development
- Use functional components with TypeScript
- Utilize shadcn/ui components when possible
- Use the `cn()` utility from `@/lib/utils` for className merging
- Follow the New York style theme from shadcn/ui

### File Naming
- Components: PascalCase (e.g., `JobCard.tsx`)
- Utilities/hooks: camelCase (e.g., `useJobs.ts`)
- Constants: UPPER_SNAKE_CASE
- Pages: lowercase with hyphens (following Next.js convention)

### Import Order
1. External dependencies (React, Next.js)
2. UI components (@/components/ui)
3. Custom components (@/components)
4. Utilities and helpers (@/lib)
5. Types (@/types)
6. Styles

## Development Guidelines

### When Building Features

1. **Check Documentation First**: Review the MD files in `/MD files/` directory, especially:
   - `JOBBOARD-MASTER-PLAN.md` for overall architecture
   - `API-ENDPOINTS-DESIGN.md` for API structure
   - `CLAUDE-IMPLEMENTATION-GUIDE.md` for implementation steps

2. **Component Structure**:
   ```tsx
   import { FC } from 'react'
   import { cn } from '@/lib/utils'
   
   interface ComponentProps {
     className?: string
     // other props
   }
   
   export const Component: FC<ComponentProps> = ({ className, ...props }) => {
     return (
       <div className={cn('base-classes', className)}>
         {/* content */}
       </div>
     )
   }
   ```

3. **Server Components by Default**: Use server components unless client interactivity is needed

4. **Data Fetching**: Use server components for data fetching when possible

5. **Styling**: Use Tailwind CSS classes directly, avoid custom CSS files

### Planned Architecture (from documentation)

The project aims to be a job board with:
- **Authentication**: Clerk (planned)
- **Database**: Supabase (planned)
- **Payments**: Stripe via Clerk Billing (planned)
- **Storage**: AWS S3 (planned)
- **Email**: Resend (planned)

### Key Pages to Implement

Public Pages:
- Home (`/`)
- Browse Jobs (`/jobs`)
- Job Details (`/jobs/[id]`)
- Companies (`/companies`)
- Company Profile (`/companies/[id]`)
- Pricing (`/pricing`)
- Contact (`/contact`)

Auth Pages:
- Login (`/login`)
- Signup (`/signup`)
- Reset Password (`/reset-password`)

User Dashboard:
- Dashboard (`/dashboard`)
- Applications (`/applications`)
- Profile (`/profile`)
- Settings (`/settings`)

Employer Pages:
- Employer Dashboard (`/employer`)
- Post Job (`/employer/post`)
- Manage Jobs (`/employer/jobs`)
- Applicants (`/employer/applicants`)

Admin Pages:
- Admin Dashboard (`/admin`)
- Manage Users (`/admin/users`)

## Common Tasks

### Adding a New Page
```bash
# Create new route directory
mkdir -p app/route-name
# Create page component
touch app/route-name/page.tsx
```

### Installing shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Adding Icons
Use Lucide React icons which are already installed:
```tsx
import { IconName } from 'lucide-react'
```

## Important Notes

1. The project is in early development - only basic Next.js structure exists
2. No authentication, database, or API routes implemented yet
3. Follow the implementation guide in `CLAUDE-IMPLEMENTATION-GUIDE.md`
4. Use server components and server actions where possible
5. Keep components simple and focused on single responsibility

## Environment Variables (to be added)

When implementing features, these environment variables will be needed:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open http://localhost:3000
4. Start implementing features following the guides in `/MD files/`

Remember to test your changes and maintain code quality throughout development.