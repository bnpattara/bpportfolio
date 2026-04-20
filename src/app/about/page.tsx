import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About · Benn Pattara',
  description:
    'Product Design & Brand Strategy in Richmond, VA. M.S. VCU Brandcenter 2026. From cultural insight to shipped product: Gap loyalty, case studies, and the work in between.',
  openGraph: {
    title: 'About · Benn Pattara',
    description:
      'Product Design & Brand Strategy in Richmond, VA. M.S. VCU Brandcenter 2026. From cultural insight to shipped product.',
    url: 'https://bennpattara.com/about',
  },
};

const WATCHING = ['Scandal', 'Madam Secretary', '2 Broke Girls', 'Nobody Wants This'];
const LISTENING = ['Taylor Swift', 'Young Now, Miley Cyrus', 'Hopeless Fountain Kingdom, Halsey'];
const READING = ['The Empyrean Series', 'Red Queen Series', 'Heartless'];

export default function AboutPage() {
  return (
    <div className="about-page__grid">
      <div className="about-page__main">
        <div className="about-page__name-block">
          <h1 className="about-page__name-display">
            Benn <em>Pattara</em>
          </h1>
          <p className="about-page__title-line">Product Design &amp; Brand Strategy · Richmond, VA</p>
        </div>

        <div className="about-page__bio">
          <p className="about-page__bio-p">
            I grew up believing the best things, the ones that actually stick, make you{' '}
            <strong>feel something before they make you think anything.</strong> That instinct is what pulled me toward
            fashion, product design and brand strategy, and it&apos;s the lens I bring to everything I build.
          </p>
          <p className="about-page__bio-p">
            I&apos;m finishing my M.S. at VCU Brandcenter, originally from Chicago, currently in Richmond, pointed
            toward wherever the work is most interesting. I care about the moment where a brand stops being a logo and
            starts being something someone reaches for, and I care just as much about why that happens from a{' '}
            <strong>business standpoint.</strong> Both things have to be true at once for me.
          </p>
          <p className="about-page__bio-p">
            That tension is where I live. At Gap, I built a coaching framework that moved personal loyalty conversion
            from 1.22% to 12.07%, not by pushing harder, but by redesigning the human interaction around it. My cases go
            further: brand systems, product strategy, flagship concepts, app architecture. The through line is always
            the same: <strong>start with the person, build back to the business.</strong>
          </p>
          <p className="about-page__bio-p">
            Outside the work, I&apos;m reading something that has nothing to do with strategy, writing a book that has
            everything to do with it, and probably rewatching a political drama I&apos;ve already seen twice. Chicago
            made me. Richmond has been good to me. I&apos;m ready for my next chapter.
          </p>
        </div>

        <div className="about-page__stats">
          <div className="about-page__stat">
            <span className="about-page__stat-num">10×</span>
            <span className="about-page__stat-label">
              Loyalty conversion
              <br />
              Gap Inc.
            </span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-num">6</span>
            <span className="about-page__stat-label">
              Case studies
              <br />
              shipped
            </span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-num">M.S.</span>
            <span className="about-page__stat-label">
              Brandcenter
              <br />
              May 2026
            </span>
          </div>
        </div>
      </div>

      <aside className="about-page__sidebar about-page__sidebar--text-only">
        <div className="about-page__sidebar-sticky">
          <div className="about-page__portrait about-page__portrait--sidebar">
            <Image
              src="/benn-headshot.png"
              alt="Portrait of Benn Pattara"
              fill
              className="about-page__portrait-img about-page__portrait-fill"
              sizes="(max-width: 900px) min(320px, 100vw), 320px"
              priority
            />
          </div>

          <div className="about-page__sidebar-section about-page__sidebar-section--compact">
            <div className="about-page__currently-category">Watching</div>
            <ul className="about-page__currently-list about-page__currently-list--compact">
              {WATCHING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-page__sidebar-section about-page__sidebar-section--compact">
            <div className="about-page__currently-category">Listening</div>
            <ul className="about-page__currently-list about-page__currently-list--compact">
              {LISTENING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-page__sidebar-section about-page__sidebar-section--compact">
            <div className="about-page__currently-category">Reading</div>
            <ul className="about-page__currently-list about-page__currently-list--compact">
              {READING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-page__cta-block about-hero-ctas">
            <a className="about-cta-btn about-cta-btn--secondary" href="mailto:bennpattara@gmail.com">
              Email
            </a>
            <Link className="about-cta-btn about-cta-btn--secondary" href="/">
              Work
            </Link>
            <a
              className="about-cta-btn about-cta-btn--primary"
              href="https://linkedin.com/in/bennpattara"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
