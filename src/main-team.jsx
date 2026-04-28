import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const team = [
    {
        name: 'Santiago Denari',
        role: 'Chief Executive Officer',
        bio: 'Founder. Sets the standard of evidence the company holds itself to.',
        image: '/assets/images/Santi.jpg',
        linkedin: '',
    },
    {
        name: 'Oliver Case',
        role: 'Chief Science Officer',
        bio: 'Founder. Leads the science programme and clinical investigation strategy.',
        image: '/assets/images/Ollie.png',
        linkedin: '',
    },
    {
        name: 'Callum Shingleton Smith',
        role: 'Head of Engineering',
        bio: 'Owns the hardware platform — sensing, electronics, and the path to a wearable form factor.',
        image: '/assets/images/callum.png',
        linkedin: '',
    },
    {
        name: 'Marcelo Arenas',
        role: 'Head of Systems',
        bio: 'Builds the closed-loop signal chain — from biosignal acquisition to real-time response.',
        image: '/assets/images/Marcelo.png',
        linkedin: '',
    },
];

const advisors = [
    { name: 'Prof. Imanuel Lerman',    role: 'Clinical Team Lead',     image: '/assets/images/Imanuel_Lerman.png' },
    { name: 'Prof. Steve Alty',        role: 'Engineering Advisor',    image: '/assets/images/Steve_Alty.png' },
    { name: 'Anders Borg',             role: 'Strategic Advisor',      image: '/assets/images/Anders_borg.png' },
    { name: 'Ben Black',               role: 'Non-Executive Director', image: '/assets/images/ben_black.png' },
    { name: 'Ben Newton',              role: 'Strategic Advisor',      image: '/assets/images/Ben_Newton.png' },
    { name: 'Dr. Guy Winter',          role: 'Clinical Network',       image: '/assets/images/Guy_Winter.png' },
    { name: 'Dr. Ali Hawks',           role: 'Strategic Advisor',      image: '/assets/images/Ali-050.png' },
    { name: 'Patrik Nilsson',          role: 'Supply Chain Resilience', image: '/assets/images/Patrik_Nilsson.png' },
    { name: 'Manuel Hidalgo Sola',     role: 'Application Development', image: '/assets/images/Manuel.png' },
];

const Team = () => (
    <div className="min-h-screen bg-nomad-cream text-nomad-black antialiased">
        {/* Minimal nav */}
        <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
            <a
                href="/"
                aria-label="nomad — home"
                className="group inline-flex items-center h-12 px-5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/80 transition-colors"
            >
                <span className="font-display font-light lowercase tracking-tight text-[20px] leading-none flex items-center text-nomad-black">
                    <span>n</span>
                    <span
                        aria-hidden="true"
                        className="inline-block rounded-full border-[1.5px] border-nomad-pink mx-[0.04em] align-middle"
                        style={{ width: '0.62em', height: '0.62em' }}
                    />
                    <span className="sr-only">o</span>
                    <span>mad</span>
                </span>
            </a>
            <a href="/" className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors">← back</a>
        </header>

        <main className="max-w-[1200px] mx-auto px-6 pt-40 pb-32">
            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mb-16">team · 2026</p>

            <h1 className="font-display font-light text-nomad-black leading-[1.02] tracking-tight text-[clamp(44px,8vw,104px)] mb-10 max-w-[900px]">
                The people building Nomad.
            </h1>
            <p className="text-[17px] md:text-[18px] text-nomad-black/70 leading-[1.7] max-w-[640px] mb-24">
                A small, deliberate team. Full-time builders first. Below them, the clinical and strategic network whose scrutiny makes the work possible.
            </p>

            {/* Team — full-time */}
            <section className="mb-32">
                <div className="flex items-baseline justify-between mb-12 pb-6 border-b border-nomad-black/15">
                    <h2 className="font-display font-light text-nomad-black tracking-tight text-[clamp(28px,4vw,48px)]">Team</h2>
                    <p className="font-tech text-[11px] text-nomad-pink tracking-[0.18em] lowercase">full-time builders</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
                    {team.map((m) => (
                        <article key={m.name} className="flex flex-col">
                            <div className="aspect-[4/5] w-full bg-nomad-black/5 overflow-hidden mb-6 rounded-lg">
                                {m.image && (
                                    <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h3 className="text-[24px] md:text-[28px] font-light text-nomad-black tracking-tight leading-tight mb-1">{m.name}</h3>
                            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.18em] uppercase mb-4">{m.role}</p>
                            <p className="text-[15px] text-nomad-black/70 leading-[1.65] max-w-[480px] mb-4">{m.bio}</p>
                            {m.linkedin && (
                                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="font-tech text-[11px] text-nomad-pink tracking-[0.18em] lowercase hover:text-nomad-magenta transition-colors">
                                    linkedin →
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            {/* Advisors & Clinical Network */}
            <section>
                <div className="flex items-baseline justify-between mb-10 pb-6 border-b border-nomad-black/10">
                    <h2 className="font-display font-light text-nomad-black/70 tracking-tight text-[clamp(22px,3vw,32px)]">Advisors &amp; Clinical Network</h2>
                    <p className="font-tech text-[11px] text-nomad-black/40 tracking-[0.18em] lowercase">scrutiny &amp; counsel</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                    {advisors.map((a) => (
                        <article key={a.name} className="flex flex-col">
                            <div className="aspect-square w-full bg-nomad-black/5 overflow-hidden mb-4 rounded-md">
                                {a.image && (
                                    <img src={a.image} alt={a.name} loading="lazy" className="w-full h-full object-cover grayscale opacity-90" />
                                )}
                            </div>
                            <h3 className="text-[15px] font-medium text-nomad-black/80 leading-tight mb-1">{a.name}</h3>
                            <p className="font-tech text-[10px] text-nomad-black/50 tracking-[0.16em] uppercase">{a.role}</p>
                        </article>
                    ))}
                </div>
            </section>

            <div className="mt-32 pt-10 border-t border-nomad-pink/30">
                <p className="text-[15px] text-nomad-black/70 mb-3">Looking to join the team?</p>
                <a href="/careers" className="font-tech text-[12px] text-nomad-pink lowercase tracking-[0.14em] hover:text-nomad-magenta transition-colors">
                    open roles →
                </a>
            </div>
        </main>
    </div>
);

createRoot(document.getElementById('root')).render(<Team />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
