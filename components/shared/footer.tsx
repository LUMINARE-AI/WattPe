import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { FOOTER_LINKS } from "@/lib/content/nav";

export function Footer() {
  return (
    <footer className="bg-brand-void relative mt-24 overflow-hidden text-white/90">
      <div
        aria-hidden
        className="from-brand-green/25 pointer-events-none absolute top-0 left-1/4 size-[420px] -translate-y-1/2 rounded-full bg-gradient-to-br via-brand-cyan/15 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="bg-brand-sun/10 pointer-events-none absolute right-0 bottom-0 size-[320px] translate-x-1/3 translate-y-1/3 rounded-full blur-3xl"
      />
      <Container className="relative grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo onDark />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Digital solar for everyone — reserve capacity in a shared solar
            plant and offset your electricity bills, no rooftop required.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="text-sm font-semibold text-white">{heading}</h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-leaf text-sm text-white/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WattPe Energy. All rights reserved.</p>
          <p>Registered office: Bengaluru, Karnataka, India</p>
        </Container>
      </div>
    </footer>
  );
}
