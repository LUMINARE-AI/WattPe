export type ProjectTint = {
  name: string;
  bgVar: string;
  lineVar: string;
  avatarVar: string;
};

const TINTS: ProjectTint[] = [
  { name: "terracotta", bgVar: "--tint-terracotta-bg", lineVar: "--tint-terracotta-line", avatarVar: "--tint-terracotta-avatar" },
  { name: "sage", bgVar: "--tint-sage-bg", lineVar: "--tint-sage-line", avatarVar: "--tint-sage-avatar" },
  { name: "teal", bgVar: "--tint-teal-bg", lineVar: "--tint-teal-line", avatarVar: "--tint-teal-avatar" },
  { name: "marigold", bgVar: "--tint-marigold-bg", lineVar: "--tint-marigold-line", avatarVar: "--tint-marigold-avatar" },
  { name: "clayrose", bgVar: "--tint-clayrose-bg", lineVar: "--tint-clayrose-line", avatarVar: "--tint-clayrose-avatar" },
];

// Deterministic per-project tint: same project id always gets the same
// color, but different projects spread across the fixed palette.
export function getProjectTint(id: string): ProjectTint {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length];
}

// "Bellandur 250" -> "B.250", "Kalyan 80" -> "K.80"
export function getProjectCode(name: string): string {
  const match = name.match(/^(\S)\S*\s+(\d+)/);
  if (match) return `${match[1].toUpperCase()}.${match[2]}`;
  return name.slice(0, 4).toUpperCase();
}
