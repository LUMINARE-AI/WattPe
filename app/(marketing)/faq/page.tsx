import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
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
      <section className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <div className="border-border bg-card rounded-3xl border p-2 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)] sm:p-4">
            <Accordion>
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={item.question} value={`item-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
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
