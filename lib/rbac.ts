export type AppRole = "USER" | "ADMIN" | "FINANCE";

export function hasAdminAccess(role: string | undefined): boolean {
  return role === "ADMIN";
}

export function hasFinanceAccess(role: string | undefined): boolean {
  return role === "ADMIN" || role === "FINANCE";
}
