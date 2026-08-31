import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Sun, Leaf, TrendingDown } from "lucide-react";

const IMPACT_STATS = [
  { icon: Leaf, label: "CO2 avoided community-wide", value: "1,240 t" },
  { icon: Sun, label: "Solar capacity subscribed", value: "8.6 MW" },
  { icon: TrendingDown, label: "Avg. bill savings for members", value: "18%" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-void flex min-h-svh flex-col lg:flex-row">
      <div
        aria-hidden
        className="bg-brand-green/15 pointer-events-none fixed top-[-15%] right-[-10%] size-[480px] rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-brand-cyan/10 pointer-events-none fixed bottom-[-20%] left-[-10%] size-[420px] rounded-full blur-3xl"
      />

      {/* Form side */}
      <div className="relative flex flex-1 flex-col">
        <header className="relative p-6">
          <Link href="/">
            <Logo onDark />
          </Link>
        </header>
        <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
          {children}
        </main>
      </div>

      {/* Impact panel */}
      <div className="from-brand-green via-brand-cyan to-brand-void relative hidden w-full max-w-md flex-col justify-center overflow-hidden bg-gradient-to-br px-10 py-16 lg:flex">
        <div
          aria-hidden
          className="bg-brand-leaf/20 pointer-events-none absolute top-[-10%] right-[-20%] size-72 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="bg-brand-sun/25 pointer-events-none absolute bottom-[-15%] left-[-15%] size-64 rounded-full blur-3xl"
        />
        <div className="relative">
          <p className="text-brand-sun text-xs font-semibold tracking-wide uppercase">
            Community solar, done right
          </p>
          <h2 className="font-heading mt-3 text-3xl leading-tight font-semibold text-white">
            Power your home with the sun, not a rooftop.
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Every subscriber shares in a real solar plant &mdash; lower bills,
            cleaner grid, no panels required.
          </p>

          <dl className="mt-10 space-y-6">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="bg-white/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <stat.icon className="text-brand-sun size-5" />
                </div>
                <div>
                  <dd className="font-heading text-xl font-semibold text-white">
                    {stat.value}
                  </dd>
                  <dt className="text-xs text-white/60">{stat.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
