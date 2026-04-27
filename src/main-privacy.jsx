import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Menu = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);
const X = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const Magnetic = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia('(pointer: coarse)').matches) return;
        const handleMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();
            setPosition({ x: (clientX - (left + width / 2)) * 0.3, y: (clientY - (top + height / 2)) * 0.3 });
        };
        const handleLeave = () => setPosition({ x: 0, y: 0 });
        element.addEventListener('mousemove', handleMove);
        element.addEventListener('mouseleave', handleLeave);
        return () => {
            element.removeEventListener('mousemove', handleMove);
            element.removeEventListener('mouseleave', handleLeave);
        };
    }, []);
    return (
        <div ref={ref} className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}>
            {children}
        </div>
    );
};

const LoadingScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
        document.documentElement.classList.add('loading');
        const t1 = setTimeout(() => setPhase(1), 450);
        const t2 = setTimeout(() => setPhase(2), 1100);
        const t3 = setTimeout(() => {
            document.documentElement.classList.remove('loading');
            try { sessionStorage.setItem('nomad-intro-seen', '1'); } catch (e) {}
            onComplete();
        }, 1700);
        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
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

const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 select-none">
                <div className="flex items-center gap-2.5 w-full max-w-[750px]">
                    <Magnetic>
                        <a href="/" className="group flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all duration-500 hover:bg-[url('/assets/images/button_back_2.png')] bg-cover bg-center bg-white/53">
                            <span className="font-serif italic text-2xl md:text-3xl mt-[-2px] transition-colors duration-500 text-nomad-pink group-hover:text-white">n</span>
                        </a>
                    </Magnetic>
                    <nav className="flex-1 h-14 md:h-16 rounded-[22px] md:rounded-[26px] backdrop-blur-md flex items-center justify-between px-6 md:px-10 transition-all duration-500 bg-white/53">
                        <div className="hidden md:flex flex-1 items-center justify-around gap-6 text-[14px] font-light text-black/80">
                            <a href="/#platform" className="hover:opacity-50 transition-opacity">Platform</a>
                            <a href="/#technology" className="hover:opacity-50 transition-opacity">Technology</a>
                            <a href="/#team" className="hover:opacity-50 transition-opacity">Team</a>
                        </div>
                        <button
                            className="flex items-center gap-3 ml-auto px-2 py-2 -mr-2 transition-all active:scale-95 text-black"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            <span className="text-[14px] font-medium md:hidden">Menu</span>
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </nav>
                </div>
            </div>
            <div className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-xl pt-32 px-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col gap-6 text-4xl font-light text-nomad-black">
                    <a href="/#platform" onClick={() => setOpen(false)} className="border-b border-black/5 pb-6">Platform</a>
                    <a href="/#technology" onClick={() => setOpen(false)} className="border-b border-black/5 pb-6">Technology</a>
                    <a href="/#team" onClick={() => setOpen(false)} className="border-b border-black/5 pb-6">Team</a>
                    <a href="/signin" onClick={() => setOpen(false)} className="text-2xl pt-4 text-nomad-black/50">Partner Portal</a>
                </div>
            </div>
        </>
    );
};

const Content = () => (
    <div className="pt-48 pb-24 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto">
        <div className="animate-fade-in">
            <p className="text-xs font-bold text-[#FF1B8D] uppercase tracking-[0.3em] mb-6">Legal Framework</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-16 font-display">Privacy Policy</h1>

            <div className="space-y-12 text-[#0A0A0A]/70 leading-relaxed text-lg font-light">
                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">1. Overview</h2>
                    <p>Nomad Neuroscience Ltd ("we", "our", or "us") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and safeguard your personal data when you visit our website and use our services, in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">2. Data We Collect</h2>
                    <p>We may collect and process the following data about you:</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                        <li><strong>Identity Data:</strong> Name and contact details when you join our waitlist or create an account.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, time zone setting, and operating system when you visit our site.</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">3. How We Use Your Data</h2>
                    <p>We use your information to provide and manage our services, communicate updates, improve our user experience, and comply with legal obligations.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">4. Regulatory Status</h2>
                    <p>Nomad is currently an <strong>investigational device</strong>, intended exclusively for clinical investigation purposes. It has not yet been reviewed, cleared, or approved by the Medicines and Healthcare products Regulatory Agency (MHRA) or any other regulatory body. The device is not currently available for commercial medical use or sale to the general public.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">5. Your Rights</h2>
                    <p>Under UK data protection law, you have the right of access, rectification, erasure, and restriction of processing regarding your personal information.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 uppercase tracking-widest">6. Contact Us</h2>
                    <p>If you have any questions about this privacy policy, please contact us at:</p>
                    <div className="mt-4 font-bold uppercase tracking-widest text-[#0A0A0A] space-y-1">
                        <p>NOMAD NEUROSCIENCE LTD</p>
                        <p className="text-sm font-light lowercase tracking-normal">Company № 16558472</p>
                    </div>
                    <p className="mt-4">
                        Registered Office:<br />
                        71-75 Shelton Street, Covent Garden<br />
                        London, United Kingdom, WC2H 9JQ
                    </p>
                    <p className="mt-4">
                        Email: <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:underline">hello@nomadneuro.com</a>
                    </p>
                </section>
            </div>
        </div>
    </div>
);

const Footer = () => (
    <footer data-theme="dark" className="bg-nomad-black text-white/40 py-24 px-6 md:px-16 lg:px-24 font-tech">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                <span className="font-display text-lg tracking-[0.2em] font-medium lowercase text-white">nomad</span>
                <div className="flex flex-wrap gap-8 text-[10px] uppercase tracking-[0.3em] font-medium">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                <div className="space-y-4">
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/20">Regulatory Status</h4>
                    <p className="text-[10px] leading-relaxed uppercase tracking-widest text-white/30">
                        Nomad is an investigational device, exclusively for clinical investigation. It has not yet been reviewed or approved by the MHRA or other regulatory authorities and is not available for commercial sale or medical use.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/20">Corporate</h4>
                    <div className="flex flex-col gap-2 text-[10px] uppercase tracking-widest">
                        <span>&copy; 2026 Nomad Neuroscience Ltd. All rights reserved.</span>
                        <span>Registered in England and Wales • Company № 16558472</span>
                        <span>Note: This policy applies to all our investigational activities.</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

const App = () => {
    const [loading, setLoading] = useState(() => {
        try {
            if (sessionStorage.getItem('nomad-intro-seen') === '1') return false;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        } catch (e) {}
        return true;
    });
    return (
        <>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
            <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <Navbar />
                <Content />
                <Footer />
            </div>
        </>
    );
};

createRoot(document.getElementById('root')).render(<App />);
