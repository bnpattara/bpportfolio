'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { PenId, Song } from '@/lib/mirrorball-match';
import {
  ALBUM_FACES,
  buildPool,
  pickRandom,
  randomUint32,
  rollAlbumIndex,
} from '@/lib/mirrorball-dice';
import { ERA_COLOR_TRIPLES } from '@/lib/mirrorball-era-colors';
import songsData from '@/data/mirrorball-songs.json';

const ALL_SONGS = songsData as Song[];

/** UI phases; names map to animation states only. User-facing copy avoids “roll/d12” jargon. */
type Phase = 'setup' | 'rollingAlbum' | 'albumReady' | 'rollingSong' | 'result';

const PEN_COPY: Record<
  PenId,
  { label: string; fandom: string }
> = {
  glitter: {
    label: 'Glitter gel pen',
    fandom:
      'In Taylor’s published lyric books, the glitter gel marks the big, shiny, unapologetic lines: stadium hooks, glitter-bomb emotion, and pop-forward storytelling. Swifties use it as shorthand for “this one was written to sparkle.”',
  },
  quill: {
    label: 'Quill pen',
    fandom:
      'The quill is the storybook pen: ornate, folkloric, and literary. It’s the voice of winding narratives, fairy-tale framing, and eras that feel hand-inked in candlelight, like evergreen woods and time-bent verses.',
  },
  fountain: {
    label: 'Fountain pen',
    fandom:
      'Fountain ink is smooth, permanent, and confessional, like a pen that doesn’t lift once the truth starts. Fans read these tracks as the most soaked-through, intimate, and emotionally relentless writing on the page.',
  },
};

