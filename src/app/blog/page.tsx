'use client';

import Link from 'next/link';

const ARTICLES = [
    {
        slug: '/blog/heritage-brands-gen-z',
        num: '01',
        category: 'Brand Strategy',
        title: 'Why Heritage Brands Are Losing Gen Z — And What to Do About It',
        date: 'Feb 2026',
        readTime: '8 min read',
        excerpt: 'The cultural contract between luxury brands and younger consumers has fundamentally shifted. Prestige without participation is no longer enough.',
        live: true,
    },
    {
        slug: null,
        num: '02',
        category: 'Systems Design',
        title: 'The Loyalty Loop: How Retention Systems Break Before They Begin',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'Most loyalty programs are built backwards — engineered for the brand\'s revenue model, not the consumer\'s lived experience.',
        live: false,
    },
    {
        slug: null,
        num: '03',
        category: 'Cultural Strategy',
        title: 'Transmedia Is Not Marketing: On Building Worlds That Hold',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'The difference between a campaign that spans platforms and a world that actually sustains attention across them.',
        live: false,
    },
    {
        slug: null,
        num: '04',
        category: 'Brand Experience',
        title: 'Physical Retail Isn\'t Dead. It\'s Just Been Asked the Wrong Question.',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'When foot traffic became the primary metric, we optimized for the wrong thing. The store was never about conversion.',
        live: false,
    },
    {
        slug: null,
        num: '05',
        category: 'AI & Personalization',
        title: 'Human-Led Machines: Why Recommendation Systems Need an Editor',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'The best curation isn\'t algorithmic. It\'s a trained sensibility that knows what to withhold.',
        live: false,
    },
    {
        slug: null,
        num: '06',
        category: 'Identity & Community',
        title: 'What Subcultures Can Teach Mass Brands About Belonging',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'Scale killed the magic of most brand communities. The ones that survived built barriers — not funnels.',
        live: false,
    },
    {
        slug: null,
        num: '07',
        category: 'Commerce & Conversion',
        title: 'Confidence as a Revenue Metric: Rethinking the Consideration Stage',
        date: 'Coming Soon',
        readTime: null,
        excerpt: 'The gap between wanting something and buying it isn\'t about price. It\'s about certainty. Brands that solve for certainty win.',
        live: false,
    },
];

export default function BlogIndex() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 80px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

            {/* ── HEADER ── */}
            <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '40px', marginBottom: '0' }}>
                <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '16px' }}>
                    Writing &amp; Ideas
                </div>
                <h1 style={{ fontSize: '40px', fontWeight: 300, letterSpacing: '-.01em', color: '#000', lineHeight: 1.1, margin: 0, maxWidth: '640px' }}>
                    On Culture, Commerce,<br />and the Space Between.
                </h1>
            </div>

            {/* ── ARTICLE LIST ── */}
            <div>
                {ARTICLES.map((article) => (
                    <div
                        key={article.num}
                        style={{
                            borderBottom: '1px solid #f0f0f0',
                            padding: '36px 0',
                            opacity: article.live ? 1 : 0.5,
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: '24px', alignItems: 'start' }}>
                            {/* Number */}
                            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', color: '#ccc', paddingTop: '4px' }}>
                                {article.num}
                            </div>

                            {/* Content */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#999' }}>
                                        {article.category}
                                    </span>
                                    <span style={{ fontSize: '9px', color: '#ccc', letterSpacing: '.06em' }}>{article.date}</span>
                                    {article.readTime && (
                                        <span style={{ fontSize: '9px', color: '#ccc', letterSpacing: '.06em' }}>{article.readTime}</span>
                                    )}
                                    {!article.live && (
                                        <span style={{
                                            fontSize: '8px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase',
                                            color: '#bbb', border: '1px solid #e4e4e4', padding: '2px 8px',
                                        }}>
                                            In Progress
                                        </span>
                                    )}
                                </div>

                                {article.live ? (
                                    <Link href={article.slug!} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            fontSize: '20px', fontWeight: 400, letterSpacing: '.01em', color: '#000',
                                            lineHeight: 1.25, marginBottom: '12px',
                                            transition: 'color 200ms ease',
                                        }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#555')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '#000')}
                                        >
                                            {article.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '.01em', color: '#000', lineHeight: 1.25, marginBottom: '12px' }}>
                                        {article.title}
                                    </div>
                                )}

                                <div style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, maxWidth: '580px' }}>
                                    {article.excerpt}
                                </div>

                                {article.live && (
                                    <Link
                                        href={article.slug!}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '11px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000', textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: '2px' }}
                                    >
                                        Read Article &rarr;
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
