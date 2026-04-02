"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function BurberryCaseStudy() {
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
                <div ref={heroRef} className="cs-page-hero" style={{ position: 'relative', height: '592px', background: 'linear-gradient(160deg, #1a1c1a 0%, #2d312d 30%, #1a1c1a 70%, #0d0e0d 100%)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ position: 'absolute', bottom: '-40px', right: '-30px', fontSize: '240px', fontWeight: 300, color: 'rgba(255,255,255,.035)', letterSpacing: '-.03em', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', textTransform: 'uppercase' }}>Burberry</div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.7) 100%)' }}></div>
                    <div className="cs-hero-inner" style={{ position: 'relative', zIndex: 2, padding: '56px 48px', width: '100%' }}>
                        <div style={{ maxWidth: '680px' }}>
                            <div style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,.25)', marginBottom: '20px' }}>
                                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', padding: '5px 12px' }}>Stage 01, Discovery & Cultural Relevance</span>
                            </div>
                            <div style={{ fontSize: '52px', fontWeight: 300, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff', lineHeight: '.95', marginBottom: '20px' }}>Burberry &times; Fortnite<br />The Forest of Arden</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: '480px' }}>The Forest of Arden, A Transmedia Brand Takeover. Gen Z uses the internet like a dressing room, seeking costumes that signal their identity.</div>
                        </div>
                    </div>
                </div>

                {/* SECTION: BACKGROUND */}
                <div style={{ padding: '80px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ gap: '60px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>01</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>The Business Problem</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '24px' }}>Heritage as a Liability</div>
                            <div style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '20px' }}>Burberry's 160-year history is simultaneously its greatest asset and its most significant liability. For a generation that values digital participation over passive consumption, a brand that exists primarily as a "history lesson" has no natural entry point.</div>
                            <div style={{ fontSize: '15px', color: '#555', lineHeight: 1.8 }}>The Trench Coat (the most iconic piece in British fashion) was sitting in an archive when it should have been in the arena.</div>
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
                            <div style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '.02em', color: '#000', lineHeight: 1.35, marginBottom: '28px', borderLeft: '2px solid #000', paddingLeft: '28px', fontStyle: 'italic' }}>"Gen Z spends nearly 25% of their free time in Fortnite. The opportunity isn't just reach: it's identity infrastructure."</div>
                            <div className="cs-body-2col" style={{ gap: '32px' }}>
                                <div style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>Gen Z uses the internet like a dressing room, seeking costumes that signal their intellectual and creative identity.</div>
                                <div style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>The goal is to be the brand that taught a generation to perform themselves through clothing.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: STRATEGY */}
                <div style={{ padding: '80px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>03</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>Research Metrics</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '36px' }}>Validating the Virtual</div>
                            <div className="cs-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e8e8', marginBottom: '32px' }}>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>25%</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>01 (Attention</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>of Gen Z free time spent in Fortnite) more than Netflix or Instagram</div>
                                </div>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>650M+</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>02, Reach</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>registered Fortnite players (2025/26 estimate)</div>
                                </div>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '44px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>70hrs+</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>03, Engagement</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.65 }}>seasonal brand engagement per player vs. 5-second passive ads</div>
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
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '28px' }}>The Solution, "The Theater of the Coat"</div>
                            <div style={{ borderTop: '1px solid #e8e8e8', marginBottom: '28px' }}>

                                <div onClick={() => toggleMethod(1)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>The Forest of Arden Map</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 1 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 1 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        A bespoke Fortnite POI: a "Green World" space for transformation and identity freedom, grounded in Shakespearean narrative and RSC's Unreal Engine technology.
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(2)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>The "Seven Ages of Man" Battle Pass</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 2 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 2 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        A 100-tier progression system where the Burberry Trench evolves from a Scholar's layer into a reactive, fully realized "Sovereign" garment. Heritage becomes achievement.
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(3)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>Live MoCap Performance</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 3 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 3 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        A first-of-its-kind live digital theatrical performance within Fortnite, RSC actors perform in real time, player choices influence the outcome.
                                    </div>
                                </div>

                                <div onClick={() => toggleMethod(4)} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#000' }}>Proscenium Portals (Retail)</span>
                                    <span style={{ fontSize: '14px', color: '#999', transform: activeMethod === 4 ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>+</span>
                                </div>
                                <div style={{ maxHeight: activeMethod === 4 ? '500px' : '0', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                                    <div style={{ padding: '16px 0 20px', fontSize: '13px', color: '#666', lineHeight: 1.75, borderBottom: '1px solid #f5f5f5' }}>
                                        Global flagship AR mirrors allowing customers to see their physical self merge with their high-level digital avatar: closing the loop between digital identity and physical purchase.
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: OUTCOME */}
                <div className="cs-page-section" style={{ padding: '80px 48px' }}>
                    <div className="cs-page-grid" style={{ alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc', marginBottom: '6px' }}>05</div>
                            <div style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>Business Impact</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '36px' }}>Transmedia Success</div>
                            <div className="cs-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e8e8', marginBottom: '36px' }}>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>70hrs+</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>Engagement</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Brand engagement per player: replaces 5-second passive media</div>
                                </div>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>50%</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>Reach</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Captures the next generation of luxury consumers in their social environment</div>
                                </div>
                                <div className="cs-stat-cell" style={{ background: '#fff', padding: '28px 24px', borderTop: '3px solid #000', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '48px', fontWeight: 300, color: '#000', letterSpacing: '-.02em', lineHeight: 1 }}>Phygital</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>Conversion</div>
                                    <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>Solves retail foot-traffic gap by turning stores into identity portals</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '32px' }}>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEXT CASE STUDY STRIP */}
                <Link href="/work/saks" className="cs-next-strip">
                    <div className="cs-next-strip-bg" style={{ background: 'linear-gradient(160deg,#080c18 0%,#0c1220 30%,#080c18 60%,#050810 100%)' }} />
                    <div className="cs-next-strip-scrim" />
                    <div className="cs-next-strip-content">
                        <div>
                            <div className="cs-next-strip-label">Next Case Study &middot; 03 / 07</div>
                            <div className="cs-next-strip-title">Saks Orbit: Platform-as-a-Service Restructuring</div>
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
