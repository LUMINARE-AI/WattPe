"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export function dashboardHref(role?: string) {
  if (role === "FINANCE") return "/finance";
  return "/dashboard/user";
}

function initials(user: NavbarUser) {
  const source = user.name?.trim() || user.email || "?";
  return source.charAt(0).toUpperCase();
}

export function NavbarUserMenu({ user }: { user: NavbarUser }) {
  const href = dashboardHref(user.role);
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="cursor-pointer rounded-full outline-none hover:opacity-90 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback>{initials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="text-foreground truncate text-sm font-medium">
              {user.name || "Account"}
            </p>
            {user.email ? (
              <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          nativeButton={false}
          render={<Link href={href} />}
        >
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onClick={() => {
            startTransition(() => {
              logoutAction();
            });
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
