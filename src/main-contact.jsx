import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const DOORS = [
    {
        id: '01',
        formName: 'contact-patient',
        label: 'door 01 — clinical investigation',
        title: 'Living with autonomic dysfunction.',
        intro: 'If you have been told there is nothing targeted for what you have — write to us first. Eligibility for the clinical investigation programme is limited and rolling. We respond to every message.',
        fields: [
            { name: 'fullName',        label: 'Full name',                              type: 'text',     required: true },
            { name: 'email',           label: 'Email',                                  type: 'email',    required: true },
            { name: 'country',         label: 'Country of residence',                   type: 'text',     required: true },
            { name: 'condition',       label: 'What you are living with — in your own words', type: 'textarea', required: true, rows: 6 },
            { name: 'diagnosisStatus', label: 'Diagnosis status (optional)',            type: 'text',     required: false, placeholder: 'e.g. POTS diagnosed 2022, suspected long-COVID dysautonomia' },
        ],
        cta: 'Register interest',
    },
    {
        id: '02',
        formName: 'contact-collaborator',
        label: 'door 02 — research & clinical',
        title: 'Researchers, clinicians, regulatory specialists.',
        intro: 'If your work touches autonomic neuroscience, neuromodulation, wearable biosensing, signal processing, or device regulation — we want to hear what you are working on. We collaborate.',
        fields: [
            { name: 'fullName',     label: 'Full name',                  type: 'text',     required: true },
            { name: 'email',        label: 'Email',                      type: 'email',    required: true },
            { name: 'organisation', label: 'Organisation / institution', type: 'text',     required: true },
            { name: 'role',         label: 'Role',                       type: 'text',     required: true, placeholder: 'e.g. Senior research fellow, clinical PI, regulatory consultant' },
            { name: 'brief',        label: 'A short brief — what you are working on, and where it overlaps with our work', type: 'textarea', required: true, rows: 6 },
        ],
        cta: 'Submit collaboration brief',
    },
    {
        id: '03',
        formName: 'contact-investor',
        label: 'door 03 — gated',
        title: 'Sophisticated capital.',
        intro: 'Frontier biotech and deep-tech investors only. Access to the investor portal is by request. We respond personally within 5 business days.',
        fields: [
            { name: 'fullName',  label: 'Full name', type: 'text',  required: true },
            { name: 'email',     label: 'Email',     type: 'email', required: true },
            { name: 'firm',      label: 'Firm',      type: 'text',  required: true },
            { name: 'fundStage', label: 'Stage focus', type: 'text', required: true, placeholder: 'e.g. seed / Series A / strategic / family office' },
            { name: 'interest',  label: 'What you are looking to understand', type: 'textarea', required: true, rows: 6 },
        ],
        cta: 'Request portal access',
    },
];

const Wordmark = () => (
    <span className="font-display font-light lowercase tracking-tight text-[20px] leading-none flex items-center text-nomad-black">
        <span>n</span>
        <span className="text-nomad-pink">o</span>
        <span>mad</span>
    </span>
);

const encode = (data) =>
    Object.keys(data)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

// Per-field hard cap (defence-in-depth alongside Netlify's own limits).
const MAX_FIELD_LEN = 4000;
// Minimum render-to-submit dwell. Bots typically submit instantly.
const MIN_DWELL_MS = 1500;

