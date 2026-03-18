'use client';

import Link from 'next/link';

export default function ThirteenPage() {
    return (
        <>
            {/* ── NAV ── */}
            <nav id="site-nav" style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: '#080808',
                borderBottom: '1px solid rgba(255,255,255,.06)',
            }}>
                <div className="nav-utility" style={{ color: 'rgba(255,255,255,.2)', borderBottomColor: 'rgba(255,255,255,.06)' }}>
                    <span>Brand Experience Strategist &amp; Systems Designer</span>
                    <span>VCU Brandcenter &middot; M.S. Business/Branding &middot; 2026</span>
                </div>
                <div className="nav-main">
                    <div className="nav-left">
                        <a href="/#work" style={{ color: 'rgba(255,255,255,.4)' }}>Work</a>
                        <a href="/#about" style={{ color: 'rgba(255,255,255,.4)' }}>About</a>
                        <a href="/blog" style={{ color: 'rgba(255,255,255,.4)' }}>Blog</a>
                        <a href="/13" style={{ color: 'rgba(255,255,255,.8)' }}>13</a>
                    </div>
                    <a href="/" className="nav-wordmark" style={{ color: 'rgba(255,255,255,.8)' }}>Benn Pattara</a>
                    <div className="nav-right">
                        <a href="/#contact" style={{ color: 'rgba(255,255,255,.4)', borderBottomColor: 'rgba(255,255,255,.2)' }}>Contact</a>
                    </div>
                </div>
            </nav>

            {/* ── MAIN ── */}
            <main style={{
                minHeight: '100vh',
                background: '#080808',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '120px 48px 80px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}>
                {/* Intentionally blank — as designed */}
                <div style={{ textAlign: 'center', opacity: 0.08 }}>
                    <div style={{
                        fontSize: '240px',
                        fontWeight: 300,
                        color: '#fff',
                        letterSpacing: '-.04em',
                        lineHeight: 1,
                        userSelect: 'none',
                    }}>
                        13
                    </div>
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#080808', borderTopColor: 'rgba(255,255,255,.04)' }}>
                <div className="footer-left">
                    <span className="footer-name" style={{ color: 'rgba(255,255,255,.5)' }}>Benn Pattara</span>
                    <span className="footer-role" style={{ color: 'rgba(255,255,255,.2)' }}>Brand Experience Strategist &amp; Systems Designer</span>
                </div>
                <div className="footer-links">
                    <Link href="/" className="footer-link" style={{ color: 'rgba(255,255,255,.3)' }}>Home</Link>
                    <Link href="/blog" className="footer-link" style={{ color: 'rgba(255,255,255,.3)' }}>Blog</Link>
                    <Link href="/#contact" className="footer-link" style={{ color: 'rgba(255,255,255,.3)' }}>Contact</Link>
                </div>
                <span className="footer-copy" style={{ color: 'rgba(255,255,255,.15)' }}>&copy; 2025 Benn Pattara &middot; bennpattara.com</span>
            </footer>
        </>
    );
}
