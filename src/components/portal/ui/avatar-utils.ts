export const AVATAR_COLORS = ['pink', 'blue', 'lime', 'mint', 'ink'] as const
export type AvatarColor = typeof AVATAR_COLORS[number]

export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Stable per-name color so the same user always gets the same avatar tint
// without storing anything. Cheap 32-bit rolling hash — collisions are fine
// (5 buckets, looks-like-random is enough).
export function pickAvatarColor(seed?: string | null): AvatarColor {
  if (!seed) return 'ink'
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
