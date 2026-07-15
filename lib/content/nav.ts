export const MAIN_NAV = [
  { label: "Process", href: "/how-it-works" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about-us" },
  { label: "Safety", href: "/safety-transparency" },
  { label: "FAQ", href: "/faq" },
] as const;

export const FOOTER_LINKS = {
  Company: [
    { label: "About Us", href: "/about-us" },
    { label: "Safety & Transparency", href: "/safety-transparency" },
    { label: "Contact", href: "/contact" },
  ],
  Product: [
    { label: "Process", href: "/how-it-works" },
    { label: "Projects", href: "/projects" },
    { label: "EV Charging", href: "/ev-charging" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
  ],
} as const;
