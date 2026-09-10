export function hasDatabase() {
  return Boolean(process.env.MONGODB_URI);
}

const UNAVAILABLE_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
]);

const UNAVAILABLE_NAMES = new Set([
  "MongoNetworkError",
  "MongoServerSelectionError",
  "MongoTimeoutError",
  "MongooseServerSelectionError",
  "MongoNetworkTimeoutError",
]);

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const name =
    "name" in error && typeof (error as { name?: unknown }).name === "string"
      ? (error as { name: string }).name
      : undefined;
  if (name && UNAVAILABLE_NAMES.has(name)) return true;

  const code =
    "code" in error && typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;

  if (code && UNAVAILABLE_CODES.has(code)) return true;

  const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;
  if (cause && typeof cause === "object" && "code" in cause) {
    const nested = (cause as { code?: string }).code;
    if (nested && UNAVAILABLE_CODES.has(nested)) return true;
  }

  const message =
    "message" in error && typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message
      : "";

  return /ETIMEDOUT|ECONNREFUSED|ECONNRESET|timeout|Server selection timed out|failed to connect/i.test(
    message,
  );
}
