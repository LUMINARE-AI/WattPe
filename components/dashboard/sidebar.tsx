"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  PiggyBank,
  FileText,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

const NAV = [
  { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/user/generation", label: "Generation", icon: Sun },
  { href: "/dashboard/user/savings", label: "Savings", icon: PiggyBank },
  { href: "/dashboard/user/plan", label: "Plan", icon: FileText },
  { href: "/dashboard/user/payments", label: "Payments", icon: Receipt },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border/60 bg-card hidden w-64 shrink-0 border-r md:block">
      <div className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="space-y-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard/user"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
