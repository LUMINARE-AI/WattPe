"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Founder = {
  name: string;
  role: string;
  image: string;
  bios: string[];
};

const FOUNDERS: Founder[] = [
  {
    name: "Arin Danish",
    role: "Co-Founder | Technology & Energy Strategy",
    image: "/founders/arin-danish.svg",
    bios: [
      "Arin brings extensive experience across the energy sector, including Solar, Wind, Thermal and Oil & Gas, with expertise in project development, contracts management and project management. He has been involved in delivering projects across renewable energy and EHV infrastructure.",
      "At AINERGY, Arin focuses on technology, AI and digital energy solutions, driving the development of the intelligence layer behind AINERGY's Energy OS for C&I. His focus is on using technology to simplify energy decisions, optimize renewable-energy procurement and create smarter energy solutions.",
    ],
  },
  {
    name: "Asif Mustafa",
    role: "Co-Founder | Execution & Project Delivery",
    image: "/founders/asif-mustafa.svg",
    bios: [
      "Asif brings extensive experience across Solar, Wind and Thermal energy, with strong expertise in project management and execution. He has been involved in delivering multiple renewable-energy and EHV projects, with a strong focus on translating plans into successful project outcomes.",
      "At AINERGY, Asif focuses on execution, project delivery and renewable-energy infrastructure, ensuring that the company's energy solutions are built and delivered with strong operational discipline and quality.",
    ],
  },
];

function excerpt(text: string, max = 120) {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max).replace(/\s+\S*$/, "");
  return `${trimmed}…`;
}

export function FoundersSection() {
  const [activeFounder, setActiveFounder] = useState<Founder | null>(null);
  const closeModal = useCallback(() => setActiveFounder(null), []);

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {FOUNDERS.map((founder, index) => (
          <Reveal key={founder.name} delay={index * 80}>
            <article className="group border-border bg-card flex h-full flex-col items-center rounded-2xl border p-5 text-center shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(16,23,42,0.1)] sm:flex-row sm:items-start sm:gap-5 sm:p-5 sm:text-left">
              <div className="bg-brand-navy relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl sm:w-32">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 160px, 176px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {founder.name}
                </h3>
                <p className="text-primary mt-1.5 text-sm font-medium">
                  {founder.role}
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {excerpt(founder.bios[0])}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFounder(founder)}
                  className="border-border bg-muted/60 hover:border-primary/40 hover:bg-primary/10 hover:text-primary mt-5 inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  View profile
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Dialog
        open={activeFounder !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent
          showCloseButton
          className="max-h-[min(88dvh,720px)] gap-0 overflow-y-auto p-0 sm:max-w-lg"
        >
          {activeFounder && (
            <>
              <div className="bg-brand-navy relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={activeFounder.image}
                  alt={activeFounder.name}
                  fill
                  unoptimized
                  sizes="512px"
                  className="object-cover object-top"
                />
                <div className="from-popover pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent" />
              </div>
              <div className="px-6 pt-2 pb-8 sm:px-8">
                <DialogTitle className="text-2xl font-semibold">
                  {activeFounder.name}
                </DialogTitle>
                <DialogDescription className="text-primary mt-1.5 text-sm font-medium">
                  {activeFounder.role}
                </DialogDescription>
                <div className="text-foreground/90 mt-5 space-y-4 text-sm leading-relaxed sm:text-[15px]">
                  {activeFounder.bios.map((bio) => (
                    <p key={bio.slice(0, 48)}>{bio}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
