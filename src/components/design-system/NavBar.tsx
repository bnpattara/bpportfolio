"use client";

export default function NavBar() {
    return (<nav className="ck-nav-sim">
            {/* Utility bar – optional */}
            <div className="ck-nav-top">
                <span>Free Shipping on Orders $50+ | US • EN</span>
            </div>
            {/* Main navigation */}
            <div className="ck-nav-main">
                <div className="ck-wordmark">Benn Pattara</div>
                <ul className="ck-nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#work">Work</a></li>
                    <li><a href="#blog">Blog</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div className="ck-nav-actions">
                    <a href="mailto:benn@example.com">Email</a>
                </div>
            </div>
        </nav>);
}
