import React from 'react';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (<>
            {/* ── NAV ── */}
            <nav id="site-nav" className="scrolled" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, borderBottom: '1px solid var(--g200)' }}>
                <div className="nav-main">
                    <div className="nav-left">
                        <a href="/#work">Work</a>
                        <a href="/about">About</a>
                        <a href="/blog" style={{ color: 'var(--black)' }}>Blog</a>
                        <a href="/13">13</a>
                    </div>
                    <a href="/" className="nav-wordmark">Benn Pattara</a>
                    <div className="nav-right">
                        <a href="/#contact">Contact</a>
                    </div>
                </div>
            </nav>

            {/* ── CONTENT ── */}
            <main style={{ minHeight: '60vh', paddingTop: '120px' }}>
                {children}
            </main>

            {/* ── FOOTER ── */}
            <footer>
                <div className="footer-left">
                    <span className="footer-name">Benn Pattara</span>
                    <span className="footer-role">Product Design &amp; Brand Strategy</span>
                    <span className="footer-qualifier">from cultural insight to shipped product specs</span>
                </div>
                <div className="footer-links">
                    <a href="/about" className="footer-link">About</a>
                    <a href="/blog" className="footer-link">Blog</a>
                    <a href="/13" className="footer-link">13</a>
                    <a href="/#contact" className="footer-link">Contact</a>
                </div>
                <span className="footer-copy">&copy; 2026 Benn Pattara &middot; bennpattara.com</span>
            </footer>
        </>);
}
