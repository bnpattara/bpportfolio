/**
 * Client-side song matcher for Mirrorball: no API required.
 * Uses text similarity (word overlap + scoring) to match feelings to Taylor Swift songs.
 */

export type Song = {
  album: string;
  title: string;
  scene: string;
  human_truth: string;
  psych_concept?: string;
  tags?: string[];
  spotify_url?: string;
  youtube_url?: string;
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'i', 'me', 'my',
  'you', 'your', 'we', 'us', 'our', 'they', 'them', 'their', 'it', 'its',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'how',
  'when', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'about', 'into', 'out',
]);

function tokenize(text: string): Set<string> {
  const normalized = text
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^\w\s'-]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);
  const cleaned = words
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
  return new Set(cleaned);
}

function scoreOverlap(userTokens: Set<string>, songText: string): number {
  const songTokens = tokenize(songText);
  let matches = 0;
  for (const t of userTokens) {
    if (songTokens.has(t)) matches++;
    // Also check substrings for partial matches (e.g. "loved" vs "love")
    else if (t.length > 3) {
      for (const st of songTokens) {
        if (st.includes(t) || t.includes(st)) {
          matches += 0.7;
          break;
        }
      }
    }
  }
  const jaccard = matches / (userTokens.size + songTokens.size - matches) || 0;
  const simple = matches / Math.max(1, userTokens.size);
  return jaccard * 0.4 + simple * 0.6;
}

function scoreTagMatch(userTokens: Set<string>, tags: string[]): number {
  if (!tags || tags.length === 0) return 0;
  const tagSet = new Set(tags);
  let matches = 0;
  for (const t of userTokens) {
    if (tagSet.has(t)) {
      matches += 2.0;
    } else if (t.length > 3) {
      for (const tag of tagSet) {
        if (tag.includes(t) || t.includes(tag)) {
          matches += 1.4;
          break;
        }
      }
    }
  }
  const tagSize = tags.length;
  const jaccard = matches / (userTokens.size + tagSize - matches) || 0;
  const simple  = matches / Math.max(1, userTokens.size);
  return jaccard * 0.4 + simple * 0.6;
}

export function findMatchingSong(
  feeling: string,
  songs: Song[]): { song: Song; why: string } {
  const userTokens = tokenize(feeling);
  if (userTokens.size === 0) {
    const fallback = songs[Math.floor(Math.random() * songs.length)];
    return {
      song: fallback,
      why: `Sometimes the right song finds you when words fail. ${fallback.title} might be what you need right now.`,
    };
  }

  let bestScore = 0;
  let bestSong: Song = songs[0];
  let bestIndex = 0;

  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    const searchable = [
      s.human_truth,
      s.scene,
      s.title,
      s.psych_concept ?? '',
    ].join(' ');
    const contentScore = scoreOverlap(userTokens, searchable);
    const tagScore     = scoreTagMatch(userTokens, s.tags ?? []);
    const score        = tagScore * 0.5 + contentScore * 0.5;
    if (score > bestScore) {
      bestScore = score;
      bestSong = s;
      bestIndex = i;
    }
  }

  // Add slight randomness when scores are very close, so repeated inputs get variety
  const ties: { song: Song; idx: number }[] = [];
  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    const searchable = [
      s.human_truth,
      s.scene,
      s.title,
      s.psych_concept ?? '',
    ].join(' ');
    const contentScore = scoreOverlap(userTokens, searchable);
    const tagScore     = scoreTagMatch(userTokens, s.tags ?? []);
    const score        = tagScore * 0.5 + contentScore * 0.5;
    if (score >= bestScore * 0.85 && score > 0) {
      ties.push({ song: s, idx: i });
    }
  }
  const chosen = ties.length > 1
    ? ties[Math.floor(Math.random() * ties.length)]
    : { song: bestSong, idx: bestIndex };
  const song = chosen.song;

  const truthSnippet = (song.human_truth || song.scene || '').replace(/\.$/, '').slice(0, 120);
  const why = truthSnippet
    ? `Your feeling resonates with ${song.title}: "${truthSnippet}…"`
    : `${song.title} met you where you are.`;

  return { song, why };
}
