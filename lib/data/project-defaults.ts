/** Mirrors seeded projects in prisma/seed.ts. */
export const DEFAULT_PROJECTS = [
  {
    slug: "vega-150",
    name: "Bellandur 250",
    state: "Karnataka",
    discom: "BESCOM",
    capacityKW: 250,
    operationalUntil: "2040-03-31T00:00:00.000Z",
    description:
      "A 250 kW community solar plant near Bengaluru, generating credits for over 60 reserved households.",
    heroImage: null,
    status: "ACTIVE" as const,
    commissionedAt: "2024-06-01T00:00:00.000Z",
  },
  {
    slug: "helios-80",
    name: "Kalyan 80",
    state: "Maharashtra",
    discom: "Adani Electricity Mumbai",
    capacityKW: 80,
    operationalUntil: "2039-12-31T00:00:00.000Z",
    description:
      "An 80 kW rooftop-scale community plant serving Mumbai households on Adani Electricity.",
    heroImage: null,
    status: "ACTIVE" as const,
    commissionedAt: "2024-11-01T00:00:00.000Z",
  },
];
