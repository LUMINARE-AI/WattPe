import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about how WattPe's digital solar plans work, DISCOM compatibility, credits, and exit terms.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Can't find what you're looking for? Reach out on our Contact page."
      />
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div
          aria-hidden
          className="bg-brand-green/10 pointer-events-none absolute top-0 right-0 size-[420px] rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="bg-brand-cyan/10 pointer-events-none absolute bottom-0 left-0 size-[360px] rounded-full blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-14">
            <div className="lg:sticky lg:top-28">
              <div className="border-brand-green/20 bg-brand-green/10 mb-5 flex size-12 items-center justify-center rounded-2xl border">
                <HelpCircle className="text-brand-green size-5" />
              </div>
              <SectionHeading
                eyebrow="Answers"
                title="Everything you need to know"
                description="Quick answers on digital solar, DISCOM compatibility, credits, and exit terms."
              />
              <div className="border-border bg-card mt-8 rounded-2xl border p-5">
                <p className="text-sm font-medium">Still have questions?</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Our team is happy to help you pick a project and plan.
                </p>
                <Button className="mt-4" render={<Link href="/contact" />}>
                  Contact us <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <Accordion className="gap-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="border-border bg-card not-last:border-b-0 overflow-hidden rounded-2xl border px-4 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_8px_24px_rgba(15,31,31,0.05)] sm:px-5"
                >
                  <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                    <span className="flex items-start gap-3 pr-3">
                      <span className="bg-brand-green/10 text-brand-green mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pb-2 pl-10 leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>
    </>
  );
}
