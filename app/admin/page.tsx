import { Wrench } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="bg-accent flex size-14 items-center justify-center rounded-full">
        <Wrench className="text-accent-foreground size-7" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-semibold">
        Admin console — coming in Phase 2
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        Project &amp; plant management, user administration, plan
        configuration, KYC review, and site content tools will live here.
        You have admin access, so this route will unlock automatically once
        it ships.
      </p>
    </div>
  );
}
