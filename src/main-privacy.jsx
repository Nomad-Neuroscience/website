import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { SubpageHeader } from './wordmark.jsx';

const H = ({ id, n, children }) => (
    <h2 id={id} className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mt-20 mb-6">
        {n} — {children}
    </h2>
);

const P = ({ children }) => (
    <p className="text-nomad-black/85 leading-[1.8] mb-5" style={{ fontSize: '17px' }}>{children}</p>
);

const UL = ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 mb-5 text-nomad-black/85 leading-[1.7]" style={{ fontSize: '17px' }}>
        {children}
    </ul>
);

const Privacy = () => (
    <div className="min-h-screen bg-nomad-cream text-nomad-black antialiased overflow-x-hidden">
        <SubpageHeader />

        <main className="max-w-[720px] mx-auto px-6 pt-40 pb-32">
            <p className="font-tech text-[11px] text-nomad-pink tracking-[0.22em] lowercase mb-12">privacy notice · last updated 2026.04</p>

            <h1 className="font-display font-light leading-[1.02] tracking-tight mb-12" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
                How we handle your information.
            </h1>

            <P>
                This notice explains how Nomad Neuroscience Ltd ("Nomad", "we", "us") processes personal data when you use this website, write to us, register interest in our clinical investigation programme, or otherwise interact with the company. We have written it in plain language. Where law uses specific terms, we use them too.
            </P>
            <P>
                We process personal data in line with the UK General Data Protection Regulation and the Data Protection Act 2018; with the EU General Data Protection Regulation (Regulation (EU) 2016/679) where it applies; and with the Swiss Federal Act on Data Protection (FADP, as revised in September 2023) where it applies.
            </P>

            <H n="01" id="controller">data controller</H>
            <P>
                Nomad Neuroscience Ltd is the controller of the personal data described in this notice. We are registered in England and Wales, company № 16558472. Our registered office is 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom. You can contact us about anything in this notice at <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>.
            </P>
            <P>
                We do not currently maintain an Article 27 representative inside the EU/EEA or a Swiss representative. If we begin offering goods or services to, or monitoring the behaviour of, individuals in those territories at a scale that requires one, we will appoint and disclose them in this notice.
            </P>
            <P>
                <strong>Data protection officer.</strong> We have assessed our processing activities against the criteria in Article 37 UK GDPR. We are not a public authority; our core activities do not involve large-scale, regular, systematic monitoring of individuals; and the special-category data we currently process (limited health context voluntarily shared via the waitlist form) does not meet the "large scale" threshold that would make a DPO mandatory. We have therefore not appointed a formal DPO at this stage. The designated contact for all data protection matters is <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>. We will review this assessment if our processing activities expand — in particular, as the clinical investigation programme scales.
            </P>

            <H n="02" id="data">what we collect</H>
            <P>We process the following categories of personal data:</P>
            <UL>
                <li><strong>Contact data</strong> — name, email address, country, organisation or firm, role, and anything else you choose to put in a free-text field when writing to us.</li>
                <li><strong>Health-relevant context</strong> — if you write to us about the clinical investigation programme, you may share a description of a condition or symptom. We treat this as <em>special category data</em> under Article 9 GDPR.</li>
                <li><strong>Technical data</strong> — IP address, browser, device, and pages viewed, collected by our hosting provider for security and performance purposes only.</li>
                <li><strong>Communications</strong> — the content of any email correspondence you have with us.</li>
            </UL>
            <P>
                We do not collect data from the Nomad device on this website. The investigational device is operated under separate clinical investigation protocols and a separate participant information and consent process. That is described in the protocol documentation, not here.
            </P>

            <H n="03" id="basis">lawful basis</H>
            <P>We rely on the following lawful bases under Article 6 GDPR (and the corresponding bases under the Swiss FADP):</P>
            <UL>
                <li><strong>Consent</strong> (Art. 6(1)(a)) — when you submit a form, subscribe to updates, or contact us.</li>
                <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — for site security, fraud prevention, basic analytics, and corresponding with collaborators and investors. Our legitimate interest is operating the company responsibly; we have considered your rights and balanced them against ours.</li>
                <li><strong>Legal obligation</strong> (Art. 6(1)(c)) — where we are required by law to keep records, respond to regulators, or co-operate with lawful requests.</li>
            </UL>
            <P>
                Where we process special category data — for example, when you describe a condition in a contact form — we rely on your <strong>explicit consent</strong> (Art. 9(2)(a) GDPR, Art. 6(7) Swiss FADP). You can withdraw that consent at any time without affecting processing that took place before withdrawal.
            </P>

            <H n="04" id="purposes">why we use it</H>
            <UL>
                <li>To respond to enquiries and applications.</li>
                <li>To assess whether someone may be eligible for the clinical investigation programme.</li>
                <li>To send updates you have asked for.</li>
                <li>To operate, secure, and improve this website.</li>
                <li>To meet legal, regulatory, and accounting obligations.</li>
            </UL>
            <P>We do not sell personal data. We do not use personal data to make automated decisions that produce legal or similarly significant effects.</P>

            <H n="05" id="recipients">who sees it</H>
            <P>Personal data is accessed by Nomad personnel on a need-to-know basis. We share data with the following categories of processor:</P>
            <UL>
                <li><strong>Hosting and form processing</strong> — Netlify, Inc. (United States), which hosts this website and processes form submissions on our behalf under a signed Article 28 Data Processing Agreement.</li>
                <li><strong>Email infrastructure</strong> — Google Workspace (Google LLC, United States), which provides our email service.</li>
                <li><strong>Professional advisers</strong> — legal, accounting, regulatory, and clinical advisers, where engagement requires it.</li>
                <li><strong>Authorities</strong> — regulators, courts, and law enforcement, where legally required.</li>
            </UL>
            <P>Fonts used on this site are self-hosted; no font or analytics CDN requests are made to third parties. Each processor listed above is bound by an appropriate contract (a UK / EU GDPR Article 28 data processing agreement or equivalent) and may only process data on our instructions.</P>

            <H n="06" id="transfers">international transfers</H>
            <P>
                Some of our processors are located outside the UK, the EEA, or Switzerland — most notably in the United States. Where we transfer personal data internationally, we rely on one of the following safeguards: an applicable adequacy decision (including the UK Extension to the EU–US Data Privacy Framework and the Swiss–US Data Privacy Framework, where the recipient is certified); the UK International Data Transfer Agreement; or the European Commission's Standard Contractual Clauses with the UK Addendum and Swiss-specific amendments where required. You can request a copy of the safeguards in place by writing to <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>.
            </P>

            <H n="07" id="retention">how long we keep it</H>
            <P>
                We keep personal data only as long as necessary for the purpose we collected it for. As a default, contact-form submissions are retained for up to 24 months from your last interaction with us, unless a longer period is required by law (for example, for accounting records, which we retain for 6 years). You can ask us to delete your data sooner; see your rights below.
            </P>

            <H n="08" id="rights">your rights</H>
            <P>Under UK / EU GDPR and the Swiss FADP, you have the right to:</P>
            <UL>
                <li>Access the personal data we hold about you.</li>
                <li>Have inaccurate data corrected.</li>
                <li>Have your data deleted ("right to be forgotten") in certain circumstances.</li>
                <li>Restrict or object to processing in certain circumstances.</li>
                <li>Receive your data in a portable format and have it transmitted to another controller.</li>
                <li>Withdraw consent at any time, where consent is the basis for processing.</li>
                <li>Lodge a complaint with a supervisory authority — see below.</li>
            </UL>
            <P>
                To exercise any of these rights, write to <a href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-nomad-magenta">hello@nomadneuro.com</a>. We will respond within one month, extendable to three months for complex requests, and will tell you if we need longer.
            </P>

            <H n="09" id="complaints">complaints</H>
            <P>
                If you are not satisfied with how we have handled your data, you have the right to complain to the relevant supervisory authority:
            </P>
            <UL>
                <li><strong>United Kingdom</strong> — Information Commissioner's Office (ICO), <a href="https://ico.org.uk" className="text-nomad-pink hover:text-nomad-magenta">ico.org.uk</a>.</li>
                <li><strong>European Union / EEA</strong> — your local data protection authority. A list is published by the European Data Protection Board.</li>
                <li><strong>Switzerland</strong> — Federal Data Protection and Information Commissioner (FDPIC), <a href="https://www.edoeb.admin.ch" className="text-nomad-pink hover:text-nomad-magenta">edoeb.admin.ch</a>.</li>
            </UL>

            <H n="10" id="security">security</H>
            <P>
                We use appropriate technical and organisational measures to protect personal data, including transport-layer encryption, access control, principle-of-least-privilege for personnel, and contractual safeguards with processors. No system is perfectly secure; if a personal data breach occurs that is likely to result in a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and inform affected individuals where the law requires it.
            </P>

            <H n="11" id="cookies">cookies</H>
            <P>
                See our separate <a href="/cookies" className="text-nomad-pink hover:text-nomad-magenta">cookie notice</a> for the cookies and similar technologies we use, why, and how you can control them.
            </P>

            <H n="12" id="children">children</H>
            <P>
                This website is not directed at children under 16 (under 13 in the UK for some purposes). We do not knowingly collect data from children. If you believe a child has provided us with personal data, please contact us so we can delete it.
            </P>

            <H n="13" id="changes">changes to this notice</H>
            <P>
                We may update this notice as our practices change or as the law develops. The "last updated" date at the top of the page reflects the most recent change. Where changes are material, we will say so prominently.
            </P>

            <div className="mt-24 pt-10 border-t border-nomad-pink/30 font-tech text-[11px] text-nomad-black/50 tracking-[0.04em] lowercase leading-[1.7] space-y-2">
                <p>nomad neuroscience ltd · registered in england and wales · company № 16558472</p>
                <p>71-75 shelton street, covent garden, london, wc2h 9jq</p>
                <p className="pt-2"><a href="/privacy" className="hover:text-nomad-pink">privacy</a> · <a href="/cookies" className="hover:text-nomad-pink">cookies</a></p>
            </div>
        </main>
    </div>
);

createRoot(document.getElementById('root')).render(<Privacy />);
import('./cookie-banner.js').then(m => m.mountCookieBanner());
