import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Wordmark = () => (
    <span className="font-display font-light lowercase tracking-tight text-[20px] leading-none flex items-center text-nomad-black">
        <span>n</span>
        <span className="text-nomad-pink">o</span>
        <span>mad</span>
    </span>
);

const H = ({ n, id, children }) => (
    <h2 id={id} className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mt-20 mb-6">
        {n} — {children}
    </h2>
);

const P = ({ children }) => (
    <p className="text-nomad-black/85 leading-[1.8] mb-5" style={{ fontSize: '17px' }}>{children}</p>
);

const UL = ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 mb-5 text-nomad-black/85 leading-[1.7]" style={{ fontSize: '17px' }}>
        {children}
    </ul>
);

const Cookies = () => (
    <div className="min-h-screen bg-nomad-cream text-nomad-black antialiased">
        <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
            <a href="/" aria-label="nomad — home" className="group inline-flex items-center h-12 px-5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/80 transition-colors">
                <Wordmark />
            </a>
            <a href="/" className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors">← back</a>
        </header>

        <main className="max-w-[720px] mx-auto px-6 pt-40 pb-32">
            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mb-12">cookie notice · last updated 2026.04</p>

            <h1 className="font-display font-light leading-[1.02] tracking-tight mb-12" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
                What we store on your device.
            </h1>

            <P>
                This notice explains the cookies and similar technologies we use on this website, why we use them, and how you can control them. It sits alongside our <a href="/privacy" className="text-nomad-pink hover:text-nomad-magenta">privacy notice</a>.
            </P>
            <P>
                We comply with the UK Privacy and Electronic Communications Regulations (PECR), the EU ePrivacy Directive (2002/58/EC, as amended), and the Swiss Federal Act on Data Protection (FADP). Where consent is required, we ask for it, and you can withdraw it at any time.
            </P>

            <H n="01" id="what">what cookies are</H>
            <P>
                A cookie is a small text file stored on your device by your browser. We also use related technologies — for example, <code className="font-tech text-[14px] text-nomad-pink">localStorage</code> and <code className="font-tech text-[14px] text-nomad-pink">sessionStorage</code> — that perform similar functions. Throughout this notice, "cookies" refers to all of them.
            </P>

            <H n="02" id="how">how we use them</H>
            <P>
                We aim to use as few cookies as possible. The site is mostly static and does not need to track you. Where cookies or similar storage are present, they fall into one of these categories:
            </P>

            <H n="03" id="strictly-necessary">strictly necessary</H>
            <P>These are required for the site to work. They do not require consent under UK / EU law.</P>
            <UL>
                <li><strong><code className="font-tech text-[14px] text-nomad-pink">nomad-intro-seen</code></strong> — a single key in your browser's session storage that records whether you've already seen the intro animation, so we don't replay it on every page load. Cleared when you close the tab.</li>
                <li><strong>Form submission anti-spam</strong> — when you submit a form, our hosting provider (Netlify) may set a short-lived cookie to prevent automated abuse. This is essential to the form working.</li>
            </UL>

            <H n="04" id="analytics">analytics and performance</H>
            <P>
                We do not currently run third-party analytics that set cookies (e.g. Google Analytics) or any tracking pixels. Our hosting provider records aggregate, IP-anonymised request logs for security and performance — these do not set cookies on your device. If we add cookie-based analytics in future, we will update this notice and ask for your consent before any non-essential cookies are set.
            </P>

            <H n="05" id="marketing">marketing and advertising</H>
            <P>We do not use cookies for advertising, retargeting, or cross-site tracking, and we do not share data with advertising networks.</P>

            <H n="06" id="control">how to control cookies</H>
            <P>
                You can control or delete cookies in your browser settings. Most browsers allow you to refuse cookies, accept them only from specified sites, or delete existing ones. Refusing strictly necessary cookies may break parts of the site (for example, form submissions).
            </P>
            <UL>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-nomad-pink hover:text-nomad-magenta" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-nomad-pink hover:text-nomad-magenta" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" className="text-nomad-pink hover:text-nomad-magenta" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-nomad-pink hover:text-nomad-magenta" target="_blank" rel="noopener noreferrer">Edge</a></li>
            </UL>
            <P>
                You can also use your browser's "Do Not Track" or Global Privacy Control signals; we honour them where they apply.
            </P>

            <H n="07" id="changes">changes to this notice</H>
            <P>
                We will update this page if we add cookies, change processors, or alter how cookies are used. Material changes are flagged at the top of the page. The "last updated" date reflects the most recent revision.
            </P>

            <H n="08" id="contact">questions</H>
            <P>
                Email <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>. For your rights, complaints, and supervisory authorities, see the <a href="/privacy" className="text-nomad-pink hover:text-nomad-magenta">privacy notice</a>.
            </P>

            <div className="mt-24 pt-10 border-t border-nomad-pink/30 font-tech text-[11px] text-nomad-black/50 tracking-[0.04em] lowercase leading-[1.7] space-y-2">
                <p>nomad neuroscience ltd · registered in england and wales · company № 16558472</p>
                <p>71-75 shelton street, covent garden, london, wc2h 9jq</p>
                <p className="pt-2"><a href="/privacy" className="hover:text-nomad-pink">privacy</a> · <a href="/cookies" className="hover:text-nomad-pink">cookies</a></p>
            </div>
        </main>
    </div>
);

createRoot(document.getElementById('root')).render(<Cookies />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
