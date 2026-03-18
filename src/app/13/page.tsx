'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { findMatchingSong, type Song } from '@/lib/mirrorball-match';
import songsData from '@/data/mirrorball-songs.json';

const songs = songsData as Song[];

type State = 'input' | 'loading' | 'result';

export default function ThirteenPage() {
  const [state, setState] = useState<State>('input');
  const [feeling, setFeeling] = useState('');
  const [result, setResult] = useState<{ song: Song; why: string } | null>(null);
  const [error, setError] = useState('');

  function findSong() {
    const trimmed = feeling.trim();
    if (!trimmed || trimmed.length < 3) {
      setError('Tell me a little more — even just a few words.');
      return;
    }

    setError('');
    setState('loading');

    // Brief delay so loading state is visible; matching runs entirely client-side
    setTimeout(() => {
      try {
        const match = findMatchingSong(trimmed, songs);
        setResult(match);
        setState('result');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
        setState('input');
      }
    }, 600);
  }

  function reset() {
    setFeeling('');
    setResult(null);
    setError('');
    setState('input');
  }

  return (
    <>
      {/* ── NAV (molecular dark) ── */}
      <nav id="site-nav" className="page-13-nav">
        <div className="nav-main">
          <div className="nav-left">
            <a href="/#work">Work</a>
            <a href="/#about">About</a>
            <a href="/blog">Blog</a>
            <a href="/13" className="active">13</a>
          </div>
          <a href="/" className="nav-wordmark">Benn Pattara</a>
          <div className="nav-right">
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="page-13-main">
        <div className="mirrorball-card">
          <div className="mirrorball-wordmark">
            13<span className="muted"> / Mirrorball</span>
          </div>

          {state === 'input' && (
            <div className="mirrorball-input-state">
              <p className="mirrorball-label">Tell me how you feel</p>
              <div className="mirrorball-input-wrap">
                <textarea
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), findSong())}
                  placeholder="Type a sentence, a feeling, a moment you can't shake…"
                  maxLength={500}
                  rows={5}
                  className="mirrorball-textarea"
                />
                <div className="mirrorball-char-hint">
                  Or try three words that describe you right now.
                </div>
              </div>
              <div className="mirrorball-submit-row">
                <button className="mirrorball-btn" onClick={findSong}>
                  Find My Song →
                </button>
                <span className="mirrorball-examples">
                  e.g. &quot;I keep replaying a conversation I should&apos;ve walked away from&quot;
                </span>
              </div>
              {error && <p className="mirrorball-error">{error}</p>}
            </div>
          )}

          {state === 'loading' && (
            <div className="mirrorball-loading-state">
              <div className="mirrorball-loading-orb" />
              <p className="mirrorball-loading-text">Finding your song…</p>
            </div>
          )}

          {state === 'result' && result && (
            <div className="mirrorball-result-state">
              <p className="mirrorball-label">You said:</p>
              <p className="mirrorball-user-echo">&ldquo;{feeling.trim()}&rdquo;</p>

              <p className="mirrorball-label">Your song is:</p>
              <h1 className="mirrorball-song-title">{result.song.title.toUpperCase()}</h1>
              <p className="mirrorball-song-album">{result.song.album}</p>

              <div className="mirrorball-divider" />

              <p className="mirrorball-label">The Scene</p>
              <p className="mirrorball-scene-text">{result.song.scene}</p>

              <p className="mirrorball-label">The Truth</p>
              <p className="mirrorball-truth-text">{result.song.human_truth}</p>
              {result.song.psych_concept && (
                <p className="mirrorball-psych-tag">[ {result.song.psych_concept} ]</p>
              )}

              <p className="mirrorball-why-text">{result.why}</p>

              <div className="mirrorball-links-row">
                <a
                  className="mirrorball-link-btn spotify"
                  href={result.song.spotify_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ Open in Spotify
                </a>
                <a
                  className="mirrorball-link-btn"
                  href={result.song.youtube_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Watch Lyric Video
                </a>
              </div>

              <div className="mirrorball-qr-section">
                <div className="mirrorball-qr-code">
                  <QRCodeSVG
                    value={result.song.youtube_url || 'https://youtube.com'}
                    size={72}
                    level="M"
                    bgColor="transparent"
                    fgColor="currentColor"
                  />
                </div>
                <div className="mirrorball-qr-label">
                  <p>Scan to listen</p>
                  <small>Lyric video on YouTube</small>
                </div>
              </div>

              <button className="mirrorball-reset-btn" onClick={reset}>
                ← Try another feeling
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="page-13-footer">
        <div className="footer-left">
          <span className="footer-name">Benn Pattara</span>
          <span className="footer-role">Brand Experience Strategist &amp; Systems Designer</span>
        </div>
        <div className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/#about" className="footer-link">About</Link>
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/#contact" className="footer-link">Contact</Link>
        </div>
        <span className="footer-copy">&copy; 2026 Benn Pattara &middot; bennpattara.com</span>
      </footer>

      <style jsx>{`
        .page-13-nav {
          background: var(--doc-bg) !important;
          border-bottom: 1px solid var(--doc-border) !important;
        }
        .page-13-nav .nav-left a,
        .page-13-nav .nav-wordmark,
        .page-13-nav .nav-right a {
          color: rgba(255,255,255,.6);
        }
        .page-13-nav .nav-left a.active,
        .page-13-nav .nav-left a:hover,
        .page-13-nav .nav-right a:hover {
          color: rgba(255,255,255,.9);
        }
        .page-13-nav .nav-right a {
          border-bottom-color: rgba(255,255,255,.25);
        }

        .page-13-main {
          min-height: 100vh;
          background: var(--doc-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 48px 80px;
        }

        .mirrorball-card {
          width: 100%;
          max-width: 600px;
          background: var(--doc-card);
          border: 1px solid var(--doc-border);
          padding: 48px 40px;
        }

        .mirrorball-wordmark {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 36px;
        }
        .mirrorball-wordmark .muted {
          color: var(--doc-muted);
          font-weight: 300;
          margin-left: 8px;
        }

        .mirrorball-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--doc-muted);
          margin-bottom: 12px;
        }

        .mirrorball-input-wrap {
          border: 1px solid var(--doc-border);
        }

        .mirrorball-textarea {
          width: 100%;
          min-height: 110px;
          padding: 24px;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.7;
          color: #fff;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          display: block;
          font-family: inherit;
        }
        .mirrorball-textarea::placeholder {
          color: var(--doc-muted);
          font-style: italic;
        }

        .mirrorball-char-hint {
          padding: 12px 24px;
          border-top: 1px solid var(--doc-border);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--doc-muted);
        }

        .mirrorball-submit-row {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .mirrorball-btn {
          background: var(--accent);
          color: #fff;
          border: 1px solid var(--accent);
          padding: 14px 28px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }
        .mirrorball-btn:hover {
          background: #e01a3b;
          border-color: #e01a3b;
        }

        .mirrorball-examples {
          font-size: 11px;
          color: var(--doc-muted);
          font-weight: 300;
          font-style: italic;
          line-height: 1.6;
        }

        .mirrorball-error {
          margin-top: 14px;
          font-size: 12px;
          color: var(--accent);
          font-style: italic;
        }

        .mirrorball-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }

        .mirrorball-loading-orb {
          width: 44px;
          height: 44px;
          border: 1px solid var(--doc-border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .mirrorball-loading-text {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--doc-muted);
        }

        .mirrorball-result-state {
          animation: fadeUp 0.35s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mirrorball-user-echo {
          font-size: 14px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.65;
          color: var(--doc-muted);
          border-left: 2px solid var(--doc-border);
          padding-left: 18px;
          margin-bottom: 40px;
        }

        .mirrorball-song-title {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.1;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 6px;
        }

        .mirrorball-song-album {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: var(--doc-muted);
          text-transform: uppercase;
          margin-bottom: 36px;
        }

        .mirrorball-divider {
          height: 1px;
          background: var(--doc-border);
          margin-bottom: 32px;
        }

        .mirrorball-scene-text {
          font-size: 14px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.75;
          color: rgba(255,255,255,.7);
          margin-bottom: 32px;
        }

        .mirrorball-truth-text {
          font-size: 17px;
          font-weight: 400;
          line-height: 1.65;
          color: #fff;
          margin-bottom: 6px;
        }

        .mirrorball-psych-tag {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--doc-muted);
          margin-bottom: 40px;
        }

        .mirrorball-why-text {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--doc-muted);
          border-top: 1px solid var(--doc-border);
          padding-top: 28px;
          margin-bottom: 40px;
        }

        .mirrorball-links-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        .mirrorball-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 16px;
          border: 1px solid var(--doc-border);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          color: #fff;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .mirrorball-link-btn:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.2);
        }
        .mirrorball-link-btn.spotify {
          background: #1DB954;
          border-color: #1DB954;
          color: #fff;
        }
        .mirrorball-link-btn.spotify:hover {
          background: #1ed760;
          border-color: #1ed760;
        }

        .mirrorball-qr-section {
          border-top: 1px solid var(--doc-border);
          padding-top: 28px;
          display: flex;
          align-items: center;
          gap: 28px;
          margin-bottom: 36px;
        }

        .mirrorball-qr-code {
          color: #fff;
        }

        .mirrorball-qr-label p {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--doc-muted);
          margin-bottom: 4px;
        }
        .mirrorball-qr-label small {
          font-size: 11px;
          font-weight: 300;
          color: var(--doc-muted);
          font-style: italic;
        }

        .mirrorball-reset-btn {
          background: transparent;
          border: none;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--doc-muted);
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: inherit;
        }
        .mirrorball-reset-btn:hover {
          color: #fff;
        }

        .page-13-footer {
          background: var(--doc-bg);
          border-top: 1px solid var(--doc-border);
        }
        .page-13-footer .footer-name { color: rgba(255,255,255,.6); }
        .page-13-footer .footer-role { color: rgba(255,255,255,.25); }
        .page-13-footer .footer-link { color: rgba(255,255,255,.35); }
        .page-13-footer .footer-link:hover { color: rgba(255,255,255,.7); }
        .page-13-footer .footer-copy { color: rgba(255,255,255,.18); }
      `}</style>
    </>
  );
}
