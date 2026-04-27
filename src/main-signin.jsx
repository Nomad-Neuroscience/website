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
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <FadeIn>
                <div className="text-center mb-16">
                    <a href="/" className="inline-block mb-10 group">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-xl border border-black/5 group-hover:scale-105 transition-transform duration-500 mx-auto">
                            <span className="font-serif italic text-3xl md:text-4xl text-nomad-pink mt-[-2px] select-none">n</span>
                        </div>
                    </a>
                    <div className="flex flex-col items-center gap-4">
                        <span className="px-5 py-1.5 rounded-full border border-nomad-black/10 text-[10px] uppercase tracking-[0.3em] font-medium text-nomad-black/40">Partner Portal</span>
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-nomad-black">
                            Authenticate <i>Identity</i>
                        </h1>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={200}>
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-nomad-cream text-[10px] uppercase tracking-widest font-bold text-nomad-black/30 transition-colors group-focus-within:text-nomad-pink">
                                    Identity / Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border border-nomad-black/10 rounded-2xl px-6 py-4 text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/10"
                                    placeholder="your@access.com"
                                />
                            </div>
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-nomad-cream text-[10px] uppercase tracking-widest font-bold text-nomad-black/30 transition-colors group-focus-within:text-nomad-pink">
                                    Secure Passkey
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border border-nomad-black/10 rounded-2xl px-6 py-4 text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/10"
                                    placeholder="••••••••"
                                />
                                <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-bold text-nomad-pink hover:opacity-70 transition-opacity">
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-10 h-6 bg-nomad-black/5 rounded-full transition-colors group-hover:bg-nomad-black/10">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-nomad-pink" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-nomad-black/30">Keep synchronized</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-nomad-black text-white rounded-2xl py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-nomad-pink transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center relative overflow-hidden group"
                        >
                            <span className={loading ? 'opacity-0' : 'opacity-100 group-hover:translate-x-1 transition-transform'}>
                                Authorize Access
                            </span>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-nomad-black/20 mb-6 italic">No credentials?</p>
                        <a href="/" className="inline-flex items-center gap-2 group">
                            <span className="text-sm font-medium text-nomad-black hover:text-nomad-pink transition-colors">Return to platform</span>
                            <svg className="w-4 h-4 text-nomad-pink transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                        </a>
                    </div>
                </div>
            </FadeIn>

            <div className="mt-auto pt-20">
                <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-nomad-black/40 flex flex-col gap-2 items-center">
                    <p>© 2026 NOMAD NEUROSCIENCE LTD. All rights reserved. <a href="/privacy" className="ml-4 hover:text-nomad-pink transition-colors text-nomad-black/60">Privacy Policy</a></p>
                    <p className="opacity-80 text-[8px] text-center">
                        Registered in England and Wales • Company № 16558472<br />
                        Registered Office: 71-75 Shelton Street, London, WC2H 9JQ
                    </p>
                    <p className="mt-4 pt-4 border-t border-nomad-black/10 opacity-70 text-[7px] leading-relaxed max-w-[280px] text-center uppercase tracking-wider text-nomad-black/80">
                        <strong>Regulatory Status</strong>: Nomad is an investigational device, exclusively for clinical investigation. Not yet MHRA approved. Not for commercial sale.
                    </p>
                </div>
            </div>
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
        </>
    );
};

createRoot(document.getElementById('root')).render(<App />);
