import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="bg-brand-void flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white/5">
        <ShieldAlert className="text-brand-sun size-7" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-semibold text-white">
        You don&apos;t have access to this page
      </h1>
      <p className="mt-2 max-w-sm text-sm text-white/60">
        This section is restricted to certain WattPe team roles. If you think
        this is a mistake, contact your administrator.
      </p>
      <Button className="mt-8" render={<Link href="/dashboard/user" />}>
        Go to your dashboard
      </Button>
    </div>
  );
}
