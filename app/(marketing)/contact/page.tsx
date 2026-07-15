import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the WattPe team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Talk to us"
        title="We'd love to hear from you"
        description="Questions about a project, your reservation, or partnering with WattPe — send us a message."
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="border-border bg-card flex items-start gap-3 rounded-2xl border p-5 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)]">
              <span className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Mail className="text-primary size-5" />
              </span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground text-sm">hello@wattpe.com</p>
              </div>
            </div>
            <div className="border-border bg-card flex items-start gap-3 rounded-2xl border p-5 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)]">
              <span className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MapPin className="text-primary size-5" />
              </span>
              <div>
                <p className="font-medium">Registered office</p>
                <p className="text-muted-foreground text-sm">
                  Bengaluru, Karnataka, India
                </p>
              </div>
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
