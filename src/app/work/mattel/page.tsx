"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function MattelCaseStudy() {
    const navRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // States for accordions
    const [activeMethod, setActiveMethod] = useState<number | null>(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                const gone = !e.isIntersecting;
                if (navRef.current) {
                    navRef.current.classList.toggle("scrolled", gone);
                }
            },
            { threshold: 0.05 });
        obs.observe(hero);
        return () => obs.disconnect();
    }, []);

    const toggleMethod = (id: number) => {
        setActiveMethod(activeMethod === id ? null : id);
    };

    return (<>
            {/* ── GLOBAL NAV ── */}
            <nav id="site-nav" ref={navRef}>
                <div className="nav-main">
                    <div className="nav-left">
                        <Link href="/#work">Work</Link>
                        <Link href="/#about">About</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/13">13</Link>
                    </div>
                    <Link href="/" className="nav-wordmark">Benn Pattara</Link>
                    <div className="nav-right">
                        <Link href="/#contact" className="contact-trigger">Contact</Link>
                    </div>
                </div>
            </nav>


            <div style={{ background: '#fff', border: '1px solid #e8e8e8', fontFamily: "'Helvetica Neue', Arial, sans-serif", position: 'relative' }}>

                {/* HERO */}
                <div ref={heroRef} className="cs-page-hero" style={{ position: 'relative', height: '592px', background: 'linear-gradient(160deg, #1a0a0a 0%, #2d1515 30%, #1a0a0a 70%, #0d0505 100%)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ position: 'absolute', bottom: '-40px', right: '-30px', fontSize: '240px', fontWeight: 300, color: 'rgba(255,255,255,.07)', letterSpacing: '-.03em', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', textTransform: 'uppercase' }}>Mattel</div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.6) 100%)' }}></div>
                    <div className="cs-hero-inner" style={{ position: 'relative', zIndex: 2, padding: '56px 48px', width: '100%' }}>
                        <div style={{ maxWidth: '680px' }}>
                            <div style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,.4)', marginBottom: '20px' }}>
                                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.85)', padding: '5px 12px' }}>Stage 05, Loyalty & LTV Maximization</span>
                            </div>
                            <div style={{ fontSize: '52px', fontWeight: 300, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff', lineHeight: '.95', marginBottom: '20px' }}>Mattel Dreamers<br />The LTV Engine</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.7)', lineHeight: 1.7, maxWidth: '480px' }}>Building the Post-Box Loyalty Ecosystem. Mattel makes the world's most recognizable toys, but for decades, the brand's relationship with the consumer ended at the checkout counter.</div>
                        </div>
                    </div>
                </div>

                {/* SECTION: BACKGROUND */}
                <div style={{ padding: '80px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>01</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>The Business Problem</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '24px' }}>The "One-and-Done" Dilemma</div>
                            <div style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '20px' }}>Mattel owns the box. But the box is a graveyard for engagement. Once a toy is opened, the brand vanishes until the next holiday cycle. This total loss of first-party data and direct engagement means Mattel is constantly "re-acquiring" its own fans.</div>
                            <div style={{ fontSize: '15px', color: '#555', lineHeight: 1.8 }}>The problem isn't the product. It's the "participation gap" between the toy chest and the retail store.</div>
                        </div>
                    </div>
                </div>

                {/* SECTION: INSIGHT */}
                <div className="cs-page-section" style={{ padding: '80px 48px', background: '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>02</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>The Strategic Insight</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '.02em', color: '#000', lineHeight: 1.35, marginBottom: '28px', borderLeft: '2px solid #000', paddingLeft: '28px', fontStyle: 'italic' }}>"Engagement stops when the narrative stops. To move from product-led to platform-led, Mattel must own the 'Creative Labor' of play."</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>Play isn't just consumption; it's a creative performance. The brand that facilitates that performance owns the long-term relationship.</div>
                                <div style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>Stop selling the toy. Start selling the universe that requires the toy to function.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: STRATEGY */}
                <div style={{ padding: '80px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>03</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>Research Metrics</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '36px' }}>The Play-Pattern Matrix</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e8e8', marginBottom: '32px' }}>
                                <div style={{ background: '#fff', padding: '28px 24px' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>01, Gap</div>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '10px' }}>4hrs</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>average weekly "narrative play" vs. 0 mins of brand engagement</div>
                                </div>
                                <div style={{ background: '#fff', padding: '28px 24px' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>02, Demand</div>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '10px' }}>82%</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>of parents seeking "guided play" resources that aren't screen-heavy</div>
                                </div>
                                <div style={{ background: '#fff', padding: '28px 24px' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>03 (Scale</div>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '10px' }}>7B</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>Mattel products currently in circulation) an untapped "installed base"</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: EXECUTION */}
                <div className="cs-page-section" style={{ padding: '80px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>04</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>Execution</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '28px' }}>The Solution, Mattel Dreamers</div>
                            <div style={{ borderTop: '1px solid #e8e8e8', marginBottom: '28px' }}>

                                <div onClick={() => toggleMethod(1)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>Dreamers OS</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 1 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 1 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        A cross-portfolio loyalty app that rewards narrative participation. Uploading a 2-minute "play-story" using Mattel toys earns "Inspiration Credits."
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(2)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>Dreamer Drops</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 2 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 2 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        Limited-edition, "inspiration-only" accessories that cannot be bought with money: only through consistent narrative engagement.
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(3)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>The Narrative Forge (AI)</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 3 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 3 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        An AI storytelling engine that helps children (and parents) build complex story arcs across different Mattel brands (e.g., Barbie meets Hot Wheels).
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(4)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>Community Galleries</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 4 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 4 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        A moderated, safe space for the most creative play-stories to be displayed globally: positioning the child as the author and Mattel as the publisher.
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: OUTCOME */}
                <div className="cs-page-section" style={{ padding: '80px 48px' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>05</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>Business Impact</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '36px' }}>The LTV Flywheel</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e8e8', marginBottom: '36px' }}>
                                <div style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000' }}><div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '8px' }}>+35%</div><div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Estimated increase in LTV via reduction in "Acquisition Gap" cycles</div></div>
                                <div style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000' }}><div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '8px' }}>1st Party</div><div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Captures critical behavioral play data previously lost to third-party retailers</div></div>
                                <div style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000' }}><div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1, marginBottom: '8px' }}>Reach</div><div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Repositioned as a "social learning brand" rather than an "inventory brand"</div></div>
                            </div>
                            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '32px' }}>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEXT CASE STUDY STRIP */}
                <Link href="/work/diesel" className="cs-next-strip">
                    <div className="cs-next-strip-bg" style={{ background: 'linear-gradient(160deg,#140c06 0%,#1c1008 30%,#140c06 60%,#0c0804 100%)' }} />
                    <div className="cs-next-strip-scrim" />
                    <div className="cs-next-strip-content">
                        <div>
                            <div className="cs-next-strip-label">Next Case Study &middot; 06 / 07</div>
                            <div className="cs-next-strip-title">Diesel Iceberg: Cultural Destination</div>
                        </div>
                        <div className="cs-next-strip-arrow">&rarr;</div>
                    </div>
                </Link>

            </div>

            {/* ── GLOBAL FOOTER ── */}
            <footer>
                <div className="footer-left">
                    <span className="footer-name">Benn Pattara</span>
                    <span className="footer-role">Brand &amp; Product Strategist</span>
                    <span className="footer-qualifier">from cultural insight to shipped product specs</span>
                </div>
                <div className="footer-links">
                    <Link href="/#about" className="footer-link">About</Link>
                    <Link href="/blog" className="footer-link">Blog</Link>
                    <Link href="/13" className="footer-link">13</Link>
                    <Link href="/#contact" className="footer-link">Contact</Link>
                </div>
                <span className="footer-copy">&copy; 2025 Benn Pattara &middot; bennpattara.com</span>
            </footer>
        </>);
}
