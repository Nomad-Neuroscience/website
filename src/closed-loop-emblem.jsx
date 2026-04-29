import React, { useId } from 'react';

/**
 * Nomad's signature visual: the closed-loop emblem.
 *
 * Four-quadrant ring labelled SENSE → DECODE → RESPOND → CALIBRATE,
 * a continuously travelling pulse, an inner sweep arc, and a glowing
 * core. Designed to be the master brand asset — usable as a hero
 * graphic, a manifesto headpiece, an editorial mark, and a section
 * divider. Scales by `size` prop. Pass `broken={true}` for the 404
 * variant (the loop opens up).
 */
export const ClosedLoopEmblem = ({
    size = 240,
    animate = true,
    labels = true,
    showCore = true,
    broken = false,
    className = '',
    ariaLabel = 'Nomad closed-loop interface',
}) => {
    const reactId = useId().replace(/:/g, '');
    const ids = {
        ring: `cle-ring-${reactId}`,
        glow: `cle-glow-${reactId}`,
        sweep: `cle-sweep-${reactId}`,
        core: `cle-core-${reactId}`,
    };

    // Path for the outer ring as a circle. When broken, we render two
    // arcs with a gap at top (where SENSE sits).
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 240 240"
            className={className}
            role="img"
            aria-label={ariaLabel}
            overflow="visible"
        >
            <title>{ariaLabel}</title>

            <defs>
                <linearGradient id={ids.ring} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FF1B8D" />
                    <stop offset="0.55" stopColor="#FF6B6B" />
                    <stop offset="1" stopColor="#FFB4A2" />
                </linearGradient>
                <radialGradient id={ids.glow} cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#FF1B8D" stopOpacity="0.28" />
                    <stop offset="0.6" stopColor="#FF1B8D" stopOpacity="0.06" />
                    <stop offset="1" stopColor="#FF1B8D" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={ids.core} cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#FFD0E5" />
                    <stop offset="0.5" stopColor="#FF1B8D" />
                    <stop offset="1" stopColor="#7A1948" stopOpacity="0.85" />
                </radialGradient>
                <linearGradient id={ids.sweep} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#FF1B8D" stopOpacity="0" />
                    <stop offset="1" stopColor="#FF1B8D" />
                </linearGradient>
            </defs>

            {/* Ambient glow */}
            <circle cx="120" cy="120" r="118" fill={`url(#${ids.glow})`} />

            {/* Outer ring — base track */}
            {broken ? (
                <>
                    {/* Two arcs with a 30° gap at top */}
                    <path
                        d="M 138 22.5 A 100 100 0 1 1 102 22.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        opacity="0.18"
                    />
                </>
            ) : (
                <circle
                    cx="120"
                    cy="120"
                    r="100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    opacity="0.18"
                />
            )}

            {/* Outer ring — luminous animated stroke */}
            {broken ? (
                <>
                    <path
                        d="M 138 22.5 A 100 100 0 1 1 102 22.5"
                        fill="none"
                        stroke={`url(#${ids.ring})`}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.85"
                        filter="drop-shadow(0 0 4px rgba(255,27,141,0.45))"
                    />
                    {/* Severed-end blooms */}
                    <circle cx="138" cy="22.5" r="2" fill="#FF1B8D" filter="drop-shadow(0 0 4px #FF1B8D)" />
                    <circle cx="102" cy="22.5" r="2" fill="#FF1B8D" filter="drop-shadow(0 0 4px #FF1B8D)" />
                </>
            ) : (
                <circle
                    cx="120"
                    cy="120"
                    r="100"
                    fill="none"
                    stroke={`url(#${ids.ring})`}
                    strokeWidth="1.6"
                    strokeDasharray="628"
                    strokeDashoffset={animate ? '300' : '0'}
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 4px rgba(255,27,141,0.4))"
                >
                    {animate && (
                        <animate
                            attributeName="stroke-dashoffset"
                            from="628"
                            to="0"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    )}
                </circle>
            )}

            {/* Inner dashed orbit */}
            <circle
                cx="120"
                cy="120"
                r="76"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 5"
                opacity="0.28"
            />

            {/* Inner arc sweep */}
            {!broken && (
                <circle
                    cx="120"
                    cy="120"
                    r="58"
                    fill="none"
                    stroke="#FF1B8D"
                    strokeWidth="1.1"
                    strokeDasharray="80 290"
                    strokeLinecap="round"
                    opacity="0.85"
                >
                    {animate && (
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 120 120"
                            to="-360 120 120"
                            dur="6s"
                            repeatCount="indefinite"
                        />
                    )}
                </circle>
            )}

            {/* Quadrant tick marks */}
            <g stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" opacity="0.45">
                {!broken && <line x1="120" y1="6" x2="120" y2="14" />}
                <line x1="226" y1="120" x2="234" y2="120" />
                <line x1="120" y1="226" x2="120" y2="234" />
                <line x1="6" y1="120" x2="14" y2="120" />
            </g>

            {/* Labels */}
            {labels && (
                <g
                    fontFamily="ui-monospace, 'JetBrains Mono', monospace"
                    fontSize="8.5"
                    letterSpacing="2.5"
                    fill="currentColor"
                    opacity="0.7"
                >
                    {!broken && <text x="120" y="222" textAnchor="middle">RESPOND</text>}
                    {!broken && <text x="120" y="22" textAnchor="middle">SENSE</text>}
                    <text x="220" y="123" textAnchor="end">DECODE</text>
                    <text x="20" y="123" textAnchor="start">CALIBRATE</text>
                </g>
            )}

            {/* Travelling pulse along the loop */}
            {animate && !broken && (
                <circle r="3.5" fill="#FFD0E5" filter="drop-shadow(0 0 8px #FF1B8D)">
                    <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path="M 120 20 A 100 100 0 1 1 119.99 20 Z"
                    />
                </circle>
            )}

            {/* Centre core */}
            {showCore && !broken && (
                <>
                    <circle cx="120" cy="120" r="14" fill={`url(#${ids.core})`} opacity="0.35">
                        {animate && (
                            <animate attributeName="r" values="13;16;13" dur="2.4s" repeatCount="indefinite" />
                        )}
                    </circle>
                    <circle cx="120" cy="120" r="5" fill="#FFFFFF" />
                    <circle cx="120" cy="120" r="2.5" fill="#FF1B8D" />
                </>
            )}

            {/* Broken state: a fading dotted trail across the gap */}
            {broken && (
                <g opacity="0.55">
                    <circle cx="120" cy="22.5" r="0.7" fill="#FF1B8D" opacity="0.25" />
                    <circle cx="124" cy="22.7" r="0.7" fill="#FF1B8D" opacity="0.4" />
                    <circle cx="116" cy="22.7" r="0.7" fill="#FF1B8D" opacity="0.4" />
                    <circle cx="128" cy="23.1" r="0.7" fill="#FF1B8D" opacity="0.55" />
                    <circle cx="112" cy="23.1" r="0.7" fill="#FF1B8D" opacity="0.55" />
                </g>
            )}
        </svg>
    );
};

/**
 * A small inline mark of the loop — usable as a section divider, a
 * sign-off motif, or a tiny page anchor. No labels, no animation,
 * scales with currentColor.
 */
export const LoopMark = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
);
