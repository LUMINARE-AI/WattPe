import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="bg-background flex min-h-svh">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-border/60 bg-card/60 flex items-center justify-between border-b px-6 py-3 backdrop-blur">
          <div className="text-sm">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
          </div>
          <LogoutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
