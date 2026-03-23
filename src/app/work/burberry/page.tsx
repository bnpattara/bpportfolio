"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface TheaterItem {
    id: number;
    title: string;
    desc: string;
    img: string;
}

const THEATER_DATA: TheaterItem[] = [
    { 
        id: 1, 
        title: "The Forest of Arden Map", 
        desc: "A bespoke Fortnite POI — a 'Green World' space for transformation and identity freedom, grounded in Shakespearean narrative and RSC's Unreal Engine technology.",
        img: "/img/case-studies/burberry/theater_physical.png" 
    },
    { 
        id: 2, 
        title: "The 'Seven Ages of Man' Battle Pass", 
        desc: "A 100-tier progression system where the Burberry Trench evolves from a Scholar's layer into a reactive, fully realized 'Sovereign' garment. Heritage becomes achievement.",
        img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" // Digital placeholder
    },
    { 
        id: 3, 
        title: "Live MoCap Performance", 
        desc: "A first-of-its-kind live digital theatrical performance within Fortnite — RSC actors perform in real time, player choices influence the outcome.",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" // Social/Digital placeholder
    },
    { 
        id: 4, 
        title: "Proscenium Portals (Retail)", 
        desc: "Global flagship AR mirrors allowing customers to see their physical self merge with their high-level digital avatar — closing the loop between digital identity and physical purchase.",
        img: "/img/case-studies/burberry/theater_physical.png"
    }
];

