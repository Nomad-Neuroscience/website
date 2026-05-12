import React from 'react';

/**
 * The Nomad wordmark — `nomad` with a pink "o" sitting on the baseline.
 * Single source of truth for the brand mark across every entry point.
 */
export const Wordmark = ({ className = '', oColor = '#FF1B8D' }) => (
    <span className={`font-display font-light lowercase tracking-tight inline-flex items-baseline leading-none ${className}`}>
        <span>n</span>
        <span style={{ color: oColor }}>o</span>
        <span>mad</span>
    </span>
);

/**
 * Subpage header — used on every non-homepage entry (manifesto, team, contact,
 * privacy, cookies, careers, signin shell). The home navbar is its own thing
 * because of dark/light theme switching and the mobile menu.
 */
export const SubpageHeader = ({ backHref = '/', backLabel = '← back' }) => (
    <header className="fixed top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-50 flex items-center justify-between">
        <a
            href="/"
            aria-label="nomad — home"
            className="group inline-flex items-center h-11 sm:h-12 px-4 sm:px-5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 hover:bg-white transition-colors shadow-[0_1px_2px_rgba(10,10,10,0.04)]"
        >
            <Wordmark className="text-[18px] sm:text-[20px] text-nomad-black" />
        </a>
        <a
            href={backHref}
            className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors py-2 px-1"
        >
            {backLabel}
        </a>
    </header>
);
