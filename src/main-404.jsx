import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Wordmark } from './wordmark.jsx';
import { ClosedLoopEmblem } from './closed-loop-emblem.jsx';

const NotFound = () => (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
        {/* Ambient backdrop */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
                background:
                    'radial-gradient(60% 50% at 75% 35%, rgba(233,74,156,.12), transparent 65%), radial-gradient(80% 60% at 12% 90%, rgba(233,74,156,.06), transparent 60%)',
            }}
        />

        {/* Header */}
        <header className="relative z-10 fixed top-6 left-6 right-6 flex items-center justify-between">
            <a
                href="/"
                aria-label="nomad — home"
                className="group inline-flex items-center h-12 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors"
            >
                <Wordmark className="text-[20px] text-white" />
            </a>
            <a
                href="/"
                className="font-tech text-[11px] uppercase tracking-[0.22em] text-white/60 hover:text-white transition-colors"
            >
                ← back
            </a>
        </header>

        {/* Centre stage */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
            <ClosedLoopEmblem
                size={320}
                broken
                labels={false}
                showCore={false}
                className="text-white/85 mb-14"
                ariaLabel="The loop is open"
            />

            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.3em] lowercase mb-8">
                404 · the loop is open
            </p>

            <h1
                className="font-display font-light text-white leading-[1.02] tracking-tight mb-8"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
                Nothing here.
                <br />
                <span className="italic text-white/55" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                    Yet.
                </span>
            </h1>

            <p className="text-white/60 leading-[1.7] max-w-[480px] text-[15px] md:text-[17px] mb-12">
                The page you're looking for is either embargoed, retired, or not yet
                declassified. The loop will close again soon — until then, the rest
                of the site is open.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <a
                    href="/"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-nomad-pink text-white text-sm font-medium hover:bg-nomad-magenta pink-glow-sm transition-colors"
                >
                    Return home
                </a>
                <a
                    href="/manifesto"
                    className="font-tech text-[12px] text-white/50 hover:text-white lowercase tracking-[0.18em] border-b border-white/15 hover:border-white pb-1 transition-colors"
                >
                    read the manifesto →
                </a>
            </div>
        </main>

        <footer className="relative z-10 px-6 pb-8 font-tech text-[10px] uppercase tracking-[0.22em] text-white/30 text-center">
            nomad neuroscience · investigational device · not for sale
        </footer>
    </div>
);

createRoot(document.getElementById('root')).render(<NotFound />);
import('./cookie-banner.js').then((m) => m.mountCookieBanner());
