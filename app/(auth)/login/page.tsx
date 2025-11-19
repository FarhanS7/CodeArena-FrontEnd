// src/app/(auth)/login/page.tsx
import { AuthPageGuard } from "@/components/auth/AuthPageGuard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageGuard>
      <LoginForm />
    </AuthPageGuard>
  );
}
