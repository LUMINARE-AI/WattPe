import Link from "next/link";
import { FolderKanban, Wrench } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="bg-accent flex size-14 items-center justify-center rounded-full">
        <Wrench className="text-accent-foreground size-7" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-semibold">Admin console</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        Manage live projects shown on the marketing site. More tools (users,
        plans, KYC) will land here next.
      </p>
      <Link
        href="/admin/projects"
        className="border-border bg-card hover:border-primary/40 mt-8 inline-flex items-center gap-2 rounded-2xl border px-5 py-4 text-left shadow-sm transition-colors"
      >
        <span className="bg-brand-green/10 text-brand-green flex size-10 items-center justify-center rounded-xl">
          <FolderKanban className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Projects</span>
          <span className="text-muted-foreground block text-xs">
            Edit name, location, capacity, DISCOM, status
          </span>
        </span>
      </Link>
    </div>
  );
}
