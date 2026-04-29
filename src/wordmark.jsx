import React from 'react';

/**
 * The Nomad wordmark — `n[O]mad` where the "o" is rendered as a hollow ring.
 * Single source of truth for the brand mark across every entry point.
 */
export const Wordmark = ({ className = '', oColor = '#FF1B8D', oStroke = '1.5px' }) => (
    <span className={`font-display font-light lowercase tracking-tight inline-flex items-center leading-none ${className}`}>
        <span>n</span>
        <span
            aria-hidden="true"
            className="inline-block rounded-full mx-[0.04em] align-middle"
            style={{
                width: '0.62em',
                height: '0.62em',
                border: `${oStroke} solid ${oColor}`,
            }}
        />
        <span className="sr-only">o</span>
        <span>mad</span>
    </span>
);

/**
 * Subpage header — used on every non-homepage entry (manifesto, team, contact,
 * privacy, cookies, careers, signin shell). The home navbar is its own thing
 * because of dark/light theme switching and the mobile menu.
 */
export const SubpageHeader = ({ backHref = '/', backLabel = '← back' }) => (
    <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <a
            href="/"
            aria-label="nomad — home"
            className="group inline-flex items-center h-12 px-5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 hover:bg-white transition-colors shadow-[0_1px_2px_rgba(10,10,10,0.04)]"
        >
            <Wordmark className="text-[20px] text-nomad-black" />
        </a>
        <a
            href={backHref}
            className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors"
        >
            {backLabel}
        </a>
    </header>
);