export default function ThirteenPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [fGlitter, setFGlitter] = useState(false);
  const [fQuill, setFQuill] = useState(false);
  const [fFountain, setFFountain] = useState(false);
  const [error, setError] = useState('');

  const [displayDie, setDisplayDie] = useState(1);
  const [faceIndex, setFaceIndex] = useState<number | null>(null);
  const [songPool, setSongPool] = useState<Song[]>([]);
  const [displaySongTitle, setDisplaySongTitle] = useState('');
  const [resultSong, setResultSong] = useState<Song | null>(null);

  const albumTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const songTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activePenSet = useMemo(() => {
    const s = new Set<PenId>();
    if (fGlitter) s.add('glitter');
    if (fQuill) s.add('quill');
    if (fFountain) s.add('fountain');
    return s;
  }, [fGlitter, fQuill, fFountain]);

  const eraLocked = faceIndex !== null;
  const lockedTriple =
    faceIndex !== null ? ERA_COLOR_TRIPLES[faceIndex] ?? ERA_COLOR_TRIPLES[0]! : null;

  useEffect(() => {
    return () => {
      if (albumTimerRef.current) clearInterval(albumTimerRef.current);
      if (songTimerRef.current) clearInterval(songTimerRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (albumTimerRef.current) {
      clearInterval(albumTimerRef.current);
      albumTimerRef.current = null;
    }
    if (songTimerRef.current) {
      clearInterval(songTimerRef.current);
      songTimerRef.current = null;
    }
    setPhase('setup');
    setError('');
    setFaceIndex(null);
    setSongPool([]);
    setResultSong(null);
    setDisplaySongTitle('');
    setDisplayDie(1);
  }, []);

  const startAlbumRoll = useCallback(() => {
    setError('');
    const idx = rollAlbumIndex();
    setPhase('rollingAlbum');
    let n = 0;
    if (albumTimerRef.current) clearInterval(albumTimerRef.current);
    const t = setInterval(() => {
      n += 1;
      setDisplayDie(1 + Math.floor(randomUint32() * 12));
      if (n >= 20) {
        clearInterval(t);
        albumTimerRef.current = null;
        setDisplayDie(idx + 1);
        const pool = buildPool(ALL_SONGS, idx, activePenSet);
        if (pool.length === 0) {
          setError(
            'No songs match these filters for that album. Widen or clear the pen filters and try again.',
          );
          setPhase('setup');
          return;
        }
        setFaceIndex(idx);
        setSongPool(pool);
        setPhase('albumReady');
      }
    }, 45);
    albumTimerRef.current = t;
  }, [activePenSet]);

  const startSongRoll = useCallback(() => {
    if (songPool.length === 0) return;
    const target = pickRandom(songPool);
    if (!target) return;
    setPhase('rollingSong');
    setDisplaySongTitle(songPool[0]!.title);
    let n = 0;
    if (songTimerRef.current) clearInterval(songTimerRef.current);
    const t = setInterval(() => {
      n += 1;
      const pick = songPool[Math.floor(randomUint32() * songPool.length)]!;
      setDisplaySongTitle(pick.title);
      if (n >= 24) {
        clearInterval(t);
        songTimerRef.current = null;
        setDisplaySongTitle(target.title);
        setResultSong(target);
        setPhase('result');
      }
    }, 40);
    songTimerRef.current = t;
  }, [songPool]);

  const showFilters = phase === 'setup';

  const eraCssVars: CSSProperties | undefined =
    eraLocked && lockedTriple
      ? {
          ['--e0' as string]: lockedTriple[0],
          ['--e1' as string]: lockedTriple[1],
          ['--e2' as string]: lockedTriple[2],
        }
      : undefined;

  return (
    <div className="page-13__view">
      <div className="page-13__era page-13__era--idle" aria-hidden />
      {eraLocked && lockedTriple ? (
        <div
          className="page-13__era page-13__era--locked"
          style={eraCssVars}
          aria-hidden
        >
          <div className="page-13__blob page-13__blob--a" />
          <div className="page-13__blob page-13__blob--b" />
          <div className="page-13__blob page-13__blob--c" />
        </div>
      ) : null}

      <nav id="site-nav" className="scrolled">
        <div className="nav-main">
          <div className="nav-left">
            <a href="/#work">Work</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/13" style={{ color: 'var(--black)' }}>13</a>
          </div>
          <a href="/" className="nav-wordmark">Benn Pattara</a>
          <div className="nav-right">
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>

      <main className="page-13__main">
        <div className="page-13__grid">
          <div className="page-13__thesis">
            <div className="page-13__rule" aria-hidden />
            <h1 className="page-13__display">13</h1>
            <p className="page-13__tagline">Your chapter. Your track.</p>

            <h2 className="eyebrow">The book</h2>
            <p className="page-13__prose">
              <em>13</em> is a book I wrote: an editorial lyric study built from Taylor Swift’s
              albums and songs. Each entry pairs a track with a cinematic <strong>scene</strong>, a
              plain-language <strong>human truth</strong>, and glitter gel, quill, and fountain tags,
              categorized by her own system that she’s shared with fans.
            </p>

            <h2 className="eyebrow">Thesis</h2>
            <p className="page-13__prose">
              My thesis is that her writing is broadly relatable because the story is transferable:
              under the metaphor and production there is almost always a feeling, whether grief,
              pride, longing, relief, or the need to be seen, that you could hand to someone who has
              never followed a release cycle and they would still recognize it. The universal human
              truth is the relay; the era is packaging.
            </p>

            <p className="page-13__prose">
              Draw a chapter, then a track, to surface one entry from that archive.
            </p>

            <h2 className="eyebrow">Full manuscript</h2>
            <p className="page-13__prose">
              Read the full manuscript as I laid it out for print: front matter, chapter openers, and
              every song entry, with keyboard shortcuts and on-page controls.
            </p>
            <p className="page-13__book-cta">
              <Link href="/13/book" className="link-underline">
                Open the full book
              </Link>
              <span className="page-13__book-cta-sep" aria-hidden>
                ·
              </span>
              <a
                href="/book/13-full/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                New tab
              </a>
            </p>

            <p className="page-13__note">
              Original writing and analysis by me, not official. Pen tags follow the same system she’s
              shared with fans. Not affiliated with Taylor Swift or TAS Rights Management.
            </p>
          </div>

          <aside
            className={`page-13__instrument${eraLocked ? ' page-13__instrument--era' : ''}`}
            style={eraCssVars}
          >
            {error && <p className="page-13__error" role="alert">{error}</p>}

            {showFilters && (
              <div>
                <span className="eyebrow">Pen filters (optional)</span>
                <p className="page-13__filter-lede">
                  Each filter narrows the draw using the pen tags from the system she’s shared with
                  fans. Mix pens to blend moods.
                </p>
                <div className="page-13__pen-list" role="group" aria-label="Pen type filters">
                  <label
                    className={`page-13__pen${fGlitter ? ' page-13__pen--on' : ''}`}
                    title={PEN_COPY.glitter.fandom}
                  >
                    <div className="page-13__pen-head">
                      <input
                        type="checkbox"
                        checked={fGlitter}
                        onChange={(e) => setFGlitter(e.target.checked)}
                      />
                      <span className="page-13__pen-title">{PEN_COPY.glitter.label}</span>
                    </div>
                    <p className="page-13__pen-body">{PEN_COPY.glitter.fandom}</p>
                  </label>
                  <label
                    className={`page-13__pen${fQuill ? ' page-13__pen--on' : ''}`}
                    title={PEN_COPY.quill.fandom}
                  >
                    <div className="page-13__pen-head">
                      <input
                        type="checkbox"
                        checked={fQuill}
                        onChange={(e) => setFQuill(e.target.checked)}
                      />
                      <span className="page-13__pen-title">{PEN_COPY.quill.label}</span>
                    </div>
                    <p className="page-13__pen-body">{PEN_COPY.quill.fandom}</p>
                  </label>
                  <label
                    className={`page-13__pen${fFountain ? ' page-13__pen--on' : ''}`}
                    title={PEN_COPY.fountain.fandom}
                  >
                    <div className="page-13__pen-head">
                      <input
                        type="checkbox"
                        checked={fFountain}
                        onChange={(e) => setFFountain(e.target.checked)}
                      />
                      <span className="page-13__pen-title">{PEN_COPY.fountain.label}</span>
                    </div>
                    <p className="page-13__pen-body">{PEN_COPY.fountain.fandom}</p>
                  </label>
                </div>
              </div>
            )}

            {phase === 'setup' && (
              <div>
                <span className="eyebrow">Step 1</span>
                <button type="button" className="page-13__btn-primary" onClick={startAlbumRoll}>
                  Draw a chapter →
                </button>
              </div>
            )}

            {phase === 'rollingAlbum' && (
              <div
                className="page-13__dice-wrap"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <p className="page-13__status">Finding your chapter…</p>
                <div className="page-13__dice-stage" aria-hidden>
                  <div className="page-13__dice-num">{displayDie}</div>
                </div>
                <p className="page-13__hint">One of twelve eras</p>
              </div>
            )}

            {phase === 'albumReady' && faceIndex !== null && (
              <div>
                <span className="eyebrow">You landed on</span>
                <p className="page-13__album-name">{ALBUM_FACES[faceIndex]!.displayName}</p>
                <p className="page-13__pool-count">
                  {songPool.length} song{songPool.length === 1 ? '' : 's'} in this draw
                </p>
                <span className="eyebrow page-13__spaced-label">Step 2</span>
                <button type="button" className="page-13__btn-primary" onClick={startSongRoll}>
                  Draw a track →
                </button>
              </div>
            )}

            {phase === 'rollingSong' && (
              <div
                className="page-13__dice-wrap"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <p className="page-13__status">Letting the right title surface…</p>
                <div className="page-13__dice-stage page-13__dice-stage--song">
                  <p className="page-13__dice-title" title={displaySongTitle}>
                    {displaySongTitle}
                  </p>
                </div>
                <p className="page-13__hint">From this chapter’s pool</p>
              </div>
            )}

            {phase === 'result' && resultSong && (
              <div>
                <div className="page-13__result-title">{resultSong.title}</div>
                <div className="page-13__result-album">{resultSong.album}</div>

                <div className="page-13__field">
                  <div className="page-13__field-label">The Scene</div>
                  <p className="page-13__scene">{resultSong.scene}</p>
                </div>

                <div className="page-13__field">
                  <div className="page-13__field-label">The Truth</div>
                  <p className="page-13__truth">{resultSong.human_truth}</p>
                </div>

                {resultSong.psych_concept && (
                  <p className="page-13__psych">[ {resultSong.psych_concept} ]</p>
                )}

                <div className="page-13__actions">
                  <a
                    className="page-13__action page-13__action--fill"
                    href={resultSong.spotify_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ Open in Spotify
                  </a>
                  <a
                    className="page-13__action page-13__action--line"
                    href={resultSong.youtube_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ Watch Lyric Video
                  </a>
                </div>

                <button type="button" className="page-13__reset" onClick={reset}>
                  ← Draw again
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
