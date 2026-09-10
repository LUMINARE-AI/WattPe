export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

const UNAVAILABLE_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "P1001", // Can't reach database server
  "P1002", // Database server timed out
  "P1017", // Server closed the connection
]);

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code =
    "code" in error && typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;

  if (code && UNAVAILABLE_CODES.has(code)) return true;

  // pg / Prisma sometimes nest the system error
  const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;
  if (cause && typeof cause === "object" && "code" in cause) {
    const nested = (cause as { code?: string }).code;
    if (nested && UNAVAILABLE_CODES.has(nested)) return true;
  }

  const message =
    "message" in error && typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message
      : "";

  return /ETIMEDOUT|ECONNREFUSED|ECONNRESET|timeout|Can't reach database/i.test(
    message,
  );
}