const Door = ({ door, isActive, onActivate }) => {
    const [values, setValues] = useState({});
    const [honeypot, setHoneypot] = useState(''); // visible-to-bots, hidden-from-humans field
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [mountedAt] = useState(() => Date.now());

    const handleChange = (name) => (e) => {
        const v = String(e.target.value ?? '').slice(0, MAX_FIELD_LEN);
        setValues((prev) => ({ ...prev, [name]: v }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Anti-bot: honeypot must remain empty.
        if (honeypot) { setDone(true); return; }
        // Anti-bot: enforce minimum dwell (silently swallow as success to avoid feedback).
        if (Date.now() - mountedAt < MIN_DWELL_MS) { setDone(true); return; }
        if (!consent) {
            setError('Please confirm consent below to submit.');
            return;
        }
        if (submitting) return; // double-submit guard
        setSubmitting(true);
        try {
            // Re-clamp on submit in case of programmatic value injection.
            const clamped = Object.fromEntries(
                Object.entries(values).map(([k, v]) => [k, String(v ?? '').slice(0, MAX_FIELD_LEN)])
            );
            const payload = {
                'form-name': door.formName,
                'bot-field': '',
                consent: 'yes',
                ...clamped,
            };
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encode(payload),
            });
            if (!res.ok) throw new Error('Submission failed');
            setDone(true);
        } catch (err) {
            setError('Something went wrong. Please email hello@nomadneuro.com directly.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <article id={`door-${door.id}`} className={`border-t border-nomad-black/15 transition-opacity ${isActive ? 'opacity-100' : 'opacity-90'}`}>
            <button
                type="button"
                onClick={onActivate}
                className="w-full flex flex-wrap items-baseline gap-x-8 gap-y-2 text-left pt-12 pb-6 group"
                aria-expanded={isActive}
                aria-controls={`door-${door.id}-body`}
            >
                <span className="font-tech text-[11px] text-nomad-pink tracking-[0.2em] lowercase">{door.label}</span>
                <span className="font-tech text-[11px] text-nomad-black/40 tracking-[0.2em] lowercase ml-auto">
                    {isActive ? 'open' : 'closed'} · click to {isActive ? 'collapse' : 'open'}
                </span>
            </button>

            <h2 className="font-display font-light leading-[1.05] tracking-tight mb-6" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {door.title}
            </h2>

            <p className="text-nomad-black/70 leading-[1.7] max-w-[640px] mb-10" style={{ fontSize: '17px' }}>
                {door.intro}
            </p>

            <div id={`door-${door.id}-body`} className={`overflow-hidden transition-all ${isActive ? 'max-h-[2400px] opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={!isActive}>
                {done ? (
                    <div className="bg-white/50 border border-nomad-pink/30 rounded-2xl p-8 max-w-[640px] mb-16">
                        <p className="font-tech text-[11px] text-nomad-pink tracking-[0.2em] lowercase mb-4">received</p>
                        <p className="text-nomad-black/85 leading-[1.7]" style={{ fontSize: '17px' }}>
                            {door.id === '03'
                                ? "Received. We'll respond personally within 5 business days. Please don't write more than once."
                                : "Received. Every message is read by a human. We'll be in touch."}
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        name={door.formName}
                        method="POST"
                        action="/"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        autoComplete="on"
                        noValidate={false}
                        className="max-w-[640px] mb-16 space-y-6"
                    >
                        <input type="hidden" name="form-name" value={door.formName} />
                        {/* Honeypot: visually hidden, accessibility-hidden, but present in DOM for naive bots. */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                            <label>Don't fill this out: <input
                                name="bot-field"
                                tabIndex={-1}
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            /></label>
                        </div>

                        {door.fields.map((f) => (
                            <div key={f.name} className="flex flex-col">
                                <label htmlFor={`${door.id}-${f.name}`} className="font-tech text-[11px] text-nomad-black/55 tracking-[0.16em] uppercase mb-2">
                                    {f.label}{f.required && <span className="text-nomad-pink"> *</span>}
                                </label>
                                {f.type === 'textarea' ? (
                                    <textarea
                                        id={`${door.id}-${f.name}`}
                                        name={f.name}
                                        rows={f.rows || 4}
                                        required={f.required}
                                        maxLength={MAX_FIELD_LEN}
                                        placeholder={f.placeholder}
                                        value={values[f.name] || ''}
                                        onChange={handleChange(f.name)}
                                        className="bg-white/60 border border-nomad-black/15 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-nomad-pink transition-colors resize-y"
                                    />
                                ) : (
                                    <input
                                        id={`${door.id}-${f.name}`}
                                        type={f.type}
                                        name={f.name}
                                        required={f.required}
                                        maxLength={f.type === 'email' ? 254 : MAX_FIELD_LEN}
                                        placeholder={f.placeholder}
                                        value={values[f.name] || ''}
                                        onChange={handleChange(f.name)}
                                        autoComplete={f.type === 'email' ? 'email' : 'off'}
                                        className="bg-white/60 border border-nomad-black/15 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-nomad-pink transition-colors"
                                    />
                                )}
                            </div>
                        ))}

                        <label className="flex gap-3 items-start text-[14px] text-nomad-black/70 leading-[1.6]">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-1 accent-nomad-pink"
                                required
                            />
                            <span>
                                I consent to Nomad Neuroscience Ltd processing the information above to respond to my enquiry. See the{' '}
                                <a href="/privacy" className="text-nomad-pink hover:text-nomad-magenta underline decoration-nomad-pink/40 underline-offset-2">privacy notice</a>.
                            </span>
                        </label>

                        {error && (
                            <p className="font-tech text-[12px] text-nomad-pink tracking-[0.1em] lowercase">{error}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center px-7 py-3 rounded-full bg-nomad-pink text-white font-medium hover:bg-nomad-magenta transition-colors disabled:opacity-50"
                                style={{ fontSize: '14px' }}
                            >
                                {submitting ? 'Sending…' : door.cta}
                            </button>
                            {door.id === '03' && (
                                <span className="font-tech text-[11px] text-nomad-black/45 tracking-[0.16em] lowercase">
                                    response within 5 business days
                                </span>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </article>
    );
};

const Contact = () => {
    const initialDoor = useMemo(() => {
        if (typeof window === 'undefined') return '01';
        const params = new URLSearchParams(window.location.search);
        const fromParam = params.get('door');
        if (['01', '02', '03'].includes(fromParam)) return fromParam;
        const fromHash = (window.location.hash || '').replace('#door-', '');
        if (['01', '02', '03'].includes(fromHash)) return fromHash;
        return '01';
    }, []);
    const [active, setActive] = useState(initialDoor);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const el = document.getElementById(`door-${active}`);
        if (el && initialDoor !== '01') {
            const top = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, [initialDoor, active]);

    return (
        <div className="min-h-screen bg-nomad-cream text-nomad-black antialiased">
            <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
                <a href="/" aria-label="nomad — home" className="group inline-flex items-center h-12 px-5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/80 transition-colors">
                    <Wordmark />
                </a>
                <a href="/" className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors">← back</a>
            </header>

            <main className="max-w-[900px] mx-auto px-6 pt-40 pb-32">
                <p className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mb-16">contact · three doors</p>

                <h1 className="font-display font-light leading-[1.02] tracking-tight mb-10" style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}>
                    Three ways in.
                </h1>

                <p className="text-nomad-black/70 leading-[1.7] max-w-[640px] mb-24" style={{ fontSize: '18px' }}>
                    The site is mostly quiet. The inbox is not. Every message is read by a human. Choose the door that fits, and tell us what you need to tell us.
                </p>

                {DOORS.map((d) => (
                    <Door key={d.id} door={d} isActive={active === d.id} onActivate={() => setActive(active === d.id ? null : d.id)} />
                ))}

                <div className="mt-32 pt-10 border-t border-nomad-pink/30">
                    <p className="font-tech text-[11px] text-nomad-black/50 tracking-[0.18em] lowercase">
                        prefer email? <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>
                    </p>
                </div>
            </main>
        </div>
    );
};

createRoot(document.getElementById('root')).render(<Contact />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
