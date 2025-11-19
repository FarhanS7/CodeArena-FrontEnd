import { RoleGuard } from "@/features/auth/RoleGuard";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div>Admin-only stuff here</div>
    </RoleGuard>
  );
}
