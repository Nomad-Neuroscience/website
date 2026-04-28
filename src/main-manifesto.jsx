import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Manifesto = () => (
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
            <a
                href="/"
                className="font-tech text-[11px] uppercase tracking-[0.22em] text-nomad-black/60 hover:text-nomad-black transition-colors"
            >
                ← back
            </a>
        </header>

        {/* Essay */}
        <article className="max-w-[640px] mx-auto px-6 pt-40 pb-32">
            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mb-12">manifesto · 2026.04</p>

            <h1 className="font-display font-light text-nomad-black leading-[1.02] tracking-tight text-[clamp(44px,7vw,88px)] mb-20">
                Why we built the loop.
            </h1>

            <hr className="border-0 h-px bg-nomad-pink/40 mb-12" />

            <div className="text-[18px] md:text-[19px] leading-[1.8] text-nomad-black/85 space-y-8">
                <p>
                    There is a system inside you right now that runs your heart, your breath, your blood pressure, your gut, and your pupils. It does this without being asked. It has been doing it since before you were born. For most people it hums along beneath every thought they have ever had. For many millions of others, it does not — and the consequences are catastrophic in ways modern medicine has, until recently, had no precise tools to address.
                </p>

                <p>We started Nomad to build those tools.</p>

                <p>
                    The autonomic nervous system has been the target of clinical intervention for 140 years. The vagus nerve was identified as a therapeutic site in 1881. It was implanted as a clinical device for the first time in 1988. The FDA approved it for epilepsy in 1997, for treatment-resistant depression in 2005, for stroke recovery in 2021. Every one of those approvals required a surgeon, an implant, a hospital, a battery under the skin and a wire to it. The science was real. The access was not.
                </p>

                <p>
                    And the loop was never closed. Every implanted vagus nerve stimulator on the market today delivers stimulation on a schedule. It does not listen. It does not adapt. It does not know what the body is doing in the moment that it acts. The conversation between clinical intervention and the body it was intervening in has been one-directional. Stimulate. Hope. Follow up.
                </p>

                <p>We are building the system that listens back.</p>

                <hr className="border-0 h-px bg-nomad-pink/40 my-12" />

                <p>
                    We know what it costs to live without that system. One of us spent fifteen years being told that what was wrong was anxiety. Hundreds of millions of people are having a version of that conversation right now — POTS, diabetic autonomic neuropathy, long COVID, heart failure, resistant hypertension. The numbers are large, the answers are mostly small, and the language available is borrowed from the wrong system. <em>Have you considered it might be stress</em> is what you say when the tools are insufficient to say anything else.
                </p>

                <p>We are building the tools.</p>

                <p>
                    What changed is not the idea. The idea has been waiting since Bailey and Bremer published in 1938. What changed is the sensors and the silicon. Optically pumped magnetometers can now measure the magnetic field of an action potential without breaking the skin. Hexagonal surface electrode arrays can resolve compound action potentials from cardiac afferents and the cervical vagus at a fidelity that, ten years ago, required a needle. The signal-to-noise problem that kept this work in the laboratory for two generations is now an engineering problem rather than a physical one. Engineering problems get solved.
                </p>

                <p>
                    Afferent signals — the information the body sends the brain — are data. Symptoms are interpretations of that data, constructed by a brain making its best guess about what the body needs. When that interpretation goes wrong, the body does not stop sending signals. It keeps sending them, louder. Our job is not to override the body. It is to remove the friction that keeps the conversation in disorder. Let the body do what it has been trying to do, with better information, faster.
                </p>

                <p>
                    That is what closed-loop means here. Not a smart wearable. Not AI-powered health insights. A continuous, beat-by-beat, millisecond-resolution conversation between a system that senses what the body is doing and a system that responds to it — calibrated to the person wearing it, because no two autonomic systems are alike.
                </p>

                <hr className="border-0 h-px bg-nomad-pink/40 my-12" />

                <p>
                    We are preparing for first-in-human investigation, with collaborators across UK and US institutions, under protocols whose numbers we will publish when we have data to defend them. We are pursuing UKCA and CE marking under voluntary application of medical-device standards because the people who will eventually wear this deserve a device built to that standard.
                </p>

                <p>
                    We refuse to release anything we cannot prove. We mean it as a working constraint, not a slogan. The clinical investigation is the work. The product follows the data. We are moving as fast as the science allows, which is sometimes slower than any of us would like.
                </p>

                <hr className="border-0 h-px bg-nomad-pink/40 my-12" />

                <p>
                    If you have spent years being told that what you are experiencing is in your head, or that the answer is to relax — we built this for you.
                </p>

                <p>
                    If you are a clinician who has watched patients leave your office with a diagnosis you knew was incomplete, we built it for you too.
                </p>

                <p>
                    If you are an investor or a researcher or an engineer wondering whether this is real: it is real. It is out of the lab — preparing for first-in-human investigation. It is, at the time of writing, mostly hidden. That will not last.
                </p>

                <p>Pink is the colour of the system that runs you.</p>

                <p>We built the interface.</p>
            </div>

            <div className="mt-20 pt-10 border-t border-nomad-pink/30">
                <p className="font-tech text-[11px] text-nomad-pink tracking-[0.18em] lowercase mb-2">the founding team</p>
                <p className="font-tech text-[11px] text-nomad-black/50 tracking-[0.18em] lowercase">nomad neuroscience · april 2026</p>
            </div>

            <div className="mt-16">
                <a
                    href="/?door=02#three-doors"
                    className="font-tech text-[12px] text-nomad-pink lowercase tracking-[0.14em] hover:text-nomad-magenta transition-colors"
                >
                    if this resonates, write to us. door 02 →
                </a>
            </div>
        </article>
    </div>
);

createRoot(document.getElementById('root')).render(<Manifesto />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
