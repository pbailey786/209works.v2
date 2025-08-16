# 209.works - AI-Powered Local Job Board

A modern job board platform built with Next.js 15, featuring AI-powered job matching, hyper-local job discovery, and seamless employer-candidate connections.

## 🚀 Features

- **AI-Powered Matching**: Smart job recommendations based on skills, experience, and preferences
- **Hyper-Local Focus**: Find opportunities in your neighborhood with distance-based search
- **Enhanced Job Cards**: "Should I Apply?" AI analysis for better decision making
- **Dual User Roles**: Separate experiences for job seekers and employers
- **Real-time Updates**: Instant notifications for new matches and application updates
- **Modern UI**: Beautiful, responsive design with light/dark mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: Clerk
- **Database**: Supabase (configured)
- **Icons**: Lucide React
- **Package Manager**: npm

## 📁 Project Structure

```
209works-v2/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Protected user dashboard
│   ├── jobs/             # Job browsing and details
│   ├── onboarding/       # New user onboarding
│   ├── sign-in/          # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
├── data/                  # Mock data
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pbailey786/209works.v2.git
cd 209works.v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Clerk and Supabase keys to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Key Pages

- **Home** (`/`) - Landing page with platform overview
- **Browse Jobs** (`/jobs`) - Search and filter job listings
- **Job Details** (`/jobs/[id]`) - Detailed job information with AI analysis
- **Dashboard** (`/dashboard`) - User dashboard (protected)
- **Sign In/Up** (`/sign-in`, `/sign-up`) - Authentication pages
- **Onboarding** (`/onboarding`) - New user setup

## 🔐 Authentication

The app uses Clerk for authentication with:
- Email/password sign up
- Social login options
- Protected routes with middleware
- Role-based access (job seeker vs employer)

## 🎨 Customization

### Tailwind CSS Configuration
The project uses Tailwind CSS v4 with CSS variables for theming. Customize colors and styles in:
- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Components
All UI components are built with shadcn/ui and can be customized in the `components/ui/` directory.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy on Vercel

The easiest deployment method:

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pbailey786/209works.v2)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the repository owner for contribution guidelines.

## 📧 Contact

For questions or support, please contact the repository owner.

---

Built with ❤️ using Next.js and AI assistance from Claude