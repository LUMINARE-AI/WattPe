"use client";

import { useEffect, useRef, useState } from "react";
import {
  SolarPanelIllustration,
  MeterIllustration,
  SavingsIllustration,
} from "@/components/marketing/illustrations";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const PANELS = [
  {
    question: "Where do credits come from?",
    answer:
      "Every credit you receive traces back to real, independently metered solar output from your reserved capacity in a live community plant — never an estimate.",
    node: "plant" as const,
    tone: "coral" as const,
  },
  {
    question: "How many credits do I get?",
    answer:
      "Your monthly credit is your reserved capacity's share of the plant's actual generation that month, valued at your plan's locked-in credit rate per unit.",
    node: "engine" as const,
    tone: "navy" as const,
  },
  {
    question: "Why is my rate locked in?",
    answer:
      "Your ₹/unit credit rate is fixed the day you reserve and steps up on schedule, so your savings compound instead of eroding as grid tariffs rise.",
    node: "engine" as const,
    tone: "navy" as const,
  },
  {
    question: "What happens to unused credits?",
    answer:
      "Unused credits roll over automatically and can offset multiple linked DISCOM accounts — nothing you've earned ever goes to waste.",
    node: "bill" as const,
    tone: "teal" as const,
  },
];

const DISCOMS = ["BESCOM", "MSEDCL", "Adani Mumbai"];

export function CreditFlowExplainer() {
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

  const activeNode = PANELS[active].node;

  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How credits flow"
          title="From sunlight to your bill"
          align="center"
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <FlowDiagram activeNode={activeNode} />
            </div>
          </div>

          <div className="lg:hidden">
            <FlowDiagram activeNode={activeNode} />
          </div>

          <div className="flex flex-col lg:order-first">
            {PANELS.map((panel, i) => (
              <div
                key={panel.question}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex min-h-[65vh] flex-col justify-center lg:min-h-[75vh]"
              >
                <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                  {panel.question}
                </h3>
                <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed">
                  {panel.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FlowDiagram({
  activeNode,
}: {
  activeNode: "plant" | "engine" | "bill";
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <FlowNode
        label="Solar plant generates"
        active={activeNode === "plant"}
        tone="coral"
      >
        <SolarPanelIllustration className="size-20" />
      </FlowNode>

      <div className="bg-border h-10 w-px" />

      <FlowNode
        label="Credits calculated"
        active={activeNode === "engine"}
        tone="navy"
      >
        <MeterIllustration className="size-20" />
      </FlowNode>

      <div className="bg-border h-10 w-px" />

      <FlowNode
        label="Applied to your bill"
        active={activeNode === "bill"}
        tone="teal"
      >
        <SavingsIllustration className="size-20" />
      </FlowNode>

      <div
        className={cn(
          "mt-4 flex flex-wrap justify-center gap-2 transition-opacity duration-500",
          activeNode === "bill" ? "opacity-100" : "opacity-40",
        )}
      >
        {DISCOMS.map((d) => (
          <span
            key={d}
            className="border-brand-teal/30 bg-brand-teal/10 rounded-full border px-3 py-1 text-xs font-medium"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlowNode({
  label,
  active,
  tone,
  children,
}: {
  label: string;
  active: boolean;
  tone: "coral" | "navy" | "teal";
  children: React.ReactNode;
}) {
  const ring = {
    coral: "ring-brand-green/40 bg-brand-green/5",
    navy: "ring-brand-void/30 bg-brand-void/5",
    teal: "ring-brand-teal/40 bg-brand-teal/5",
  }[tone];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className={cn(
          "flex size-32 items-center justify-center rounded-full ring-2 transition-all duration-500",
          active ? cn(ring, "scale-105 ring-4") : "bg-card ring-border scale-100",
        )}
      >
        {children}
      </div>
      <p
        className={cn(
          "text-sm font-semibold transition-colors",
          active ? "text-foreground" : "text-muted-foreground/60",
        )}
      >
        {label}
      </p>
    </div>
  );
}
