import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import './index.css';

const FadeIn = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            className={`transition-all duration-[1200ms] ease-out transform ${isVisible ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-[8px]'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const LoadingScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        document.documentElement.classList.add('loading');
        const revealTimer = setTimeout(() => setPhase(1), 450);
        const splitTimer = setTimeout(() => setPhase(2), 1100);
        const completeTimer = setTimeout(() => {
            document.documentElement.classList.remove('loading');
            try { sessionStorage.setItem('nomad-intro-seen', '1'); } catch (e) {}
            onComplete();
        }, 1700);
        return () => {
            clearTimeout(revealTimer);
            clearTimeout(splitTimer);
            clearTimeout(completeTimer);
            document.documentElement.classList.remove('loading');
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[150] pointer-events-none flex flex-col" role="status" aria-busy="true" aria-label="Loading Nomad">
            <div aria-hidden="true" className={`absolute top-0 left-0 w-full h-[50vh] bg-nomad-pink transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] border-b border-white/5 ${phase === 2 ? '-translate-y-full' : 'translate-y-0'}`} />
            <div aria-hidden="true" className={`absolute bottom-0 left-0 w-full h-[50vh] bg-nomad-pink transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] border-t border-white/5 ${phase === 2 ? 'translate-y-full' : 'translate-y-0'}`} />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${phase === 2 ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center text-4xl md:text-5xl lg:text-7xl font-light text-white tracking-tight font-display lowercase overflow-hidden">
                    <span>n</span>
                    <div className={`transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden flex ${phase >= 1 ? 'max-w-[300px] opacity-100' : 'max-w-0 opacity-0'}`}>
                        <span>omad</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InvestorDisclaimer = ({ onAccept }) => {
    const [readAck, setReadAck] = useState(false);
    const [category, setCategory] = useState('');
    const panelRef = useRef(null);
    const scrollableRef = useRef(null);
    const [scrolledToEnd, setScrolledToEnd] = useState(false);

    // Body scroll lock + initial focus
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setTimeout(() => panelRef.current?.focus(), 50);
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    // Track whether the visitor has scrolled the legal text to the end
    useEffect(() => {
        const el = scrollableRef.current;
        if (!el) return;
        const onScroll = () => {
            const reachedEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
            if (reachedEnd) setScrolledToEnd(true);
        };
        // If the content fits without scrolling, mark as read immediately
        if (el.scrollHeight <= el.clientHeight + 24) setScrolledToEnd(true);
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const canProceed = readAck && category.length > 0 && scrolledToEnd;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canProceed) return;
        try {
            sessionStorage.setItem('nomad-investor-acknowledged', '1');
            sessionStorage.setItem('nomad-investor-category', category);
        } catch (err) {}
        onAccept();
    };

    const categories = [
        { id: 'art-19',  label: 'Investment Professional', detail: 'FPO Article 19 — authorised person, or someone with professional experience in matters relating to investments.' },
        { id: 'art-48',  label: 'Certified High Net Worth Individual', detail: 'FPO Article 48 — annual income of £170,000+ or net assets of £430,000+ in the previous financial year (excluding primary residence, pension, and certain insurance contracts).' },
        { id: 'art-50a', label: 'Self-Certified Sophisticated Investor', detail: 'FPO Article 50A — meets at least one of the statutory criteria (e.g. director of a company with turnover £1.6M+, made two or more investments in unlisted companies in the past two years, worked for two+ years in a professional capacity in private equity or in providing finance to SMEs, or member of a network/syndicate of business angels for six+ months).' },
        { id: 'art-50',  label: 'Certified Sophisticated Investor', detail: 'FPO Article 50 — holds a current certificate signed by an authorised person confirming sophisticated-investor status.' },
        { id: 'art-49',  label: 'High Net Worth Company / Unincorporated Association', detail: 'FPO Article 49 — body corporate with called-up share capital or net assets of £5M+ (or £500K+ for groups of 20+ members), or other qualifying entity.' },
    ];

    const risks = [
        { n: '01', t: 'You could lose all the money you invest',           d: 'Most early-stage investments fail. If Nomad fails you are likely to lose 100% of your money — there is no safety net.' },
        { n: '02', t: 'You are unlikely to be protected if something goes wrong', d: 'The Financial Services Compensation Scheme (FSCS) does not generally cover this type of investment. You are unlikely to be able to claim compensation if anything goes wrong.' },
        { n: '03', t: 'You won’t get your money back quickly',         d: 'Even if Nomad is successful it is likely to take several years to get your money back. There is no easy market on which to sell your shares.' },
        { n: '04', t: 'Don’t put all your eggs in one basket',         d: 'Investing more than 10% of your net worth in high-risk investments is unlikely to be in your best interests. Diversify.' },
        { n: '05', t: 'The value of your investment can be reduced',       d: 'Future funding rounds may dilute your shareholding. The company may issue shares at a lower price than you paid.' },
    ];

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 bg-nomad-black/70 backdrop-blur-md"
            aria-hidden={false}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="investor-disclaimer-title"
                aria-describedby="investor-disclaimer-risk"
                className="relative w-full sm:max-w-[760px] h-full sm:h-auto sm:max-h-[92vh] bg-nomad-cream sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden focus:outline-none"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-7 pb-5 border-b border-nomad-black/10 bg-nomad-cream/95 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white border border-nomad-black/5 flex items-center justify-center shadow-sm">
                            <span className="font-serif italic text-base text-nomad-pink mt-[-1px] select-none">n</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-nomad-pink">Investor Notice</span>
                    </div>
                    <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] font-medium text-nomad-black/40">UK FPO 2005 · Self-Certification</span>
                </div>

                {/* Scrollable body */}
                <form id="investor-disclaimer-form" onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
                    <div ref={scrollableRef} className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-14 py-10 md:py-14">
                        <h2 id="investor-disclaimer-title" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-nomad-black leading-[1.05] mb-6">
                            Before you <i>continue.</i>
                        </h2>
                        <p className="text-base md:text-lg font-light text-nomad-black/70 leading-relaxed mb-10 max-w-[560px]">
                            The pages beyond this notice may contain a <span className="text-nomad-black">financial promotion</span> under UK law. Access is restricted to specific categories of investor.
                        </p>

                        {/* FCA-prescribed risk warning */}
                        <div id="investor-disclaimer-risk" className="border-y border-nomad-black/10 py-8 md:py-10 mb-12">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-5">Risk summary · prescribed by the FCA</p>
                            <p className="text-xl md:text-2xl font-light text-nomad-black leading-snug mb-3">
                                Don&rsquo;t invest unless you&rsquo;re prepared to <i>lose all the money</i> you invest.
                            </p>
                            <p className="text-nomad-black/70 leading-relaxed text-[14px] mb-6">
                                This is a high-risk investment and you are unlikely to be protected if something goes wrong. Take a moment to read the five key risks below before you continue.
                            </p>
                            <ol className="space-y-4 mt-6">
                                {risks.map((r) => (
                                    <li key={r.n} className="flex gap-4 pt-4 border-t border-nomad-black/5 first:border-t-0 first:pt-0">
                                        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-pink pt-1 w-8 flex-shrink-0">{r.n}</span>
                                        <div>
                                            <p className="text-[14px] font-medium text-nomad-black leading-snug">{r.t}</p>
                                            <p className="text-[13px] text-nomad-black/60 leading-relaxed mt-1">{r.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* FPO framing */}
                        <section className="space-y-4 text-[14px] leading-relaxed text-nomad-black/70 mb-12">
                            <p>
                                The pages beyond this notice are directed exclusively at persons in the United Kingdom who fall within one or more of the categories in the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005 (the &ldquo;<span className="text-nomad-black">FPO</span>&rdquo;). Persons outside those categories must not act or rely on this material. If you are in any doubt about your status or the action you should take, you should consult an independent professional adviser authorised under FSMA.
                            </p>
                            <p className="text-[12px] text-nomad-black/55 leading-relaxed pt-2">
                                Nomad Neuroscience Ltd is a private limited company registered in England and Wales (Company No. 16558472, registered office 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ). It is not authorised or regulated by the Financial Conduct Authority. Nothing on this site constitutes investment, tax or legal advice, an offer of securities to the public, or a prospectus for the purposes of Part VI FSMA. Nomad is also an investigational medical device, exclusively for clinical investigation; it has not been reviewed or approved by the MHRA and is not available for commercial sale or medical use. Forward-looking statements about regulatory approvals, clinical milestones, product timelines and market opportunity are not guarantees of future outcomes.
                            </p>
                        </section>

                        {/* Step 01 — self-certification */}
                        <fieldset className="mb-12">
                            <legend className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-black/40 mb-2">Step 01</legend>
                            <p className="text-lg md:text-xl font-light text-nomad-black leading-snug mb-6">I confirm I am one of the following <i>(FPO 2005)</i></p>
                            <div className="border-t border-nomad-black/10">
                                {categories.map((c) => {
                                    const isActive = category === c.id;
                                    return (
                                        <label
                                            key={c.id}
                                            htmlFor={`cat-${c.id}`}
                                            className={`group block border-b border-nomad-black/10 cursor-pointer transition-colors ${isActive ? 'bg-nomad-pink/5' : 'hover:bg-nomad-black/[0.02]'}`}
                                        >
                                            <div className="flex items-start gap-4 sm:gap-5 px-1 py-5 sm:py-6">
                                                <input
                                                    id={`cat-${c.id}`}
                                                    type="radio"
                                                    name="investor-category"
                                                    value={c.id}
                                                    checked={isActive}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="sr-only peer"
                                                    required
                                                />
                                                <span aria-hidden="true" className={`mt-1.5 w-4 h-4 rounded-full border flex-shrink-0 transition-all flex items-center justify-center ${isActive ? 'border-nomad-pink' : 'border-nomad-black/20 group-hover:border-nomad-black/50'}`}>
                                                    <span className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-nomad-pink scale-100' : 'bg-transparent scale-0'}`} />
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="flex items-baseline justify-between gap-4 mb-1.5">
                                                        <span className={`text-[15px] font-medium leading-snug ${isActive ? 'text-nomad-black' : 'text-nomad-black/85'}`}>{c.label}</span>
                                                        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-black/30 whitespace-nowrap">{c.id.replace('art-', 'Art. ').toUpperCase()}</span>
                                                    </span>
                                                    <span className="block text-[13px] text-nomad-black/55 leading-relaxed">{c.detail}</span>
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        {/* Step 02 — acknowledgement */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-black/40 mb-4">Step 02</p>
                            <label htmlFor="read-ack" className="flex gap-4 items-start cursor-pointer group">
                                <input
                                    id="read-ack"
                                    type="checkbox"
                                    checked={readAck}
                                    onChange={(e) => setReadAck(e.target.checked)}
                                    className="sr-only peer"
                                    required
                                />
                                <span aria-hidden="true" className={`mt-1 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${readAck ? 'bg-nomad-pink border-nomad-pink' : 'bg-white border-nomad-black/20 group-hover:border-nomad-black/50'}`}>
                                    <svg className={`w-3 h-3 text-white transition-opacity ${readAck ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                                </span>
                                <span className="text-[14px] text-nomad-black/75 leading-relaxed">
                                    I have read and understood the risk warning above. I am accessing this material on my own behalf, the category I have selected applies to me, and I will not pass any information beyond this gate to any person who does not qualify under one of the FPO categories listed.
                                </span>
                            </label>
                        </div>

                        {/* Spacer so footer doesn't crowd the checkbox */}
                        <div aria-hidden="true" className="h-6" />
                    </div>

                    {/* Sticky footer with primary actions */}
                    <div className="border-t border-nomad-black/10 bg-nomad-cream px-6 sm:px-10 md:px-14 py-5 sm:py-6">
                        {!scrolledToEnd && (
                            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-nomad-pink mb-4 flex items-center gap-2">
                                <svg className="w-3 h-3 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
                                <span>Scroll to read the full notice</span>
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                            <button
                                type="submit"
                                disabled={!canProceed}
                                className="flex-1 bg-nomad-black text-white rounded-full py-4 sm:py-5 px-8 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-pink transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                <span>Confirm &amp; proceed</span>
                                <svg className="w-4 h-4 transition-transform group-enabled:group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </button>
                            <a
                                href="/"
                                className="flex-1 sm:flex-none text-center sm:px-10 py-4 sm:py-5 rounded-full text-[12px] font-bold uppercase tracking-[0.25em] text-nomad-black/60 hover:text-nomad-black hover:bg-nomad-black/5 transition-colors flex items-center justify-center"
                            >
                                I do not qualify — exit
                            </a>
                        </div>
                        <p className="text-[10px] text-nomad-black/40 mt-4 leading-relaxed">
                            Your acknowledgement is recorded for this browser session only. By proceeding you confirm the statements above. <a href="/privacy" className="underline hover:text-nomad-pink transition-colors">Privacy Policy</a>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SigninForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-nomad-cream">
            <header className="w-full px-6 md:px-12 lg:px-16 pt-10 md:pt-14">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <a href="/" aria-label="Nomad — return home" className="group flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white border border-nomad-black/5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <span className="font-serif italic text-xl text-nomad-pink mt-[-2px] select-none">n</span>
                        </div>
                        <span className="hidden sm:inline font-display text-sm tracking-wide text-nomad-black/60 group-hover:text-nomad-black transition-colors">nomad</span>
                    </a>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-nomad-black/40">Investor · Portal</span>
                </div>
            </header>

            <main className="flex-1 w-full px-6 md:px-12 lg:px-16 py-16 md:py-24 flex items-center justify-center">
                <div className="w-full max-w-[440px]">
                    <FadeIn>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-6">Investor Portal</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-nomad-black leading-[1.05] mb-4">
                            Authenticate <i>identity.</i>
                        </h1>
                        <p className="text-base md:text-lg font-light text-nomad-black/60 leading-relaxed mb-12">
                            Access by invitation only. Your credentials were sent to you directly.
                        </p>
                    </FadeIn>

                    <FadeIn delay={150}>
                        <form onSubmit={handleSubmit} method="post" action="#" autoComplete="on" noValidate={false} className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="signin-email" className="text-[10px] uppercase tracking-[0.3em] font-bold text-nomad-black/40 block">Email</label>
                                <input
                                    id="signin-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-nomad-black/15 px-0 py-3 text-lg text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/20"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline justify-between">
                                    <label htmlFor="signin-password" className="text-[10px] uppercase tracking-[0.3em] font-bold text-nomad-black/40">Passkey</label>
                                    <a href="mailto:hello@nomadneuro.com?subject=Investor%20portal%20access" className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-pink hover:opacity-70 transition-opacity">Need help?</a>
                                </div>
                                <input
                                    id="signin-password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b border-nomad-black/15 px-0 py-3 text-lg text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/20 tracking-[0.2em]"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-nomad-black text-white rounded-full py-5 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-pink transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-3 relative overflow-hidden group mt-10"
                            >
                                {loading ? (
                                    <span aria-hidden="true" className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </>
                                )}
                                <span className="sr-only">{loading ? 'Signing in' : ''}</span>
                            </button>
                        </form>
                    </FadeIn>

                    <FadeIn delay={300}>
                        <div className="mt-16 pt-8 border-t border-nomad-black/10 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-medium">
                            <a href="/" className="text-nomad-black/50 hover:text-nomad-pink transition-colors inline-flex items-center gap-2 group">
                                <svg className="w-3 h-3 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
                                <span>Return to nomad</span>
                            </a>
                            <a href="mailto:hello@nomadneuro.com" className="text-nomad-black/50 hover:text-nomad-pink transition-colors">Contact</a>
                        </div>
                    </FadeIn>
                </div>
            </main>

            <footer className="w-full px-6 md:px-12 lg:px-16 py-10 border-t border-nomad-black/10">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] font-medium text-nomad-black/40">
                    <p>© 2026 Nomad Neuroscience Ltd · Company № 16558472</p>
                    <p className="text-nomad-black/30 normal-case tracking-wider text-[10px]">
                        Investigational device · Not yet MHRA approved · Not for commercial sale
                    </p>
                    <a href="/privacy" className="hover:text-nomad-pink transition-colors">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
};

const App = () => {
    const [loading, setLoading] = useState(() => {
        try {
            if (sessionStorage.getItem('nomad-intro-seen') === '1') return false;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        } catch (e) {}
        return true;
    });
    const [acknowledged, setAcknowledged] = useState(() => {
        try { return sessionStorage.getItem('nomad-investor-acknowledged') === '1'; } catch (e) { return false; }
    });

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
            <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <SigninForm />
            </div>
            {!loading && !acknowledged && <InvestorDisclaimer onAccept={() => setAcknowledged(true)} />}
        </>
    );
};

createRoot(document.getElementById('root')).render(<App />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
