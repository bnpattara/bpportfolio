import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '13 · Full book | Benn Pattara',
  description:
    'Full manuscript of 13, my editorial book on Taylor Swift’s discography: albums, songs, and chronological chapters.',
};

export default function ThirteenFullBookPage() {
  return (
    <div className="page-13-book-page">
      <nav id="site-nav" className="scrolled">
        <div className="nav-main">
          <div className="nav-left">
            <a href="/#work">Work</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/13">13</a>
          </div>
          <a href="/" className="nav-wordmark">
            Benn Pattara
          </a>
          <div className="nav-right">
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="page-13-book-bar">
        <div className="page-13-book-bar__row">
          <Link href="/13" className="link-underline">
            ← Chapter &amp; track draw
          </Link>
          <a
            href="/book/13-full/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Open in new tab
          </a>
        </div>
        <p className="page-13-book-bar__lede">
          My editorial book on Taylor Swift’s albums and songs, written as a lyric study of her
          catalog (not an official release).
        </p>
      </div>

      <iframe
        className="page-13-book-iframe"
        src="/book/13-full/index.html"
        title="13: The Human Truths Inside Taylor Swift’s Music (full book)"
      />
    </div>
  );
}
