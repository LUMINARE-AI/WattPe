import { requireRole } from "@/lib/requireRole";
import { hasDatabase } from "@/lib/data/database";
import { connectDB } from "@/lib/db";
import { asDocs } from "@/lib/models/helpers";
import { User } from "@/lib/models/user";
import { UserRoleForm, type AdminUser } from "@/app/admin/users/user-role-form";

export const metadata = { title: "Users" };

export default async function DashboardUsersPage() {
  const session = await requireRole(["ADMIN"]);
  let users: AdminUser[] = [];
  let fromDb = false;

  if (hasDatabase()) {
    try {
      await connectDB();
      const rows = asDocs<{
        _id: { toString(): string };
        name: string | null;
        email: string;
        role: AdminUser["role"];
      }>(await User.find().select("name email role").sort({ email: 1 }).lean());
      users = rows.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      fromDb = true;
    } catch {
      fromDb = false;
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Users</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Grant or revoke admin access. After a role change they must log out and
        back in before Projects and Users appear in their dashboard.
      </p>

      {!fromDb && (
        <p className="border-brand-sun/30 bg-brand-sun/10 text-foreground mt-4 rounded-xl border px-4 py-3 text-sm">
          Database unavailable — user roles cannot be changed until the database
          is connected.
        </p>
      )}

      {fromDb && users.length === 0 && (
        <p className="text-muted-foreground mt-4 text-sm">No registered users yet.</p>
      )}

      {users.length > 0 && (
        <div className="border-border bg-card mt-4 overflow-hidden rounded-xl border">
          <div className="text-muted-foreground border-border hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_9rem_auto] gap-3 border-b px-4 py-2 text-xs font-medium sm:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span className="sr-only">Save</span>
          </div>
          <div className="divide-border divide-y">
            {users.map((user) => (
              <UserRoleForm
                key={user.id}
                user={user}
                isSelf={user.id === session.user.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
