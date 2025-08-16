import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back to 209.works</h1>
          <p className="text-muted-foreground">
            Sign in to find your perfect local job match
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footerActionLink: "text-primary hover:text-primary/90"
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}