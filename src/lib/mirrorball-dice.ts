import type { PenId, Song } from '@/lib/mirrorball-match';
import penOverrides from '@/data/mirrorball-pen-overrides.json';

type PenOverrideMap = Record<string, PenId>;

const OVERRIDES: PenOverrideMap = penOverrides as PenOverrideMap;

/** Twelve-sided album faces (1–12). Face 11 merges TTPD + Anthology. */
export const ALBUM_FACES = [
  { displayName: 'Taylor Swift', albumKeys: ['Taylor Swift'] as const },
  { displayName: "Fearless (Taylor's Version)", albumKeys: ['Fearless (Taylor\'s Version)'] as const },
  { displayName: "Speak Now (Taylor's Version)", albumKeys: ['Speak Now (Taylor\'s Version)'] as const },
  { displayName: "Red (Taylor's Version)", albumKeys: ['Red (Taylor\'s Version)'] as const },
  { displayName: "1989 (Taylor's Version)", albumKeys: ['1989 (Taylor\'s Version)'] as const },
  { displayName: 'reputation', albumKeys: ['reputation'] as const },
  { displayName: 'Lover', albumKeys: ['Lover'] as const },
  { displayName: 'folklore', albumKeys: ['folklore'] as const },
  { displayName: 'evermore', albumKeys: ['evermore'] as const },
  { displayName: 'Midnights', albumKeys: ['Midnights'] as const },
  {
    displayName: 'TTPD + The Anthology',
    albumKeys: ['The Tortured Poets Department', 'TTPD: The Anthology'] as const,
  },
  { displayName: 'The Life of a Showgirl', albumKeys: ['The Life of a Showgirl'] as const },
] as const;

export function songKey(song: Pick<Song, 'album' | 'title'>): string {
  return `${song.album}::${song.title}`;
}

export function resolvePenForSong(song: Pick<Song, 'album' | 'title'>): PenId {
  const o = OVERRIDES[songKey(song)];
  return o ?? 'glitter';
}

export function randomUint32(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0]! / 0x1_0000_0000;
  }
  return Math.random();
}

/** 0..11 (twelve faces) */
export function rollAlbumIndex(): number {
  return Math.floor(randomUint32() * 12);
}

export function filterSongsByAlbums(songs: readonly Song[], albumKeys: readonly string[]): Song[] {
  const set = new Set(albumKeys);
  return songs.filter((s) => set.has(s.album));
}

/**
 * @param activePens — empty set = no filter (all songs). Non-empty = keep songs whose pen is in the set.
 */
export function filterSongsByPens(
  songs: readonly Song[],
  activePens: ReadonlySet<PenId>,
  getPen: (s: Song) => PenId,
): Song[] {
  if (activePens.size === 0) {
    return [...songs];
  }
  return songs.filter((s) => activePens.has(getPen(s)));
}

export function pickRandom<T>(arr: readonly T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(randomUint32() * arr.length)]!;
}

export function buildPool(
  allSongs: readonly Song[],
  faceIndex: number,
  activePens: ReadonlySet<PenId>,
): Song[] {
  const face = ALBUM_FACES[faceIndex];
  if (!face) return [];
  const inAlbum = filterSongsByAlbums(allSongs, face.albumKeys);
  return filterSongsByPens(inAlbum, activePens, resolvePenForSong);
}
