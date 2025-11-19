// src/app/(auth)/signup/page.tsx
import { AuthPageGuard } from "@/components/auth/AuthPageGuard";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthPageGuard>
      <SignupForm />
    </AuthPageGuard>
  );
}
