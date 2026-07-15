import { Container } from "@/components/shared/container";
import type { LegalDoc } from "@/lib/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          {doc.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{doc.updated}</p>

        <div className="prose prose-neutral dark:prose-invert prose-headings:font-heading prose-a:text-primary mt-10 max-w-none">
          <p>{doc.intro}</p>
          {doc.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