export default function BurberryCaseStudy() {
    const navRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const [activeTheater, setActiveTheater] = useState(0);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
            { threshold: 0.05 }
        );
        obs.observe(hero);
        return () => obs.disconnect();
    }, []);

    // Scroll progress for Theater section
    useEffect(() => {
        const handleScroll = () => {
            const theaterSection = document.getElementById('theater-section');
            if (!theaterSection) return;
            
            const rect = theaterSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollPos = -rect.top;
            
            if (scrollPos > 0 && scrollPos < sectionHeight) {
                const index = Math.floor((scrollPos / sectionHeight) * THEATER_DATA.length);
                if (index >= 0 && index < THEATER_DATA.length) {
                    setActiveTheater(index);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Carousel handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        setIsDown(true);
        setStartX(e.pageX - carousel.offsetLeft);
        setScrollLeft(carousel.scrollLeft);
    };

    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const carousel = carouselRef.current;
        if (!carousel) return;
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    };

    return (
        <div style={{ background: '#000' }}>
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
                <div ref={heroRef} className="cs-page-hero" style={{ position: 'relative', height: '85vh', background: '#1a1c1a', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                    <img src="/img/case-studies/burberry/hero.png" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Burberry Hero" />
                    <div style={{ position: 'absolute', bottom: '-40px', right: '-30px', fontSize: '240px', fontWeight: 300, color: 'rgba(255,255,255,.05)', letterSpacing: '-.03em', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', textTransform: 'uppercase' }}>Burberry</div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.85) 100%)' }}></div>
                    <div className="cs-hero-inner" style={{ position: 'relative', zIndex: 2, padding: '56px 48px', width: '100%' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <div style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,.3)', marginBottom: '24px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.9)', padding: '6px 16px' }}>Stage 01 &mdash; Discovery & Cultural Relevance</span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 300, letterSpacing: '.02em', textTransform: 'uppercase', color: '#fff', lineHeight: '0.9', marginBottom: '32px' }}>The Forest of Arden<br /><span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Transmedia Takeover</span></h1>
                            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.6)', lineHeight: 1.6, maxWidth: '520px' }}>Gen Z uses the internet like a dressing room, seeking costumes that signal their identity. We built the infrastructure for their performance.</p>
                        </div>
                    </div>
                </div>

                {/* SECTION: BACKGROUND */}
                <div style={{ padding: '120px 48px', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '80px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: '12px' }}>01 / Problem</div>
                            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#000' }}>Heritage as a Liability</h2>
                        </div>
                        <div>
                            <p style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '.02em', textTransform: 'uppercase', color: '#000', lineHeight: 1.2, marginBottom: '32px' }}>For a generation that values <em>digital participation</em> over passive consumption, a brand that exists primarily as a "history lesson" has no natural entry point.</p>
                            <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.7, marginBottom: '24px' }}>Burberry's 160-year history is simultaneously its greatest asset and its most significant liability.</p>
                        </div>
                    </div>
                </div>

                {/* SECTION: INSIGHT */}
                <div style={{ padding: '120px 48px', background: '#fcfcfc', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '80px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: '12px' }}>02 / Insight</div>
                            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#000' }}>Identity Infrastructure</h2>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 300, letterSpacing: '.01em', color: '#000', lineHeight: 1.3, marginBottom: '40px', borderLeft: '3px solid #000', paddingLeft: '40px', fontStyle: 'italic' }}>"Gen Z spends nearly 25% of their free time in Fortnite. The opportunity isn't just reach — it's identity infrastructure."</div>
                            <div className="cs-body-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8 }}>The internet is the new dressing room. Users seek costumes that signal intellectual and creative identity to a global audience.</p>
                                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8 }}>Our goal was to be the brand that taught a generation to perform their best selves through the heritage of the Burberry Trench.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THEATER STICKY SCROLL SECTION */}
                <div id="theater-section" style={{ position: 'relative', background: '#000', color: '#fff' }}>
                    <div style={{ padding: '80px 48px 0', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '80px' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>02 / Solution</div>
                            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff' }}>Theater of the Coat</h2>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', minHeight: '400vh' }}>
                        {/* Text Col */}
                        <div style={{ padding: '0 64px' }}>
                            {THEATER_DATA.map((item, i) => (
                                <div key={item.id} style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: activeTheater === i ? 1 : 0.2, transition: 'opacity 0.4s ease' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Theater 0{item.id}</span>
                                    <h3 style={{ fontSize: '42px', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: '32px', lineHeight: 1.1 }}>{item.title}</h3>
                                    <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '440px' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        {/* Visual Col */}
                        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                            {THEATER_DATA.map((item, i) => (
                                <div key={item.id} style={{ position: 'absolute', inset: 0, opacity: activeTheater === i ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
                                    <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }}></div>
                                    <div style={{ position: 'absolute', bottom: '40px', right: '40px', fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>Burberry &times; RSC &times; Fortnite</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION: OUTCOME */}
                <div style={{ padding: '120px 48px', background: '#fff' }}>
                    <div className="cs-page-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '80px', alignItems: 'start' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ccc', marginBottom: '12px' }}>03 / Results</div>
                            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#000' }}>Business Impact</h2>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '.03em', textTransform: 'uppercase', color: '#000', lineHeight: 1.1, marginBottom: '48px' }}>Transmedia Success</h2>
                            
                            {/* Draggable Carousel */}
                            <div 
                                ref={carouselRef}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                style={{ 
                                    display: 'flex', 
                                    gap: '24px', 
                                    overflowX: 'hidden', 
                                    cursor: isDown ? 'grabbing' : 'grab',
                                    paddingBottom: '40px',
                                    margin: '0 -48px',
                                    padding: '0 48px'
                                }}
                            >
                                <div style={{ flex: '0 0 320px', padding: '40px 32px', background: '#f9f9f9', borderTop: '4px solid #000' }}>
                                    <div style={{ fontSize: '56px', fontWeight: 300, color: '#000', marginBottom: '12px', lineHeight: 1 }}>70h+</div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Engagement</div>
                                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>Brand engagement per player, replacing 5-second passive media with immersive participation.</p>
                                </div>
                                <div style={{ flex: '0 0 320px', padding: '40px 32px', background: '#f9f9f9', borderTop: '4px solid #000' }}>
                                    <div style={{ fontSize: '56px', fontWeight: 300, color: '#000', marginBottom: '12px', lineHeight: 1 }}>50%</div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Gen Z Reach</div>
                                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>Capture of the next generation of luxury consumers in their primary social environment.</p>
                                </div>
                                <div style={{ flex: '0 0 320px', padding: '40px 32px', background: '#f9f9f9', borderTop: '4px solid #000' }}>
                                    <div style={{ fontSize: '56px', fontWeight: 300, color: '#000', marginBottom: '12px', lineHeight: 1 }}>Phygital</div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Conversion</div>
                                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>Bridge the retail foot-traffic gap by turning flagship stores into identity portals.</p>
                                </div>
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
        </div>
    );
}

