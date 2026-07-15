"use client";

import { useEffect, useRef, useState } from "react";
import { Info, RefreshCcw, Search, Home, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    eyebrow: "Step 1",
    title: "Join a solar project",
    description:
      "Reserve the solar you need to offset your monthly power bill from an active project. You get credits for the power produced from your reserved panels.",
    tip: "1 credit = ₹1 offset on your power bill",
    tone: "coral" as const,
  },
  {
    eyebrow: "Step 2",
    title: "Link your power provider",
    description:
      "Connect your DISCOM account in a couple of clicks so credits can flow straight onto your electricity bill — link multiple connections anytime.",
    tip: "Link multiple electricity connections anytime",
    tone: "navy" as const,
  },
  {
    eyebrow: "Step 3",
    title: "Offset bills with credits",
    description:
      "Every month, the plant's generation is converted into credits at your locked-in rate and applied to your bill automatically — unused credits roll over.",
    tip: "Unused credits roll over — nothing goes to waste",
    tone: "teal" as const,
  },
];

const TONE_TEXT = {
  coral: "text-brand-green",
  navy: "text-brand-void",
  teal: "text-brand-teal",
};

export function ScrollSteps() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((node, i) => {
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From sign-up to savings in three steps"
          align="center"
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex min-h-[65vh] flex-col justify-center lg:min-h-[75vh]"
              >
                <p
                  className={cn(
                    "text-sm font-semibold tracking-wide uppercase transition-colors",
                    active === i ? TONE_TEXT[step.tone] : "text-muted-foreground/50",
                  )}
                >
                  {step.eyebrow}
                </p>
                <h3 className="font-heading mt-2 text-2xl font-bold sm:text-3xl">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-accent mt-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm">
                  <Info className="text-brand-green size-4 shrink-0" />
                  {step.tip}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28 h-[520px]">
              <div className="relative h-full w-full">
                <StepMockCard active={active === 0}>
                  <ReserveSolarMock />
                </StepMockCard>
                <StepMockCard active={active === 1}>
                  <ChooseUtilityMock />
                </StepMockCard>
                <StepMockCard active={active === 2}>
                  <PayBillMock />
                </StepMockCard>
              </div>
            </div>
          </div>

          {/* Compact non-sticky mock for small screens, shows the active step only */}
          <div className="lg:hidden">
            <div className="relative h-[420px]">
              <StepMockCard active={active === 0}>
                <ReserveSolarMock />
              </StepMockCard>
              <StepMockCard active={active === 1}>
                <ChooseUtilityMock />
              </StepMockCard>
              <StepMockCard active={active === 2}>
                <PayBillMock />
              </StepMockCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StepMockCard({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-500",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function MockFrame({
  accent,
  children,
}: {
  accent: "coral" | "navy" | "teal";
  children: React.ReactNode;
}) {
  const accentBg = {
    coral: "bg-brand-green/10",
    navy: "bg-brand-void/10",
    teal: "bg-brand-teal/15",
  }[accent];

  return (
    <div className={cn("h-full rounded-[28px] p-3", accentBg)}>
      <div className="border-border h-full overflow-hidden rounded-3xl border bg-white shadow-[0_1px_2px_rgba(30,39,73,0.05),0_24px_60px_rgba(30,39,73,0.12)]">
        {children}
      </div>
    </div>
  );
}

function ReserveSolarMock() {
  return (
    <MockFrame accent="coral">
      <div className="p-6">
        <h4 className="text-brand-green font-heading text-lg font-bold">
          Reserve Solar
        </h4>
        <div className="bg-brand-green/10 border-brand-green/20 mt-4 flex items-center justify-between rounded-xl border p-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-brand-green/20 flex size-9 items-center justify-center rounded-lg text-base">
              🏢
            </span>
            <div>
              <p className="text-sm font-semibold">Bengaluru, KA</p>
              <p className="text-muted-foreground text-xs">140 kW</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Available Solar</p>
            <p className="text-sm font-bold">86 kW</p>
          </div>
        </div>

        <p className="text-muted-foreground mt-5 mb-1.5 text-xs">
          Enter your avg power bill
        </p>
        <div className="border-border flex items-center gap-2 rounded-xl border bg-white p-3">
          <span className="text-muted-foreground text-sm">₹</span>
          <span className="text-sm font-semibold">1,500</span>
        </div>

        <p className="mt-5 mb-2 text-xs font-semibold">Choose monthly savings</p>
        <div className="bg-muted relative h-2 rounded-full">
          <div className="bg-brand-green absolute inset-y-0 left-0 rounded-full" style={{ width: "42%" }} />
          <div className="bg-brand-green absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: "42%" }} />
        </div>
        <p className="text-brand-green mt-1 text-right text-xs font-bold">42%</p>

        <div className="border-border bg-muted/40 mt-5 flex items-center justify-between rounded-xl border p-3">
          <span className="text-muted-foreground text-xs">Updated Bill Amount</span>
          <span className="text-sm font-bold">₹868</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="border-border rounded-xl border p-3">
            <p className="text-sm font-bold">1,020 W</p>
            <p className="text-muted-foreground text-xs">Reserved</p>
          </div>
          <div className="border-border rounded-xl border p-3">
            <p className="text-brand-green text-sm font-bold">₹632</p>
            <p className="text-muted-foreground text-xs">Monthly savings</p>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function ChooseUtilityMock() {
  return (
    <MockFrame accent="navy">
      <div className="p-6">
        <h4 className="text-brand-void font-heading text-lg font-bold">
          Choose your utility
        </h4>

        <p className="text-muted-foreground mt-5 mb-1.5 text-xs">Utility Provider</p>
        <div className="border-border flex items-center justify-between rounded-xl border p-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-brand-void/10 flex size-8 items-center justify-center rounded-full text-xs">
              ⚡
            </span>
            <span className="text-sm font-bold">BESCOM</span>
          </div>
          <RefreshCcw className="text-muted-foreground size-4" />
        </div>

        <p className="text-muted-foreground mt-4 mb-1.5 text-xs">Your Customer ID</p>
        <div className="border-border flex items-center justify-between rounded-xl border p-3">
          <span className="text-sm font-semibold">6405601234</span>
          <Search className="text-muted-foreground size-4" />
        </div>

        <p className="text-muted-foreground mt-5 mb-2 text-xs">Save Bill As</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-brand-void inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-white">
            <Home className="size-3" /> My Flat
          </span>
          <span className="bg-muted inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium">
            Office
          </span>
          <span className="bg-muted inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium">
            Parents Home
          </span>
          <span className="bg-muted inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium">
            +
          </span>
        </div>
      </div>
    </MockFrame>
  );
}

function PayBillMock() {
  return (
    <MockFrame accent="teal">
      <div className="p-6">
        <h4 className="text-brand-teal font-heading text-lg font-bold">
          Pay monthly bill
        </h4>

        <div className="bg-brand-teal/10 border-brand-teal/25 mt-4 flex items-center justify-between rounded-xl border p-3">
          <div>
            <p className="text-sm font-semibold">My Flat</p>
            <p className="text-muted-foreground text-xs">6405601234</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Due Date</p>
            <p className="text-sm font-semibold">29 Jan</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs">You Paid</p>
            <p className="text-2xl font-bold">₹825</p>
          </div>
          <CheckCircle2 className="text-brand-teal size-9" />
        </div>

        <div className="border-border mt-5 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Actual Bill Amount</span>
            <span className="font-medium">₹1,457</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Date</span>
            <span className="font-medium">21 Jan</span>
          </div>
        </div>

        <div className="bg-brand-teal/10 mt-4 rounded-xl p-3 text-center text-sm font-semibold">
          43% saved on this bill
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Successfully paid to <span className="font-semibold">BESCOM</span>
        </p>
      </div>
    </MockFrame>
  );
}
