export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

// Placeholder legal copy — to be replaced with counsel-reviewed text before launch.

export const TERMS: LegalDoc = {
  title: "Terms of Service",
  updated: "Last updated: 1 July 2026 (placeholder — pending legal review)",
  intro:
    "These Terms govern your use of the WattPe platform and any capacity you reserve in a WattPe-affiliated solar project.",
  sections: [
    {
      heading: "1. What WattPe provides",
      body: [
        "WattPe operates a platform that lets customers reserve capacity in community-scale solar projects and receive bill credits based on that capacity's share of a project's generation, per the terms of the plan selected at reservation.",
      ],
    },
    {
      heading: "2. Reservations and fees",
      body: [
        "A reservation fee is charged at the time you reserve capacity, priced according to the plan's tenure, credit rate, and target return as displayed at checkout. Fees are non-refundable except as expressly stated in your plan's terms or our Refund Policy.",
      ],
    },
    {
      heading: "3. Credits",
      body: [
        "Credits are calculated monthly based on your reserved capacity's promised generation allocation and applied to the electricity account you registered. Credits are non-transferable to another person or account.",
      ],
    },
    {
      heading: "4. Term and termination",
      body: [
        "Your reservation runs for the tenure specified by your selected plan. Early exit terms, where available, are disclosed at the time of reservation.",
      ],
    },
    {
      heading: "5. Limitation of liability",
      body: [
        "WattPe's platform depends on third-party DISCOM systems and physical solar generation, both of which are subject to factors outside our control. See our Disclaimer for further detail.",
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  updated: "Last updated: 1 July 2026 (placeholder — pending legal review)",
  intro:
    "This Privacy Policy explains what information WattPe collects, how we use it, and the choices you have.",
  sections: [
    {
      heading: "1. Information we collect",
      body: [
        "Account details you provide (name, email, phone), electricity account/DISCOM details needed to apply credits, and usage data from your interactions with the platform.",
      ],
    },
    {
      heading: "2. How we use your information",
      body: [
        "To operate your reservation and apply credits, to communicate with you about your account, and to improve the platform.",
      ],
    },
    {
      heading: "3. Sharing",
      body: [
        "We share the minimum information necessary with DISCOMs and payment processors to fulfil your reservation. We do not sell your personal information.",
      ],
    },
    {
      heading: "4. Your choices",
      body: [
        "You can request access to, correction of, or deletion of your personal information by contacting us — see our Contact page.",
      ],
    },
  ],
};

export const DISCLAIMER: LegalDoc = {
  title: "Disclaimer",
  updated: "Last updated: 1 July 2026 (placeholder — pending legal review)",
  intro:
    "Please read this disclaimer carefully before reserving capacity in any WattPe-affiliated solar project.",
  sections: [
    {
      heading: "Not a financial product",
      body: [
        "A WattPe reservation is a right to receive bill credits tied to a physical solar asset's generation — it is not a deposit, security, insurance product, or investment advised or guaranteed by WattPe.",
      ],
    },
    {
      heading: "Performance estimates",
      body: [
        "Savings figures, savings calculators, and credit projections shown on this site are estimates based on stated assumptions (generation, degradation, tariffs) and are not guarantees of actual performance. Actual generation and savings may differ due to weather, plant performance, degradation, and DISCOM policy changes.",
      ],
    },
    {
      heading: "Non-advisory",
      body: [
        "Nothing on this site constitutes financial, legal, or tax advice. You should evaluate whether a WattPe plan is right for you, including its tenure and any refund terms, before reserving capacity.",
      ],
    },
    {
      heading: "Regulatory dependency",
      body: [
        "WattPe's ability to apply credits to your electricity bill depends on continued DISCOM cooperation and applicable regulation, which may change over the life of your plan.",
      ],
    },
  ],
};
