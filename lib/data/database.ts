export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    return code === "ECONNREFUSED" || code === "P1001" || code === "P1017";
  }
  return false;
}
