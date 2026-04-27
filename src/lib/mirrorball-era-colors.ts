/**
 * Three-stop palettes per `ALBUM_FACES` index (0–11) for era-locked gradients.
 * Hues are fan-recognizable shorthand, not official brand specs.
 */
export const ERA_COLOR_TRIPLES: readonly [string, string, string][] = [
  ['#3d6b4f', '#9bc9a8', '#f0f7f2'], // Taylor Swift
  ['#b8860b', '#f3e5ab', '#fffef8'], // Fearless (TV)
  ['#4a2c6e', '#a080c8', '#f0e8fa'], // Speak Now (TV)
  ['#a31c2f', '#2c0a0a', '#f3e6df'], // Red (TV)
  ['#5ba3c9', '#f2a88a', '#f7fbff'], // 1989 (TV)
  ['#050505', '#1a3d2e', '#6a6a6a'], // reputation
  ['#e29fc4', '#7eb8e0', '#fff5fa'], // Lover
  ['#4a5568', '#5f7a6e', '#e2e8e4'], // folklore
  ['#5c3d2e', '#c4835a', '#1f1812'], // evermore
  ['#141038', '#3d2f5c', '#b8a8d8'], // Midnights
  ['#c8c2b8', '#6e6a66', '#1c1b19'], // TTPD + Anthology
  ['#5c1a3c', '#d4af37', '#12080c'], // The Life of a Showgirl
] as const;

/** Flat list for the “all eras” shifting gradient (order matches faces). */
export const ALL_ERA_GRADIENT_STOPS = ERA_COLOR_TRIPLES.flat();
