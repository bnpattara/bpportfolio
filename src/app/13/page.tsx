'use client';

import { useEffect, useState } from 'react';
import { findMatchingSong, type Song } from '@/lib/mirrorball-match';
import songsData from '@/data/mirrorball-songs.json';

const songs = songsData as Song[];

type State = 'input' | 'loading' | 'result';

export default function ThirteenPage() {
  const [state, setState] = useState<State>('input');
  const [feeling, setFeeling] = useState('');
  const [result, setResult] = useState<{ song: Song; why: string } | null>(null);
  const [error, setError] = useState('');

  /* Lock body scroll on desktop so page never scrolls */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = (matches: boolean) => {
      document.body.style.overflow = matches ? 'hidden' : '';
    };
    apply(mq.matches);
    mq.addEventListener('change', (e) => apply(e.matches));
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function findSong() {
    const trimmed = feeling.trim();
    if (!trimmed || trimmed.length < 3) {
      setError('Tell me a little more (even just a few words.');
      return;
    }
    setError('');
    setState('loading');

    // Client-side fallback) always succeeds
    const clientMatch = () => {
      const match = findMatchingSong(trimmed, songs);
      setResult(match);
      setState('result');
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const res = await fetch('/api/mirrorball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling: trimmed }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data?.song) {
          setResult(data);
          setState('result');
          return;
        }
      }
      // Non-OK response (including 429) → silent fallback
      clientMatch();
    } catch {
      // Network error, timeout, abort → silent fallback
      clientMatch();
    }
  }

  function reset() {
    setFeeling('');
    setResult(null);
    setError('');
    setState('input');
  }

  return (<>
      {/* ── NAV · always light (white bg, dark text) ── */}
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

      {/* ── MAIN ── */}
      <main className="main-13">
        <div className="grid-13">

          {/* Left column · constant */}
          <div className="col-left-13">
            <div className="title-13">13</div>
            <p className="subtitle-13">Every feeling has a song.</p>
            <p className="desc-13">Type a feeling. Get your Taylor Swift song.</p>
          </div>

          {/* Right column · switches by state */}
          <div className="col-right-13">

            {state === 'input' && (<div>
                <p className="label-13">Tell me how you feel</p>
                <textarea
                  className="textarea-13"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), findSong())}
                  placeholder="Type a sentence, a feeling, a moment you can't shake…"
                  maxLength={500}
                />
                {error && <p className="error-13">{error}</p>}
                <button className="btn-find-13" onClick={findSong}>
                  Find My Song →
                </button>
              </div>)}

            {state === 'loading' && (<div className="loading-13">
                <div className="loading-bar-13" />
                <p className="loading-text-13">Finding your song…</p>
              </div>)}

            {state === 'result' && result && (<div className="result-13">
                <div className="song-title-13">{result.song.title}</div>
                <div className="song-album-13">{result.song.album}</div>

                <div className="field-group-13">
                  <div className="field-label-13">The Scene</div>
                  <p className="scene-text-13">{result.song.scene}</p>
                </div>

                <div className="field-group-13">
                  <div className="field-label-13">The Truth</div>
                  <p className="truth-text-13">{result.song.human_truth}</p>
                </div>

                {result.song.psych_concept && (<p className="psych-tag-13">[ {result.song.psych_concept} ]</p>)}

                <div className="btns-13">
                  <a
                    className="btn-13 btn-13--black"
                    href={result.song.spotify_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ Open in Spotify
                  </a>
                  <a
                    className="btn-13 btn-13--outline"
                    href={result.song.youtube_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ Watch Lyric Video
                  </a>
                </div>

                <button className="reset-13" onClick={reset}>
                  ← Try Another Feeling
                </button>
              </div>)}

          </div>
        </div>
      </main>

      <style jsx>{`
        /* ── MAIN CONTAINER ── */
        .main-13 {
          height: 100vh;
          padding-top: 140px;
          padding-left: 80px;
          padding-right: 80px;
          display: flex;
          align-items: flex-start;
          background: #fff;
        }

        /* ── TWO-COLUMN GRID ── */
        .grid-13 {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 0 72px;
          width: 100%;
          align-items: flex-start;
        }

        /* ── LEFT COLUMN ── */
        .col-left-13 {
          padding-top: 20px;
          min-width: 0;
        }

        /* ── RIGHT COLUMN ── */
        .col-right-13 {
          min-width: 0;
        }

        .title-13 {
          font-family: var(--font-bebas), 'Helvetica Neue', sans-serif;
          font-size: 96px;
          line-height: 1;
          color: #000;
          letter-spacing: 0.01em;
        }

        .subtitle-13 {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 18px;
          font-style: italic;
          color: #888;
          margin-top: 10px;
          line-height: 1.4;
        }

        .desc-13 {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          color: #888;
          margin-top: 10px;
          line-height: 1.6;
        }

        /* ── SHARED LABEL ── */
        .label-13 {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 12px;
        }

        /* ── INPUT STATE ── */
        .textarea-13 {
          display: block;
          width: 100%;
          height: 120px;
          padding: 16px;
          font-size: 16px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #000;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 0;
          outline: none;
          resize: none;
          line-height: 1.6;
          transition: border-color 150ms ease;
        }
        .textarea-13:focus {
          border-color: #000;
        }
        .textarea-13::placeholder {
          color: #bbb;
          font-style: italic;
        }

        .error-13 {
          margin-top: 8px;
          font-size: 12px;
          color: #c8102e;
          font-style: italic;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .btn-find-13 {
          display: block;
          width: 100%;
          height: 48px;
          margin-top: 12px;
          background: #000;
          color: #fff;
          border: 1px solid #000;
          border-radius: 0;
          font-size: 13px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 150ms ease, border-color 150ms ease;
        }
        .btn-find-13:hover {
          background: #222;
          border-color: #222;
        }

        /* ── LOADING STATE ── */
        .loading-13 {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .loading-bar-13 {
          width: 100%;
          height: 1px;
          background: #e8e8e8;
          position: relative;
          overflow: hidden;
        }
        .loading-bar-13::after {
          content: '';
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          background: #000;
          animation: sweep 0.9s ease-in-out infinite;
        }
        @keyframes sweep {
          0%   { left: -40%; }
          100% { left: 100%; }
        }

        .loading-text-13 {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
        }

        /* ── RESULT STATE ── */
        .result-13 {
          animation: fadeUp 0.3s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .song-title-13 {
          font-family: var(--font-bebas), 'Helvetica Neue', sans-serif;
          font-size: 72px;
          line-height: 1;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .song-album-13 {
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 28px;
        }

        .field-group-13 {
          margin-bottom: 18px;
        }

        .field-label-13 {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 5px;
        }

        .scene-text-13 {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          font-style: italic;
          color: #333;
          line-height: 1.75;
        }

        .truth-text-13 {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 20px;
          font-weight: 400;
          color: #000;
          line-height: 1.6;
        }

        .psych-tag-13 {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 6px;
          margin-bottom: 24px;
        }

        /* ── RESULT BUTTONS ── */
        .btns-13 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn-13 {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 0;
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
        }

        .btn-13--black {
          background: #000;
          color: #fff;
          border: 1px solid #000;
        }
        .btn-13--black:hover {
          background: #222;
          border-color: #222;
        }

        .btn-13--outline {
          background: #fff;
          color: #000;
          border: 1px solid #000;
        }
        .btn-13--outline:hover {
          background: #f5f5f5;
        }

        /* ── RESET LINK ── */
        .reset-13 {
          background: none;
          border: none;
          padding: 0;
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          font-weight: 400;
          transition: color 150ms ease;
        }
        .reset-13:hover {
          color: #000;
        }

        /* ── MOBILE · single column, allow scroll ── */
        @media (max-width: 1023px) {
          .main-13 {
            height: auto;
            padding: 80px 24px 60px;
            align-items: flex-start;
          }
          .grid-13 {
            grid-template-columns: 1fr;
            gap: 40px 0;
          }
          .title-13 {
            font-size: 72px;
          }
          .song-title-13 {
            font-size: 52px;
          }
          .btns-13 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>);
}
