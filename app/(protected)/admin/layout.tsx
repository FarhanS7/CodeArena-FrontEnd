"use client";

import { RoleGuard } from "@/features/auth/RoleGuard";
import { ProblemAdminAuthProvider } from "@/features/problemAdmin/ProblemAdminAuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <ProblemAdminAuthProvider>{children}</ProblemAdminAuthProvider>
    </RoleGuard>
  );
}
