export const ROLES = ["USER", "ADMIN", "FINANCE"] as const;
export type Role = (typeof ROLES)[number];

export const KYC_STATUSES = ["NOT_STARTED", "PENDING", "VERIFIED", "REJECTED"] as const;
export type KycStatus = (typeof KYC_STATUSES)[number];

export const PROJECT_STATUSES = ["UPCOMING", "ACTIVE", "FULL", "CLOSED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const RESERVATION_STATUSES = [
  "PENDING_PAYMENT",
  "ACTIVE",
  "CLOSED",
  "CANCELLED",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const PAYMENT_TYPES = ["RESERVATION_FEE", "REFUND", "OTHER"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_STATUSES = ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const READING_SOURCES = ["SEEDED", "MANUAL", "INVERTER_API"] as const;
export type ReadingSource = (typeof READING_SOURCES)[number];

export const OFFSET_STATUSES = ["PENDING", "APPLIED"] as const;
export type OffsetStatus = (typeof OFFSET_STATUSES)[number];
