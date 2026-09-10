/** Mirrors seeded projects in prisma/seed.ts. */
export const DEFAULT_PROJECTS = [
  {
    slug: "ainergy-5",
    name: "AINERGY 5",
    state: "Jaipur",
    discom: "JVVNL",
    capacityKW: 5,
    operationalUntil: "2040-03-31T00:00:00.000Z",
    description:
      "A 5 kW community solar plant in Jaipur on JVVNL, generating bill credits for reserved households.",
    heroImage: null,
    status: "ACTIVE" as const,
    commissionedAt: "2024-06-01T00:00:00.000Z",
  },
];
