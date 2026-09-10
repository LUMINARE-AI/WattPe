import { model, models, type Schema } from "mongoose";

export function getModel(name: string, schema: Schema) {
  return models[name] ?? model(name, schema);
}

export function asDoc<T>(row: unknown): T | null {
  if (row == null) return null;
  if (Array.isArray(row)) return (row[0] as T | undefined) ?? null;
  return row as T;
}

export function asDocs<T>(rows: unknown): T[] {
  if (rows == null) return [];
  return (Array.isArray(rows) ? rows : [rows]) as T[];
}

