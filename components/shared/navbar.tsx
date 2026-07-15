"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { MAIN_NAV } from "@/lib/content/nav";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/75 hover:text-primary relative text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button render={<Link href="/projects" />}>
            Get Started <ArrowRight className="size-4" />
          </Button>
        </div>

        <button
          type="button"
          className="text-foreground hover:bg-muted -mr-2 rounded-md p-2 transition-colors md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-border/60 bg-background animate-in fade-in slide-in-from-top-2 border-t duration-200 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground/80 hover:bg-muted hover:text-primary rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-3">
              <Button
                variant="outline"
                render={<Link href="/login" onClick={() => setOpen(false)} />}
              >
                Log in
              </Button>
              <Button
                render={
                  <Link href="/projects" onClick={() => setOpen(false)} />
                }
              >
                Get Started
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
