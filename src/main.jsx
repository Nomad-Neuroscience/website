import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import './index.css';

/* --- ICONS --- */
const IconWrapper = ({ children, size = 24, color = 'currentColor', className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const Menu = (props) => <IconWrapper {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></IconWrapper>;
const X = (props) => <IconWrapper {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconWrapper>;
const Activity = (props) => <IconWrapper {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></IconWrapper>;
const Brain = (props) => <IconWrapper {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></IconWrapper>;
const HeartPulse = (props) => <IconWrapper {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></IconWrapper>;
const Lock = (props) => <IconWrapper {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></IconWrapper>;

/* --- BUTTON --- */
const Button = ({ children, variant = 'primary', className = '', onClick, href, size = 'default', hoverImage, type, disabled, title, 'aria-disabled': ariaDisabled, 'aria-label': ariaLabel }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle = 'relative rounded-full font-medium tracking-wide transition-all duration-300 overflow-hidden active:scale-[0.98] bg-center bg-cover border border-transparent';
    const sizes = {
        small:   'px-6 py-2.5 text-xs',
        default: 'px-8 py-3.5 text-sm',
        large:   'px-10 py-4 text-base',
    };

    // Primary CTAs keep their pink colour on hover (no overlay texture).
    const defaultTextures = {
        primary:   null,
        secondary: '/assets/images/button_back_2.png',
        outline:   '/assets/images/button_back_2.png',
        dark:      '/assets/images/button_back_3.png',
        ghost:     '/assets/images/button_back_3.png',
    };

    const resolveHover = (img) => (img ? (img.startsWith('/') || img.startsWith('http') ? img : `/assets/images/${img}`) : null);
    const activeTexture = hoverImage !== undefined ? resolveHover(hoverImage) : defaultTextures[variant];

    const variants = {
        primary:   'bg-nomad-pink text-white shadow-lg hover:shadow-xl hover:shadow-nomad-pink/25 hover:bg-nomad-magenta pink-glow-sm',
        secondary: 'bg-white text-nomad-black border-black/10 hover:text-white',
        dark:      'bg-nomad-black text-white hover:bg-nomad-dark',
        outline:   'bg-transparent text-white border-white hover:text-white hover:border-transparent',
        ghost:     'bg-transparent text-nomad-black hover:bg-black/5',
    };

    const styles = isHovered && activeTexture ? {
        backgroundImage: `url('${activeTexture}')`,
        borderColor: 'transparent',
        color: (variant === 'secondary' || variant === 'ghost') ? 'white' : undefined,
    } : {};

    const commonProps = {
        className: `${baseStyle} ${sizes[size]} ${variants[variant]} ${className} inline-flex items-center justify-center gap-2`,
        style: styles,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onClick,
        title,
        'aria-label': ariaLabel,
    };

    if (href) {
        return <a href={href} {...commonProps}>{children}</a>;
    }
    return <button type={type} disabled={disabled} aria-disabled={ariaDisabled} {...commonProps}>{children}</button>;
};

/* --- ANIMATION HELPERS --- */
const FadeIn = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1, rootMargin: '50px' }
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

const useParallax = (speed = 0.5) => {
    const ref = useRef(null);
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let rafId = null;
        let pending = false;
        const update = () => {
            pending = false;
            if (ref.current) {
                ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
            }
        };
        const handleScroll = () => {
            if (!pending) {
                pending = true;
                rafId = requestAnimationFrame(update);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        update();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [speed]);
    return ref;
};

const TextReveal = ({ children, className = '', delay = 0 }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (typeof children !== 'string') {
        return (
            <span ref={containerRef} className={className}>
                <span className="word-mask inline-block w-full">
                    <span className={`word-inner w-full ${isVisible ? 'revealed' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
                        {children}
                    </span>
                </span>
            </span>
        );
    }

    const wordsList = children.split(' ');
    return (
        <span ref={containerRef} className={className}>
            {wordsList.map((word, i) => (
                <span key={i} className="word-mask">
                    <span
                        className={`word-inner ${isVisible ? 'revealed' : ''}`}
                        style={{ transitionDelay: `${delay + i * 80}ms` }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </span>
    );
};

const Magnetic = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia('(pointer: coarse)').matches) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();
            const x = (clientX - (left + width / 2)) * 0.3;
            const y = (clientY - (top + height / 2)) * 0.3;
            setPosition({ x, y });
        };
        const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
            style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        >
            {children}
        </div>
    );
};

const CurvedReveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`curved-mask w-full h-full ${isVisible ? 'revealed' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

/* --- MARQUEE --- */
const MarqueeText = ({ text }) => (
    <div className="marquee-track w-full overflow-hidden bg-nomad-cream py-10 border-t border-b border-nomad-black/5 fade-mask" aria-hidden="true">
        <div className="whitespace-nowrap flex w-[200%] animate-marquee">
            <span className="text-[12vw] font-display font-light uppercase tracking-widest text-nomad-black/10 mx-8">{text}</span>
            <span className="text-[12vw] font-display font-light uppercase tracking-widest text-nomad-black/10 mx-8">{text}</span>
            <span className="text-[12vw] font-display font-light uppercase tracking-widest text-nomad-black/10 mx-8">{text}</span>
            <span className="text-[12vw] font-display font-light uppercase tracking-widest text-nomad-black/10 mx-8">{text}</span>
        </div>
    </div>
);

const PartnerLogos = () => {
    const partners = [
        'University College London (UCL)',
        'Royal Holloway, University of London',
        'University of San Diego',
        'Queen Mary University of London',
    ];

    const PartnerTrack = ({ className = '' }) => (
        <div className={`flex items-center gap-10 md:gap-20 pr-10 md:pr-20 ${className}`}>
            {partners.map((partner, i) => (
                <div key={i} className="inline-flex items-center gap-10 md:gap-20">
                    <span className="text-xl md:text-2xl font-display font-medium tracking-tighter text-nomad-black/40 hover:text-nomad-black/80 transition-all duration-500 whitespace-nowrap cursor-default">
                        {partner}
                    </span>
                    <span className="text-nomad-pink/20 text-2xl md:text-4xl font-light">·</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full overflow-hidden bg-nomad-cream py-32 border-t border-nomad-black/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 mb-16 text-center">
                <FadeIn>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-6 block">Research partnerships</span>
                    <h2 className="text-4xl md:text-5xl font-light text-nomad-black mb-10 max-w-4xl mx-auto leading-tight italic">
                        Built in collaboration with people who've <i>spent careers</i> on this problem.
                    </h2>
                    <div className="text-nomad-black/60 text-lg md:text-xl max-w-3xl mx-auto space-y-6 leading-relaxed mb-12">
                        <p>Nomad's clinical and scientific development is conducted alongside researchers at UCL, Royal Holloway, Queen Mary University of London, and the University of San Diego — institutions with deep expertise in autonomic neuroscience, bioelectronics, and wearable systems.</p>
                        <p>We don't cite partnerships to impress you. We cite them because we are legally and scientifically accountable to the <i>rigour</i> they demand — and that accountability is the only reason you should trust anything we tell you about this technology.</p>
                        <p className="font-medium text-nomad-black italic">Science doesn't happen alone. And it shouldn't.</p>
                    </div>
                </FadeIn>
            </div>
            <div className="marquee-track relative flex" aria-hidden="true">
                <div className="whitespace-nowrap flex animate-slow-marquee w-max">
                    <PartnerTrack />
                    <PartnerTrack />
                    <PartnerTrack />
                    <PartnerTrack />
                </div>
            </div>
        </div>
    );
};

/* --- LOGIN MODAL --- */
const LoginModal = ({ isOpen, onClose }) => {
    const panelRef = useRef(null);
    const previousFocus = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            previousFocus.current = document.activeElement;
            setTimeout(() => panelRef.current?.focus(), 0);
        } else if (previousFocus.current && typeof previousFocus.current.focus === 'function') {
            previousFocus.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-nomad-black/60 backdrop-blur-xl" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
                className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md relative border border-nomad-pink/10 focus:outline-none"
            >
                <button onClick={onClose} aria-label="Close dialog" className="absolute top-6 right-6 text-nomad-black/40 hover:text-nomad-pink transition-colors"><X size={24} /></button>
                <h3 id="login-modal-title" className="text-3xl font-black mb-2 text-nomad-black">Investor Portal</h3>
                <p className="text-nomad-black/50 mb-6 text-sm">Access by invitation only.</p>
                <p className="text-nomad-black/70 mb-8 text-sm leading-relaxed">
                    If you've been invited to the Nomad investor portal, your access details were sent to you directly. For any questions, contact us below.
                </p>
                <Button
                    href="mailto:hello@nomadneuro.com"
                    variant="primary"
                    className="w-full !rounded-xl !py-4 font-bold"
                >
                    Email hello@nomadneuro.com
                </Button>
            </div>
        </div>
    );
};

/* --- WAITLIST MODAL --- */
const WaitlistModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const panelRef = useRef(null);
    const previousFocus = useRef(null);

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const roles = [
        {
            id: 'patient',
            label: 'I live with this',
            sub: 'Patient or carer',
            detail: 'Autonomic dysfunction, dysautonomia, POTS, long COVID — anyone whose nervous system is the problem.',
            note: 'You are why this exists. We will write to you first as the clinical investigation opens.',
        },
        {
            id: 'clinician',
            label: 'I treat or research this',
            sub: 'Clinician or researcher',
            detail: 'Cardiology, neurology, autonomic medicine, bioelectronics, signal processing, wearable engineering.',
            note: 'We share clinical and scientific updates as the data matures. Collaboration is welcome.',
        },
        {
            id: 'investor',
            label: 'I invest in deep-tech health',
            sub: 'Potential investor',
            detail: 'Funds, family offices, angels, syndicates investing in regulated medical hardware and platform companies.',
            note: 'We will share the next round of materials with you when they are ready.',
        },
        {
            id: 'government',
            label: 'I work in health policy',
            sub: 'Government or health system',
            detail: 'NHS, NICE, MHRA, public health, payers, commissioners, ministerial advisers.',
            note: 'We will share regulatory and health-system briefings as the pathway matures.',
        },
    ];

    const selectedRole = roles.find((r) => r.id === userType);

    const resetState = () => {
        setStep(1);
        setSuccess(false);
        setError('');
        setFullName('');
        setEmail('');
        setUserType('');
        setEmailTouched(false);
        setNameTouched(false);
        setIsLoading(false);
    };

    const handleClose = () => {
        if (isLoading) return;
        onClose();
        // delay reset so the user doesn't see content disappear during the close animation
        setTimeout(resetState, 250);
    };

    // Body scroll lock + focus management
    useEffect(() => {
        if (isOpen) {
            previousFocus.current = document.activeElement;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            setTimeout(() => panelRef.current?.focus(), 50);
            return () => { document.body.style.overflow = previousOverflow; };
        } else if (previousFocus.current && typeof previousFocus.current.focus === 'function') {
            previousFocus.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const valid = fullName.trim().length > 0 && validateEmail(email) && userType.length > 0;
        if (!valid) {
            setError('Please complete all fields correctly before submitting.');
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('form-name', 'waitlist');
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('userType', userType);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });
            if (response.ok) {
                setStep(3);
                setSuccess(true);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalSteps = 3;
    const stepNumber = (n) => String(n).padStart(2, '0');

    // Heroline shifts per step — left pane copy
    const heroForStep = {
        1: { eyebrow: "Step 01 / 03",  line: <>We start with <i>you</i>.</>,           sub: 'There is no neutral patient. Tell us where you stand.' },
        2: { eyebrow: "Step 02 / 03",  line: <>What should we <i>call you</i>.</>,     sub: 'Your name and an email we can reach you on.' },
        3: { eyebrow: "Welcome",       line: <>You&rsquo;re <i>in</i>.</>,             sub: selectedRole?.note || "We'll be in touch as Nomad develops." },
    };
    const hero = heroForStep[step];

    const nameValid = fullName.trim().length >= 2;
    const emailValid = validateEmail(email);
    const canSubmitStep2 = nameValid && emailValid;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 bg-nomad-black/70 backdrop-blur-xl"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) handleClose(); }}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="waitlist-modal-title"
                className="relative w-full sm:max-w-[1040px] h-full sm:h-auto sm:max-h-[92vh] bg-nomad-cream sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] focus:outline-none animate-fade-in"
            >
                {/* Close button — global */}
                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    aria-label="Close dialog"
                    className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-nomad-black/5 text-nomad-black/60 hover:text-nomad-pink hover:bg-white transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <X size={18} />
                </button>

                {/* LEFT PANE — brand / story */}
                <aside className="relative bg-nomad-pink text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between min-h-[220px] md:min-h-[640px] overflow-hidden">
                    {/* Decorative pink texture */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: "url('/assets/images/button_back_2.png')" }}
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-nomad-pink via-nomad-pink to-nomad-magenta opacity-90 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="font-serif italic text-lg text-white mt-[-2px] select-none">n</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">Nomad · Waitlist</span>
                    </div>

                    <div className="relative z-10 my-10 md:my-0">
                        <p key={`eyebrow-${step}`} className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 mb-6 animate-fade-in">{hero.eyebrow}</p>
                        <h2
                            id="waitlist-modal-title"
                            key={`hero-${step}`}
                            className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.02] tracking-tight text-white animate-fade-in"
                        >
                            {hero.line}
                        </h2>
                        <p key={`sub-${step}`} className="mt-6 text-base md:text-lg font-light leading-relaxed text-white/85 max-w-[360px] animate-fade-in">
                            {hero.sub}
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2" aria-hidden="true">
                            {[1, 2, 3].map((n) => (
                                <span
                                    key={n}
                                    className={`h-[2px] transition-all duration-500 rounded-full ${
                                        step === n ? 'w-10 bg-white' : step > n ? 'w-6 bg-white/80' : 'w-6 bg-white/25'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">{stepNumber(step)} / {stepNumber(totalSteps)}</p>
                    </div>
                </aside>

                {/* RIGHT PANE — form */}
                <section className="relative flex flex-col bg-nomad-cream p-6 sm:p-10 md:p-14 overflow-y-auto">
                    <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} noValidate className="flex-1 flex flex-col">
                        <input type="hidden" name="form-name" value="waitlist" />

                        {/* STEP 1 — role */}
                        {step === 1 && (
                            <div key="step1" className="flex-1 flex flex-col animate-fade-in">
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-4">Who are you</p>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-nomad-black leading-snug mb-2">
                                    Pick the line that <i>fits you best</i>.
                                </h3>
                                <p className="text-sm text-nomad-black/55 mb-8">You can only choose one. We will write to you accordingly.</p>

                                <fieldset className="space-y-3 flex-1">
                                    <legend className="sr-only">Choose the role that best describes you</legend>
                                    {roles.map((r) => {
                                        const isActive = userType === r.id;
                                        return (
                                            <label
                                                key={r.id}
                                                htmlFor={`role-${r.id}`}
                                                className={`group block rounded-2xl border cursor-pointer transition-all ${isActive ? 'border-nomad-pink bg-white shadow-sm' : 'border-nomad-black/10 bg-white/60 hover:border-nomad-black/30 hover:bg-white'}`}
                                            >
                                                <div className="flex items-start gap-4 p-4 sm:p-5">
                                                    <input
                                                        id={`role-${r.id}`}
                                                        type="radio"
                                                        name="userType"
                                                        value={r.id}
                                                        checked={isActive}
                                                        onChange={(e) => setUserType(e.target.value)}
                                                        className="sr-only peer"
                                                        required
                                                    />
                                                    <span aria-hidden="true" className={`mt-1 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${isActive ? 'border-nomad-pink' : 'border-nomad-black/20 group-hover:border-nomad-black/50'}`}>
                                                        <span className={`w-2 h-2 rounded-full transition-transform ${isActive ? 'bg-nomad-pink scale-100' : 'bg-transparent scale-0'}`} />
                                                    </span>
                                                    <span className="flex-1 min-w-0">
                                                        <span className="flex items-baseline justify-between gap-3 mb-1">
                                                            <span className={`text-base sm:text-lg font-medium leading-snug ${isActive ? 'text-nomad-black' : 'text-nomad-black/85'}`}>{r.label}</span>
                                                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-black/30 whitespace-nowrap">{r.sub}</span>
                                                        </span>
                                                        <span className="block text-[13px] text-nomad-black/55 leading-relaxed">{r.detail}</span>
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </fieldset>

                                <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-nomad-black/10">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="text-[11px] uppercase tracking-[0.25em] font-bold text-nomad-black/40 hover:text-nomad-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => userType && setStep(2)}
                                        disabled={!userType}
                                        className="bg-nomad-black text-white rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-pink transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                    >
                                        <span>Continue</span>
                                        <svg className="w-4 h-4 transition-transform group-enabled:group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 — name + email */}
                        {step === 2 && (
                            <div key="step2" className="flex-1 flex flex-col animate-fade-in">
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-4">Your details</p>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-nomad-black leading-snug mb-2">
                                    A name and an email. <i>That&rsquo;s it.</i>
                                </h3>
                                <p className="text-sm text-nomad-black/55 mb-10">No tracking, no marketing list trades, no spam. Unsubscribe at any time.</p>

                                <div className="space-y-8 flex-1">
                                    <div className="space-y-1.5">
                                        <label htmlFor="waitlist-fullname" className="text-[10px] uppercase tracking-[0.3em] font-bold text-nomad-black/40 block">What should we call you</label>
                                        <input
                                            id="waitlist-fullname"
                                            type="text"
                                            name="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            onBlur={() => setNameTouched(true)}
                                            required
                                            autoComplete="name"
                                            placeholder="Your full name"
                                            className="w-full bg-transparent border-0 border-b border-nomad-black/15 px-0 py-3 text-lg sm:text-xl text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/20"
                                            aria-invalid={nameTouched && !nameValid}
                                        />
                                        <div className="h-4">
                                            {nameTouched && !nameValid && <p className="text-[11px] text-nomad-pink">Please enter your name.</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="waitlist-email" className="text-[10px] uppercase tracking-[0.3em] font-bold text-nomad-black/40 block">Where can we reach you</label>
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => setEmailTouched(true)}
                                            required
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-transparent border-0 border-b border-nomad-black/15 px-0 py-3 text-lg sm:text-xl text-nomad-black focus:outline-none focus:border-nomad-pink transition-colors font-light placeholder:text-nomad-black/20"
                                            aria-invalid={emailTouched && !emailValid}
                                        />
                                        <div className="h-4">
                                            {emailTouched && !emailValid && <p className="text-[11px] text-nomad-pink">Please enter a valid email address.</p>}
                                        </div>
                                    </div>

                                    {selectedRole && (
                                        <div className="rounded-2xl bg-white/70 border border-nomad-black/5 p-4 flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-black/40 mb-1">Joining as</p>
                                                <p className="text-sm font-medium text-nomad-black truncate">{selectedRole.label} · <span className="text-nomad-black/60">{selectedRole.sub}</span></p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-[10px] uppercase tracking-[0.25em] font-bold text-nomad-pink hover:opacity-70 transition-opacity"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {error && <p className="mt-4 text-sm text-nomad-pink font-medium" role="alert">{error}</p>}

                                <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-nomad-black/10">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                        className="text-[11px] uppercase tracking-[0.25em] font-bold text-nomad-black/50 hover:text-nomad-black transition-colors inline-flex items-center gap-2 disabled:opacity-40"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
                                        <span>Back</span>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !canSubmitStep2}
                                        aria-disabled={isLoading || !canSubmitStep2}
                                        className="bg-nomad-black text-white rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-pink transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group min-w-[180px]"
                                    >
                                        {isLoading ? (
                                            <span aria-hidden="true" className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Join the waitlist</span>
                                                <svg className="w-4 h-4 transition-transform group-enabled:group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="mt-6 text-[11px] text-nomad-black/45 leading-relaxed">
                                    By joining you agree to our <a href="/privacy" className="underline hover:text-nomad-pink">Privacy Policy</a>. We process your details to send you Nomad updates only. Unsubscribe anytime.
                                </p>
                            </div>
                        )}

                        {/* STEP 3 — success */}
                        {step === 3 && success && (
                            <div key="step3" className="flex-1 flex flex-col items-start animate-fade-in">
                                <div className="w-16 h-16 rounded-full border border-nomad-pink/30 flex items-center justify-center mb-8 relative">
                                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-nomad-pink/10 animate-pulse-soft" />
                                    <svg className="w-7 h-7 text-nomad-pink relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-pink mb-4">Confirmed</p>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-nomad-black leading-[1.05] mb-6">
                                    Thank you, <i>{fullName.trim().split(' ')[0] || 'friend'}</i>.
                                </h3>
                                <p className="text-base sm:text-lg font-light text-nomad-black/70 leading-relaxed max-w-[480px] mb-2">
                                    You&rsquo;re on the list. We&rsquo;ll write to <span className="text-nomad-black">{email}</span> when there&rsquo;s something real to share — and not before.
                                </p>
                                {selectedRole && (
                                    <p className="text-[14px] font-light italic text-nomad-black/55 leading-relaxed max-w-[480px] mt-4 pt-4 border-t border-nomad-black/10">
                                        {selectedRole.note}
                                    </p>
                                )}

                                <div className="mt-auto pt-10 w-full flex flex-col sm:flex-row gap-3 items-stretch">
                                    <a
                                        href="https://www.linkedin.com/company/nomadneuro/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center bg-white border border-nomad-black/10 text-nomad-black rounded-full py-4 px-6 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-black hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <span>Follow on LinkedIn</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 bg-nomad-black text-white rounded-full py-4 px-6 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-nomad-pink transition-all active:scale-[0.99] flex items-center justify-center gap-3"
                                    >
                                        <span>Return to nomad</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
};

/* --- NAVBAR --- */
const Navbar = ({ onWaitlistClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const darkSections = Array.from(document.querySelectorAll('[data-theme="dark"]'));
        if (!darkSections.length) return;
        const visible = new Set();
        const navbarHeight = 96;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            setIsDark(visible.size > 0);
        }, {
            rootMargin: `0px 0px -${Math.max(0, window.innerHeight - navbarHeight)}px 0px`,
            threshold: 0,
        });
        darkSections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className="navbar-container fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 select-none">
                <div className="flex items-center gap-2.5 w-full max-w-[800px]">
                    {/* Logo */}
                    <Magnetic>
                        <a
                            href="/"
                            className={`group flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all duration-500 hover:bg-[url('/assets/images/button_back_2.png')] bg-cover bg-center ${isDark ? 'bg-white/10' : 'bg-white/53'}`}
                        >
                            <span className={`font-serif italic text-2xl md:text-3xl mt-[-2px] transition-colors duration-500 ${isDark ? 'text-white' : 'text-nomad-pink group-hover:text-white'}`}>n</span>
                        </a>
                    </Magnetic>

                    {/* Nav Pill */}
                    <nav className={`flex-1 h-14 md:h-16 rounded-[22px] md:rounded-[26px] backdrop-blur-md flex items-center justify-between px-6 md:px-10 transition-all duration-500 ${isDark ? 'bg-white/10' : 'bg-white/53'}`}>
                        <div className={`hidden md:flex flex-1 items-center justify-around gap-8 text-[14px] font-medium transition-colors duration-500 ${isDark ? 'text-white' : 'text-black/80'}`}>
                            <a href="#platform" className="hover:text-nomad-pink transition-colors">Platform</a>
                            <a href="#technology" className="hover:text-nomad-pink transition-colors">Technology</a>
                            <a href="#team" className="hover:text-nomad-pink transition-colors">Team</a>
                            <div className="w-px h-4 bg-black/10 mx-2"></div>
                            <a href="/signin" className="hover:text-nomad-pink transition-colors">Investor Portal</a>
                        </div>
                        <button
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 ml-4 ${isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </nav>
                </div>

                {/* Secondary Sub-Pill */}
                <div className="hidden md:flex items-center justify-center">
                    <button
                        onClick={onWaitlistClick}
                        className={`h-10 px-6 rounded-full backdrop-blur-md flex items-center gap-3 text-[13px] transition-all duration-500 group border border-black/5 ${isDark ? 'bg-white/10 text-white/60 hover:text-white' : 'bg-white/53 text-black/40 hover:text-black'}`}
                    >
                        <span className="font-light">Join the waitlist for every update</span>
                        <div className="w-5 h-5 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
                aria-hidden={!mobileMenuOpen}
                className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-xl pt-32 px-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="flex flex-col text-nomad-black pb-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-black/40 mb-4">Main</p>
                    <div className="flex flex-col gap-5 text-4xl font-light mb-10">
                        <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="border-b border-black/5 pb-3">Platform</a>
                        <a href="#technology" onClick={() => setMobileMenuOpen(false)} className="border-b border-black/5 pb-3">Technology</a>
                        <a href="#team" onClick={() => setMobileMenuOpen(false)} className="border-b border-black/5 pb-3">Team</a>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-black/40 mb-4">More</p>
                    <div className="flex flex-col gap-3">
                        <a href="/careers" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-nomad-black/60 hover:text-nomad-pink transition-colors">Careers</a>
                        <a href="/signin" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-nomad-black/60 hover:text-nomad-pink transition-colors">Investor Portal</a>
                        <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-nomad-black/60 hover:text-nomad-pink transition-colors">Home</a>
                    </div>
                    <button
                        onClick={() => { onWaitlistClick(); setMobileMenuOpen(false); }}
                        className="mt-10 py-5 bg-nomad-black text-white text-xl font-bold rounded-2xl uppercase tracking-widest"
                    >
                        Join Waitlist
                    </button>
                </div>
            </div>
        </>
    );
};

/* --- HERO --- */
const Hero = () => {
    const bpPathRef = useRef(null);
    const bpSysRef = useRef(null);
    const bpDiaRef = useRef(null);

    useEffect(() => {
        const path = bpPathRef.current;
        const sysEl = bpSysRef.current;
        const diaEl = bpDiaRef.current;
        if (!path) return;

        let W = 200, t = 0, lastBeat = 0, hr = 64, sys = 118, dia = 76, idx = 0;
        let rafId;

        const pulse = (p) => {
            const mid = 15;
            if (p < .05) return mid + (p / .05) * 8;
            if (p < .12) return mid + 8 - ((p - .05) / .07) * 22;
            if (p < .22) return mid - 14 + ((p - .12) / .10) * 16;
            if (p < .30) return mid + 2 - ((p - .22) / .08) * 4;
            if (p < .42) return mid - 2 + ((p - .30) / .12) * 4;
            return mid + 2 - ((p - .42) / .58) * 2;
        };

        const tick = () => {
            t += 1.2;
            const period = (60000 / hr) / 16;
            if (t - lastBeat > period) {
                lastBeat = t; idx++;
                sys = 118 + Math.round(Math.sin(idx * 0.15) * 3);
                dia = 76 + Math.round(Math.cos(idx * 0.12) * 2);
                hr = 64 + Math.round(Math.sin(idx * 0.08) * 4);
                if (sysEl) sysEl.textContent = sys;
                if (diaEl) diaEl.textContent = dia;
            }
            let d = '';
            for (let x = 0; x <= W; x += 2) {
                const raw = (t - W + x) % period;
                const p = raw < 0 ? (raw + period) / period : raw / period;
                d += (x === 0 ? 'M' : 'L') + x + ' ' + pulse(p).toFixed(1);
            }
            path.setAttribute('d', d);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <>
            <style>{`
                @keyframes veri-orb-breathe {
                    0%, 100% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.04); filter: brightness(1.12); }
                }
                @keyframes veri-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .35; }
                }
                .veri-hero-grid {
                    display: grid;
                    grid-template-columns: 1.1fr .9fr;
                    gap: 64px;
                    align-items: center;
                    min-height: calc(100vh - 220px);
                }
                .veri-feat-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-top: 48px;
                    max-width: 680px;
                }
                @media (max-width: 1024px) {
                    .veri-hero-grid { grid-template-columns: 1fr; }
                    .veri-feat-grid { grid-template-columns: 1fr; }
                    .veri-phone-col { display: none; }
                }
            `}</style>
            <div
                id="hero"
                data-theme="dark"
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    padding: '140px 0 80px',
                    overflow: 'hidden',
                    background: 'radial-gradient(60% 50% at 75% 35%, rgba(233,74,156,.18), transparent 65%), radial-gradient(80% 60% at 12% 90%, rgba(233,74,156,.08), transparent 60%), #070707',
                    color: '#F4F2EA',
                    fontFamily: '"PP Neue Montreal", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    WebkitFontSmoothing: 'antialiased',
                }}
            >
                <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
                    <div className="veri-hero-grid">

                        {/* LEFT — copy */}
                        <div>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '8px 14px', border: '1px solid rgba(255,255,255,.18)',
                                borderRadius: 999, fontSize: 11, letterSpacing: '.18em',
                                textTransform: 'uppercase', color: 'rgba(244,242,234,.55)',
                            }}>
                                <span style={{
                                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                                    background: '#E94A9C', boxShadow: '0 0 10px #E94A9C',
                                    display: 'inline-block', animation: 'veri-blink 2s infinite',
                                }} />
                                Currently in clinical investigation
                            </span>

                            <h1 style={{
                                fontSize: 'clamp(48px, 8vw, 120px)',
                                margin: '24px 0 0',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                lineHeight: .92,
                                textTransform: 'uppercase',
                                color: '#F4F2EA',
                            }}>
                                Our brain<br />
                                and body are<br />
                                programmable.<br />
                                <span style={{
                                    color: 'rgba(244,242,234,.35)',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    textTransform: 'none',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Newsreader, Georgia, serif',
                                }}>
                                    Let nomad be the interface.
                                </span>
                            </h1>

                            <div className="veri-feat-grid">
                                {[
                                    'There is a system running inside you right now. It controls your heartbeat without being asked. It decides when you\'re in danger. It tells your gut to move, your pupils to dilate, your blood pressure to hold. It has been doing this since before you were born, beneath every thought you\'ve ever had.',
                                    'For most people, it hums along unnoticed. For 376 million, it doesn\'t.',
                                    'Nomad was built for them.',
                                ].map((text, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <span style={{ color: '#E94A9C', fontSize: 14, lineHeight: 1, fontFamily: 'ui-monospace, monospace', flexShrink: 0, marginTop: 2 }}>+</span>
                                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(244,242,234,.55)' }}>{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — phone mockup */}
                        <div className="veri-phone-col" style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                            <div style={{
                                position: 'relative', width: 320, height: 660, borderRadius: 54,
                                background: 'linear-gradient(160deg, #1a1a1a, #0a0a0a)',
                                border: '1px solid rgba(255,255,255,.08)',
                                boxShadow: '0 60px 120px rgba(0,0,0,.6), inset 0 0 0 8px #050505, inset 0 0 0 9px rgba(255,255,255,.04)',
                                transform: 'rotate(-6deg)',
                                overflow: 'hidden',
                            }}>
                                {/* Dynamic island */}
                                <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 110, height: 30, borderRadius: 18, background: '#000', zIndex: 5 }} />

                                {/* Screen */}
                                <div style={{ position: 'absolute', inset: 8, borderRadius: 46, overflow: 'hidden', background: '#0b0b0b' }}>
                                    {/* Pink orb */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'radial-gradient(70% 60% at 50% 50%, #F26AB0 0%, #E94A9C 32%, #7A1948 65%, #1a060f 92%)',
                                        animation: 'veri-orb-breathe 6s ease-in-out infinite',
                                    }} />
                                    {/* Film grain */}
                                    <div style={{
                                        position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: .7,
                                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                                    }} />

                                    {/* Live status row */}
                                    <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#F4F2EA', fontSize: 15, fontWeight: 500, zIndex: 3 }}>
                                        <span>● Live</span>
                                        <div style={{ width: 50, height: 28, borderRadius: 999, background: 'rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.25)', position: 'relative', display: 'flex', alignItems: 'center', padding: 3 }}>
                                            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', color: '#F4F2EA' }}>On</span>
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F4F2EA', marginLeft: 'auto' }} />
                                        </div>
                                    </div>

                                    {/* Closed-loop rings */}
                                    <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', width: '62%', aspectRatio: '1', zIndex: 2 }}>
                                        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                            <defs>
                                                <linearGradient id="loopGradHero" x1="0" x2="1" y1="0" y2="1">
                                                    <stop offset="0" stopColor="#fff" stopOpacity=".95" />
                                                    <stop offset="1" stopColor="#fff" stopOpacity=".4" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
                                            <circle cx="100" cy="100" r="86" fill="none" stroke="url(#loopGradHero)" strokeWidth="1.5" strokeDasharray="540" strokeDashoffset="270" pathLength="540" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,.6))' }}>
                                                <animate attributeName="stroke-dashoffset" from="540" to="0" dur="3.2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
                                            <circle cx="100" cy="100" r="64" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="80 320" pathLength="400" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px #fff)' }}>
                                                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="-360 100 100" dur="4.5s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="100" cy="100" r="44" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="2 4" />
                                            <g fontFamily="ui-monospace,monospace" fontSize="6.5" letterSpacing="1.5" fill="rgba(255,255,255,.85)">
                                                <text x="100" y="9" textAnchor="middle">SENSE</text>
                                                <text x="195" y="103" textAnchor="end">DECODE</text>
                                                <text x="100" y="200" textAnchor="middle">RESPOND</text>
                                                <text x="5" y="103">CALIBRATE</text>
                                            </g>
                                            <circle r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #fff)' }}>
                                                <animateMotion dur="3.2s" repeatCount="indefinite" path="M 100 14 A 86 86 0 1 1 99.99 14 Z" />
                                            </circle>
                                        </svg>
                                    </div>

                                    {/* Live BP readout */}
                                    <div style={{ position: 'absolute', top: '62%', left: 0, right: 0, textAlign: 'center', color: '#fff', zIndex: 3, padding: '0 28px' }}>
                                        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', opacity: .7 }}>Blood Pressure</div>
                                        <div style={{ fontWeight: 700, fontSize: 50, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
                                            <span ref={bpSysRef}>118</span>
                                            <span style={{ color: 'rgba(255,255,255,.5)', fontWeight: 300, margin: '0 4px' }}>/</span>
                                            <span ref={bpDiaRef}>76</span>
                                        </div>
                                        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65, marginTop: 6 }}>mmHg · beat-by-beat</div>
                                        <svg style={{ width: '100%', height: 28, marginTop: 10, display: 'block' }} viewBox="0 0 200 30" preserveAspectRatio="none">
                                            <path ref={bpPathRef} d="" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,.6))' }} />
                                        </svg>
                                    </div>

                                    {/* Active pill */}
                                    <div style={{
                                        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 16px 10px 20px',
                                        background: 'rgba(0,0,0,.45)', border: '1px solid rgba(255,255,255,.18)',
                                        borderRadius: 999, color: '#F4F2EA', fontSize: 13,
                                        backdropFilter: 'blur(6px)', whiteSpace: 'nowrap', zIndex: 4,
                                    }}>
                                        Closed-loop active
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E94A9C', boxShadow: '0 0 8px #E94A9C', display: 'inline-block', animation: 'veri-blink 1.6s infinite' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Caption */}
                            <div style={{ position: 'absolute', bottom: -20, right: -10, fontSize: 11, color: 'rgba(244,242,234,.4)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'ui-monospace, monospace' }}>
                                <span style={{ width: 32, height: 1, background: 'rgba(255,255,255,.15)', display: 'inline-block' }} />
                                In clinical investigation
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

/* --- ANIMATED COUNTER --- */
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 1200, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasRunRef = useRef(false);

    useEffect(() => {
        let timer;
        let delayTimer;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRunRef.current) {
                    hasRunRef.current = true;
                    delayTimer = setTimeout(() => {
                        let start = 0;
                        const increment = end / (duration / 16);
                        timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                setCount(end);
                                clearInterval(timer);
                            } else {
                                setCount(Math.floor(start));
                            }
                        }, 16);
                    }, delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            clearTimeout(delayTimer);
            clearInterval(timer);
            observer.disconnect();
        };
    }, [end, duration, delay]);

    return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

/* --- SECTIONS --- */
const OverviewBlock = () => (
    <section id="platform" className="bg-nomad-cream pt-0 pb-32 md:pt-0 md:pb-48 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto border-t border-nomad-black/10 pt-10">
            <div className="flex justify-end items-start mb-16">
                <span className="text-nomad-black/60 uppercase tracking-[0.1em] text-sm font-medium">Breakthrough</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-nomad-black leading-[1.1] max-w-4xl tracking-tight mb-12">
                <TextReveal>The first device that <i>listens back.</i></TextReveal>
            </h2>
            <div className="max-w-2xl text-xl md:text-2xl font-light text-nomad-black/60 leading-relaxed">
                <FadeIn delay={400}>
                    <p className="mb-6">Every wearable on the market monitors you. They collect. They log. They notify. Then they stop.</p>
                    <p className="mb-6">Nomad doesn't stop. It is designed to sense autonomic shifts — in real time, below the threshold of conscious awareness — and respond within milliseconds. Non-invasively. Without breaking the skin.</p>
                    <p>This is closed-loop neuromodulation. And until now, it required surgery. <span className="text-nomad-black font-medium italic">We changed that.</span></p>
                </FadeIn>
            </div>
        </div>
    </section>
);

const MissionGrid = () => (
    <section className="bg-nomad-cream pb-32 md:pb-48 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16 border-t border-nomad-black/10 py-16">
                <div className="md:col-span-1">
                    <span className="text-nomad-black tracking-tight font-medium text-lg">At <i>Nomad</i></span><br />
                    <span className="text-nomad-black/60">We build what medicine hasn't</span>
                </div>
                <div className="md:col-span-1 border-l md:border-nomad-black/10 pl-0 md:pl-8 mt-8 md:mt-0 pt-8 md:pt-0">
                    <span className="text-nomad-black/40 uppercase tracking-widest text-xs font-bold font-mono">0.1</span><br />
                    <span className="text-nomad-black mt-2 inline-block font-medium">Our Mission</span><br />
                    <span className="text-nomad-black/60 mt-1 inline-block leading-relaxed pr-4">
                        There are 376 million people whose own nervous systems are working against them. Their hearts spike when they stand. Their blood pressure drops without warning. They wake up exhausted. They've been told it's anxiety, told to manage their symptoms, told there's nothing targeted for that.<br /><br />
                        Nomad exists because that answer was not good enough.
                    </span>
                </div>
                <div className="md:col-span-1 border-l md:border-nomad-black/10 pl-0 md:pl-8 mt-8 md:mt-0 pt-8 md:pt-0">
                    <span className="text-nomad-black/40 uppercase tracking-widest text-xs font-bold font-mono">0.2</span><br />
                    <span className="text-nomad-black mt-2 inline-block font-medium">Our Vision</span><br />
                    <span className="text-nomad-black/60 mt-1 inline-block leading-relaxed pr-4">
                        A world where the 376 million people told "there's nothing we can do" have something that does something. Every day. Without surgery. Without side effects. Without asking.<br /><br />
                        <i>Worn like a watch. Designed to work like medicine.</i>
                    </span>
                </div>
                <div className="md:col-span-1 border-l md:border-nomad-black/10 pl-0 md:pl-8 mt-8 md:mt-0 pt-8 md:pt-0">
                    <span className="text-nomad-black/40 uppercase tracking-widest text-xs font-bold font-mono">0.3</span><br />
                    <span className="text-nomad-black mt-2 inline-block font-medium">Our Ambition</span><br />
                    <span className="text-nomad-black/60 mt-1 inline-block leading-relaxed pr-4">
                        To make the most sophisticated autonomic intervention in clinical history something anyone can wear — anywhere, without a surgeon, a hospital, or a waiting list.
                    </span>
                </div>
            </div>

            <div className="border-t border-nomad-black/10 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <span className="text-nomad-black/60 uppercase tracking-[0.1em] text-sm font-medium">Industries</span><br />
                        <span className="text-nomad-black mt-1 inline-block">Healthcare & Neural technologies</span><br /><br />
                        <span className="text-nomad-black/60 uppercase tracking-[0.1em] text-sm font-medium">Core Business</span><br />
                        <span className="text-nomad-black mt-1 inline-block">Wearable Neuromodulation</span><br /><br />
                        <span className="text-nomad-black/60 uppercase tracking-[0.1em] text-sm font-medium">Domain</span><br />
                        <span className="text-nomad-black mt-1 inline-block">nomadneuro.com</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FutureWearable = () => (
    <section data-theme="dark" className="bg-nomad-black text-white py-32 md:py-48 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                <div>
                    <span className="text-nomad-pink tracking-widest text-xs uppercase font-medium">Our Approach</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mt-6 tracking-tight">Where the future is <i>wearable</i></h2>
                </div>
                <div>
                    <FadeIn>
                        <p className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-16">
                            Nomad is designed to bring closed-loop intervention from the hospital bedside to the human wrist. The system is engineered to sense autonomic shifts below the threshold of awareness and respond within milliseconds — combining the precision of clinical neurophysiology with the simplicity of a wearable.
                        </p>
                        <div className="border-t border-white/20 pt-8 flex gap-4">
                            <span className="text-nomad-pink text-2xl leading-none">*</span>
                            <p className="text-white/60">Moving the science closer to the surface.</p>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 mt-32 pt-32 border-t border-white/10">
                <div>
                    <span className="text-nomad-pink tracking-widest text-xs uppercase font-medium">Our Aim</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mt-6 mb-12 tracking-tight">The future lies in <i>our hands</i></h2>
                    <Magnetic>
                        <Button href="#technology" variant="outline" size="small" className="text-nomad-pink border-nomad-pink">Go to Programs</Button>
                    </Magnetic>
                </div>
                <div>
                    <FadeIn>
                        <p className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-8">
                            Stability shouldn't be a luxury of the clinic. We engineer for the chaos of real life, building sensors and algorithms that resolve clinical-grade signals in noisy, everyday environments.
                        </p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-16">
                            We don't just build for "wearability" — we build for the 376 million people who need their nervous systems to work as reliably as the devices they carry.
                        </p>
                        <div className="border-t border-white/20 pt-8 flex gap-4">
                            <span className="text-nomad-pink text-2xl leading-none">*</span>
                            <p className="text-white/60">Engineering for agency, not just observation.</p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    </section>
);

const CardiacVis = () => {
    const pathRef  = useRef(null);
    const sbiRef   = useRef(null);
    const brsRef   = useRef(null);
    const hrvRef   = useRef(null);
    const pwvRef   = useRef(null);

    useEffect(() => {
        const W = 280, H = 60, mid = 36;
        let t = 0, lastBeat = 0, hr = 64, rafId;

        function ecg(phase) {
            if (phase < .12) return mid - Math.sin(phase / .12 * Math.PI) * 4;
            if (phase < .18) return mid;
            if (phase < .20) return mid + 4;
            if (phase < .23) return mid - 26;
            if (phase < .27) return mid + 10;
            if (phase < .35) return mid;
            if (phase < .55) return mid - Math.sin((phase - .35) / .20 * Math.PI) * 6;
            return mid;
        }

        function tick() {
            t += 1.4;
            const period = (60000 / hr) / 16;
            if (t - lastBeat > period) {
                lastBeat = t;
                const n = Math.sin(t * 0.001);
                if (sbiRef.current) sbiRef.current.textContent = (0.87 + n * 0.02 + (Math.random() - .5) * 0.01).toFixed(2);
                if (brsRef.current) brsRef.current.innerHTML = (14.2 + n * 0.4).toFixed(1) + '<i>ms/mmHg</i>';
                if (hrvRef.current) hrvRef.current.innerHTML = Math.round(48 + n * 3 + (Math.random() - .5) * 2) + '<i>ms</i>';
                if (pwvRef.current) pwvRef.current.innerHTML = (7.4 + n * 0.15).toFixed(1) + '<i>m/s</i>';
                hr = 64 + Math.round(Math.sin(t * 0.0008) * 4);
            }
            let d = '';
            const step = 3;
            for (let x = 0; x <= W; x += step) {
                const phase = ((t - W + x) % period) / period;
                const y = ecg(phase < 0 ? phase + 1 : phase);
                d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
            }
            if (pathRef.current) pathRef.current.setAttribute('d', d);
            rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="cardiac-vis">
            <div className="cv-head">
                <span className="cv-tag">Live</span>
                <span className="cv-id">CH 02</span>
            </div>
            <div className="cv-readout">
                <div className="cv-row">
                    <span className="cv-k">SBI<sup>™</sup></span>
                    <span className="cv-v" ref={sbiRef}>0.87</span>
                </div>
                <div className="cv-row">
                    <span className="cv-k">BRS</span>
                    <span className="cv-v" ref={brsRef}>14.2<i>ms/mmHg</i></span>
                </div>
                <div className="cv-row">
                    <span className="cv-k">HRV<i style={{opacity:.55}}>·rmssd</i></span>
                    <span className="cv-v" ref={hrvRef}>48<i>ms</i></span>
                </div>
                <div className="cv-row">
                    <span className="cv-k">PWV</span>
                    <span className="cv-v" ref={pwvRef}>7.4<i>m/s</i></span>
                </div>
            </div>
            <svg className="cv-wave" viewBox="0 0 280 60" preserveAspectRatio="none">
                <path ref={pathRef} d="" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" filter="drop-shadow(0 0 4px rgba(255,255,255,.4))" />
            </svg>
            <div className="cv-foot">PROPRIETARY · AUTONOMIC INDEX</div>
        </div>
    );
};

const BodyData = () => (
    <section data-theme="dark" className="bg-nomad-black text-white py-32 md:py-48 px-6 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
            <div className="bento-head">
                <h2>Your body's data.<br />Always visible. <span className="dim">Always on.</span></h2>
            </div>

            <div className="bento-row">
                {/* 01 — Live graph */}
                <div className="body-card">
                    <div className="sugar-vis">
                        <div className="sv-name">Blood pressure · live</div>
                        <div className="sv-num">
                            <strong>118</strong><span className="sv-u">/76 mmHg</span>
                        </div>
                        <svg viewBox="0 0 180 50" style={{width:'100%',height:'50px',overflow:'visible'}}>
                            <path d="M0 25 Q 18 8 36 25 T 72 25 T 108 25 T 144 25 T 180 25" stroke="rgba(255,255,255,.15)" strokeWidth="1" fill="none" />
                            <path d="M0 25 Q 18 8 36 25 T 72 25 T 108 25 T 144 25 T 180 25" stroke="#E7FE55" strokeWidth="1.4" fill="none" strokeDasharray="600" strokeDashoffset="600">
                                <animate attributeName="stroke-dashoffset" values="600;0;-600" dur="6s" repeatCount="indefinite" />
                            </path>
                            <polygon points="146,22 154,22 150,30" fill="#E7FE55" />
                        </svg>
                    </div>
                    <div className="bd-label">— Live graph</div>
                    <div className="bd-desc">A minimalist real-time display that keeps your current autonomic state in focus.</div>
                </div>

                {/* 02 — Health grid */}
                <div className="body-card">
                    <div className="health-bento">
                        <div className="hb-card hb-glucose">
                            <div className="hb-lab">Mean arterial pressure</div>
                            <div className="hb-num">90<span>mmHg</span></div>
                            <div className="hb-ring">A+</div>
                        </div>
                        <div className="hb-card hb-tir">
                            <div className="hb-lab">Time in range</div>
                            <div className="hb-bar" />
                            <div className="hb-arrow" />
                            <div className="hb-num">100<span>%</span></div>
                        </div>
                        <div className="hb-card hb-var">
                            <div className="hb-lab">Variability</div>
                            <div className="hb-dots">
                                {[...Array(8)].map((_, i) => <span key={i} />)}
                            </div>
                            <div className="hb-num">6.8<span>%</span></div>
                        </div>
                    </div>
                    <div className="bd-label">— Health grid</div>
                    <div className="bd-desc">Your body's complex data organised into a clear bento-grid layout you can read in three seconds.</div>
                </div>

                {/* 03 — Sensor sync */}
                <div className="body-card">
                    <div className="sensor-vis">
                        <div className="sv-top">Hold steady — calibrating</div>
                        <div className="ring-wrap">
                            <div className="scan-ring" />
                            <div className="scan-core" />
                        </div>
                        <div className="phone-bottom" />
                    </div>
                    <div className="bd-label">— Sensor sync</div>
                    <div className="bd-desc">The bridge between biology and digital code, calibrated to your skin in seconds.</div>
                </div>

                {/* 04 — Proprietary cardiac measures */}
                <div className="body-card">
                    <CardiacVis />
                    <div className="bd-label">— Proprietary cardiac measures</div>
                    <div className="bd-desc">Cardiac signals decomposed into proprietary autonomic indices — calibrated against clinical reference standards.</div>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section data-theme="dark" className="bg-nomad-black text-white py-32 md:py-48 px-6 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 mb-20 md:mb-24">
                <div>
                    <span className="text-nomad-pink tracking-widest text-xs uppercase font-medium">How it works</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mt-6 tracking-tight">
                        The first device <i className="text-white/60">that listens back.</i>
                    </h2>
                </div>
                <div>
                    <FadeIn>
                        <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed">
                            Sense autonomic shifts in real time. Respond within milliseconds. Non-invasively, without breaking the skin — a closed loop that adapts to you.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="how-grid">
                {/* 01 — SENSOR SYNC */}
                <div className="how-card">
                    <span className="num">01.</span>
                    <div className="how-vis">
                        <svg viewBox="0 0 180 130" width="180" height="130" fill="none" overflow="visible">
                            <defs>
                                <radialGradient id="hiwCoreGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFD0E5" stopOpacity=".95" />
                                    <stop offset="55%" stopColor="#E94A9C" stopOpacity=".75" />
                                    <stop offset="100%" stopColor="#E94A9C" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <path d="M14 110 Q 14 70 36 64 L 144 64 Q 166 70 166 110" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
                            <path d="M14 110 L 14 130 M 166 110 L 166 130" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
                            <g stroke="rgba(255,255,255,.25)" strokeWidth=".75">
                                <line x1="30" y1="118" x2="30" y2="122" />
                                <line x1="50" y1="118" x2="50" y2="122" />
                                <line x1="70" y1="118" x2="70" y2="122" />
                                <line x1="90" y1="118" x2="90" y2="122" />
                                <line x1="110" y1="118" x2="110" y2="122" />
                                <line x1="130" y1="118" x2="130" y2="122" />
                                <line x1="150" y1="118" x2="150" y2="122" />
                            </g>
                            <circle cx="90" cy="50" r="14" stroke="#E94A9C" strokeWidth="1" opacity=".9">
                                <animate attributeName="r" values="14;46" dur="2.4s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values=".9;0" dur="2.4s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="90" cy="50" r="14" stroke="#E94A9C" strokeWidth="1" opacity=".9">
                                <animate attributeName="r" values="14;46" dur="2.4s" begin="-1.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values=".9;0" dur="2.4s" begin="-1.2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="90" cy="50" r="32" fill="url(#hiwCoreGlow)">
                                <animate attributeName="r" values="30;36;30" dur="1.1s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="90" cy="50" r="6" fill="#fff" />
                            <circle cx="90" cy="50" r="3" fill="#E94A9C" />
                            <g stroke="rgba(255,255,255,.5)" strokeWidth=".75">
                                <line x1="56" y1="50" x2="66" y2="50" />
                                <line x1="114" y1="50" x2="124" y2="50" />
                                <line x1="90" y1="16" x2="90" y2="26" />
                            </g>
                        </svg>
                    </div>
                    <div>
                        <p>Pair the wearable in seconds. A single touch initiates a continuous, beat-by-beat stream of your nervous system — directly to the screen.</p>
                        <div className="how-label">Sensor sync</div>
                    </div>
                </div>

                {/* 02 — LIVE MONITORING */}
                <div className="how-card">
                    <span className="num">02.</span>
                    <div className="how-vis">
                        <svg className="sparkline" viewBox="0 0 160 50" fill="none">
                            <g stroke="rgba(255,255,255,.55)" strokeWidth="1">
                                <line x1="6" y1="40" x2="6" y2="46" /><line x1="14" y1="36" x2="14" y2="46" />
                                <line x1="22" y1="42" x2="22" y2="46" /><line x1="30" y1="34" x2="30" y2="46" />
                                <line x1="38" y1="38" x2="38" y2="46" /><line x1="46" y1="32" x2="46" y2="46" />
                                <line x1="54" y1="40" x2="54" y2="46" /><line x1="62" y1="28" x2="62" y2="46" />
                                <line x1="70" y1="36" x2="70" y2="46" /><line x1="78" y1="22" x2="78" y2="46" />
                                <line x1="86" y1="32" x2="86" y2="46" /><line x1="94" y1="38" x2="94" y2="46" />
                                <line x1="102" y1="34" x2="102" y2="46" /><line x1="110" y1="40" x2="110" y2="46" />
                                <line x1="118" y1="36" x2="118" y2="46" /><line x1="126" y1="42" x2="126" y2="46" />
                                <line x1="134" y1="38" x2="134" y2="46" /><line x1="142" y1="40" x2="142" y2="46" />
                                <line x1="150" y1="42" x2="150" y2="46" />
                            </g>
                            <line x1="78" y1="6" x2="78" y2="48" stroke="#E7FE55" strokeWidth="1.5">
                                <animate attributeName="x1" values="78;120;40;78" dur="6s" repeatCount="indefinite" />
                                <animate attributeName="x2" values="78;120;40;78" dur="6s" repeatCount="indefinite" />
                            </line>
                            <polygon points="74,4 82,4 78,10" fill="#E7FE55">
                                <animate attributeName="points" values="74,4 82,4 78,10;116,4 124,4 120,10;36,4 44,4 40,10;74,4 82,4 78,10" dur="6s" repeatCount="indefinite" />
                            </polygon>
                        </svg>
                    </div>
                    <div>
                        <p>The dynamic interface renders raw autonomic signal into clear visual curves, highlighting heart-rate variability and reactive shifts in real time.</p>
                        <div className="how-label">Live monitoring</div>
                    </div>
                </div>

                {/* 03 — STABILITY SCORE (flow wave) */}
                <div className="how-card">
                    <span className="num">03.</span>
                    <div className="how-vis">
                        <svg className="flow-wave" viewBox="0 0 180 50" fill="none" strokeLinecap="round">
                            <path d="M0 25 Q 18 6 36 25 T 72 25 T 108 25 T 144 25 T 180 25" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
                            <path d="M0 25 Q 18 6 36 25 T 72 25 T 108 25 T 144 25 T 180 25" stroke="#E7FE55" strokeWidth="1.5" strokeDasharray="600" strokeDashoffset="600">
                                <animate attributeName="stroke-dashoffset" values="600;0;-600" dur="5s" repeatCount="indefinite" />
                            </path>
                            <polygon points="146,22 154,22 150,30" fill="#E7FE55" />
                        </svg>
                    </div>
                    <div>
                        <p>Track autonomic stability across the day. The system surfaces dips and surges before you feel them — and quantifies your nervous system in a single number.</p>
                        <div className="how-label">Stability score</div>
                    </div>
                </div>

                {/* 04 — ADAPTIVE RESPONSE (84 stable ring) */}
                <div className="how-card">
                    <span className="num">04.</span>
                    <div className="how-vis">
                        <div className="dot-ring stability-ring">
                            <svg viewBox="0 0 120 120">
                                <defs>
                                    <linearGradient id="hiwStabGrad" x1="0" x2="1" y1="0" y2="1">
                                        <stop offset="0" stopColor="#ff8ab9" />
                                        <stop offset="1" stopColor="#E94A9C" />
                                    </linearGradient>
                                    <radialGradient id="hiwStabGlow" cx="0.5" cy="0.5" r="0.5">
                                        <stop offset="0" stopColor="#E94A9C" stopOpacity="0.35" />
                                        <stop offset="1" stopColor="#E94A9C" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                <circle cx="60" cy="60" r="58" fill="url(#hiwStabGlow)" />
                                <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(233,74,156,.15)" strokeWidth="2" />
                                <circle cx="60" cy="60" r="48" fill="none" stroke="url(#hiwStabGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="253.5 301.6" transform="rotate(-90 60 60)" filter="drop-shadow(0 0 4px rgba(233,74,156,.7))">
                                    <animate attributeName="stroke-dasharray" values="0 301.6;253.5 301.6;253.5 301.6" dur="2.6s" repeatCount="indefinite" />
                                </circle>
                                <g stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeLinecap="round">
                                    <line x1="60" y1="2" x2="60" y2="8" />
                                    <line x1="60" y1="112" x2="60" y2="118" />
                                    <line x1="2" y1="60" x2="8" y2="60" />
                                    <line x1="112" y1="60" x2="118" y2="60" />
                                </g>
                                <circle r="3.5" fill="#fff" filter="drop-shadow(0 0 6px #ff8ab9)">
                                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M 60 12 A 48 48 0 1 1 33.5 100" keyTimes="0;1" keyPoints="0;1" />
                                </circle>
                                <text x="60" y="56" textAnchor="middle" fontFamily="Helvetica" fontWeight="700" fontSize="32" fill="#fff" letterSpacing="-1">84</text>
                                <text x="60" y="74" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" letterSpacing="2.5" fill="rgba(255,255,255,.6)">STABLE</text>
                                <path d="M 32 88 L 40 88 L 44 80 L 50 96 L 56 84 L 64 88 L 88 88" stroke="#ff8ab9" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" filter="drop-shadow(0 0 2px #ff8ab9)">
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p>The on-device model learns your unique autonomic signature and adapts the closed-loop response — quietly, in milliseconds, all day long.</p>
                        <div className="how-label">Adaptive response</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const MegaStat = () => (
    <section data-theme="dark" className="bg-nomad-black text-white border-t border-white/10">
        <div className="stat-mega max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
            <FadeIn>
                <div className="mega-num">
                    376M<a href="#references" className="mega-ref">[1]</a>
                </div>
                <p className="text-base md:text-lg text-white/60 max-w-[520px] mx-auto mt-6 leading-relaxed">
                    <strong className="text-white font-medium">People</strong> whose autonomic nervous system is working against them.
                </p>
                <p className="mt-20 text-2xl text-white italic tracking-tight">
                    Until now, the loop was never closed.
                </p>
            </FadeIn>
        </div>
    </section>
);

const Stats = () => {
    const stats = [
        { number: 376, suffix: 'M', prefix: '', label: 'People whose autonomic nervous system is working against them' },
        { number: 0,   suffix: '',  prefix: '', label: 'Non-invasive, closed-loop treatments available to them today' },
        { number: 1,   suffix: '',  prefix: '', label: 'Device designed to change that' },
    ];

    return (
        <section className="bg-nomad-cream py-32 md:py-48 px-6 md:px-16 lg:px-24 border-t border-nomad-black/10">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24 md:mb-32">
                    {stats.map((stat, idx) => (
                        <FadeIn key={idx} delay={idx * 100}>
                            <div className="text-center md:text-left">
                                <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-nomad-pink mb-4 tracking-tight flex items-start justify-center md:justify-start">
                                    <AnimatedCounter
                                        end={stat.number}
                                        suffix={stat.suffix}
                                        prefix={stat.prefix}
                                        delay={idx === 2 ? 1100 : idx * 600}
                                        duration={1200}
                                    />
                                    {stat.number === 376 && (
                                        <a href="#references" className="text-sm md:text-base lg:text-lg align-super mt-2 ml-1 opacity-50 hover:opacity-100 transition-opacity font-medium text-nomad-black">
                                            [1]
                                        </a>
                                    )}
                                </div>
                                <p className="text-xl md:text-2xl font-light text-nomad-black/80 leading-relaxed max-w-xs mx-auto md:mx-0 pr-4">{stat.label}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light text-nomad-black tracking-tight text-center md:text-left mt-12">
                    <TextReveal delay={200}>Until now, the loop was <i>never closed</i>.</TextReveal>
                </h2>
            </div>
        </section>
    );
};

const DevelopmentTeaser = () => (
    <section className="bg-nomad-cream border-t border-nomad-black/10 py-20 md:py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-nomad-black/40 mb-4">In Active Development</p>
                        <p className="text-2xl md:text-3xl text-nomad-black/80 font-light leading-snug">
                            Non-invasive blood pressure. <span className="text-nomad-black/40 italic">More to follow when we're ready to say it.</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-nomad-black/30 shrink-0">
                        <Lock size={12} />
                        <span>Embargoed</span>
                    </div>
                </div>
            </FadeIn>
        </div>
    </section>
);

const PhotoGridItem = ({ name, role, image, index = 0 }) => (
    <div className="relative aspect-square overflow-hidden group cursor-pointer">
        <CurvedReveal delay={index * 60}>
            <img
                src={image}
                alt={`${name}, ${role}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
        </CurvedReveal>
        <div className="absolute inset-0 bg-gradient-to-t from-nomad-black/90 via-nomad-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
            <h4 className="text-white font-bold text-base mb-0.5">{name}</h4>
            <p className="text-nomad-pink text-xs uppercase tracking-wider font-medium">{role}</p>
        </div>
    </div>
);

const ResearchTimeline = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const researchItems = [
        { title: 'The First Spark',     description: 'Cervical vagal stimulation is attempted for the first time. The discovery that electricity could silence a storm in the brain marks the beginning of a century of secret potential.', date: '1881' },
        { title: 'Out of the Shadows',  description: 'Vagal nerve stimulation (VNS) moves from experiment to clinical reality. The FDA approves the first system for drug-resistant epilepsy. For those with no other options, the loop finally begins to crack open.', date: '1997' },
        { title: 'The Emotional Current', description: 'The science moves deeper. VNS is approved for treatment-resistant depression. We begin to learn that the vagus nerve isn\'t just a wire — it\'s a dial for human emotion.', date: '2005' },
        { title: 'The Breaking Point',  description: 'Opioid withdrawal. A crisis with no exit. VNS is cleared to bridge the gap. The technology is no longer just for chronic conditions; it becomes a tool for survival.', date: '2017' },
        { title: 'Re-wiring the Future', description: 'Stroke rehabilitation. The vagus nerve is used to physically rebuild motor pathways. We realize we aren\'t just treating symptoms — we are teaching the body to repair itself.', date: '2021' },
        { title: 'The Loop Closes',     description: 'Nomad. The world\'s first non-invasive, closed-loop interface. 140 years of surgery and uncertainty culminate in a single, wearable point of contact.', date: 'MARCH 2026', link: 'https://doi.org/10.1002/cph4.70109' },
    ];

    const next = () => setActiveIndex((p) => Math.min(p + 1, researchItems.length - 1));
    const prev = () => setActiveIndex((p) => Math.max(p - 1, 0));

    return (
        <section id="technology" className="bg-nomad-cream py-32 md:py-48 px-6 md:px-16 lg:px-24 border-t border-black/5">
            <div className="max-w-[1400px] mx-auto">
                <FadeIn>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-nomad-black leading-[1.1] tracking-tight">
                            140 years building toward this moment.
                        </h2>
                        <p className="text-lg md:text-xl text-nomad-black/60 leading-relaxed font-light">
                            Vagal nerve stimulation has been saving lives since the 19th century. Every decade brought the science closer to the surface. Here is how we got here.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-[3rem] p-8 md:p-20 shadow-sm border border-black/5 min-h-[450px] flex flex-col items-center justify-center overflow-hidden">
                        <div className="w-full max-w-4xl grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-12 relative z-10">
                            <Magnetic>
                                <Button
                                    onClick={prev}
                                    disabled={activeIndex === 0}
                                    variant="ghost"
                                    className="w-10 h-10 md:w-14 md:h-14 bg-white border border-black/5 shadow-sm disabled:opacity-20 transition-all group active:scale-95 !p-0"
                                    aria-label="Previous milestone"
                                    hoverImage="button_back_3.png"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </Button>
                            </Magnetic>

                            <div className="relative h-32 flex items-center px-4">
                                <div
                                    className="absolute inset-x-0 h-[10px] flex justify-between pointer-events-none opacity-[0.08]"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 9'%3E%3Crect width='0.5' height='9' fill='black' /%3E%3C/svg%3E")`,
                                        backgroundSize: '9px 9px',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div className="relative w-full h-full flex items-center">
                                    {researchItems.map((item, idx) => {
                                        const isActive = activeIndex === idx;
                                        const leftPos = (idx / (researchItems.length - 1)) * 100;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveIndex(idx)}
                                                aria-label={`View milestone: ${item.title} (${item.date})`}
                                                aria-current={isActive ? 'true' : undefined}
                                                className="absolute top-1/2 -translate-y-1/2 cursor-pointer group z-20 bg-transparent border-0 p-0"
                                                style={{ left: `${leftPos}%`, transform: 'translate(-50%, -50%)' }}
                                            >
                                                <div className={`w-[1px] h-4 bg-black transition-all duration-500 ease-out ${isActive ? 'h-10 w-[2px] bg-nomad-pink' : 'opacity-20 group-hover:opacity-100 group-hover:h-6'}`} />
                                                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-36 border border-black/10 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'opacity-100 scale-100 ring-4 ring-nomad-pink/5' : 'opacity-0 scale-75'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Magnetic>
                                <Button
                                    onClick={next}
                                    disabled={activeIndex === researchItems.length - 1}
                                    variant="ghost"
                                    className="w-10 h-10 md:w-14 md:h-14 bg-white border border-black/5 shadow-sm disabled:opacity-20 transition-all group active:scale-95 !p-0"
                                    aria-label="Next milestone"
                                    hoverImage="button_back_3.png"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </Button>
                            </Magnetic>
                        </div>

                        <div className="relative w-full max-w-2xl mt-16 h-40">
                            {researchItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
                                >
                                    <h3 className="text-xl md:text-3xl font-light mb-4 tracking-tight">
                                        {item.link
                                            ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-nomad-pink transition-colors">{item.title}</a>
                                            : item.title}
                                    </h3>
                                    <p className="text-nomad-black/50 text-base md:text-lg font-light max-w-md mx-auto mb-4">{item.description}</p>
                                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-nomad-black/30 bg-black/5 px-4 py-1.5 rounded-full">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

const Roadmap = () => {
    const [isInView, setIsInView] = useState(false);
    const [lineProgress, setLineProgress] = useState(0);
    const sectionRef = useRef(null);

    const milestones = [
        { year: '2024', title: 'The Science', description: "We didn't start with a product. We started with a question: is there enough published evidence to build a non-invasive, closed-loop system for autonomic regulation? The answer was yes — barely — and that was enough to begin.", status: 'complete' },
        { year: '2025', title: 'The Foundation', description: 'University spinout from our research base. Seed funding. A small, deliberate team assembled around people who have spent their careers in neuromodulation, autonomic physiology, and wearable engineering. First prototypes. First proof-of-concept data.', status: 'complete' },
        { year: '2026', title: 'Validation (This is where we are)', description: "We are in clinical investigation. That means we are in the rigorous, unglamorous, necessary phase of proving that what we believe works, actually works, in real people, under controlled conditions.\n\nWe are pursuing UKCA and CE marking. We are miniaturising the hardware. We are not cutting corners.\n\n*If you're reading this hoping to buy or use Nomad today — we understand. We're moving as fast as the science allows.*", status: 'current' },
        { year: '2027', title: 'First Product', description: 'Commercial release of the first Nomad device. A wearable. Non-invasive. Cleared for use.', status: 'upcoming' },
        { year: '2028 and beyond', title: 'Scale', description: "EU Class IIb. FDA pathway. Global. Platform extensions we're not ready to describe yet, because we'd rather show you than promise you.", status: 'upcoming' },
    ];

    useEffect(() => {
        let rafId = null;
        let pending = false;
        const update = () => {
            pending = false;
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const wH = window.innerHeight;
            const startPos = wH * 0.7;
            const endPos = wH * 0.3;
            if (rect.top <= startPos && rect.bottom >= endPos) {
                const progress = ((startPos - rect.top) / rect.height) * 100;
                setLineProgress(Math.max(0, Math.min(100, progress)));
            } else if (rect.top > startPos) {
                setLineProgress(0);
            } else if (rect.bottom < endPos) {
                setLineProgress(100);
            }
        };
        const handleScroll = () => {
            if (!pending) {
                pending = true;
                rafId = requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        update();

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, []);

    return (
        <section ref={sectionRef} data-theme="dark" className="bg-nomad-black py-32 md:py-48 px-6 md:px-16 lg:px-24 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <FadeIn>
                    <div className="mb-24 md:mb-32">
                        <p className="text-sm font-medium text-nomad-pink uppercase tracking-[0.3em] mb-6">Roadmap</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight">
                            Where we are. Honestly.
                        </h2>
                    </div>
                </FadeIn>

                <div className="relative">
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2">
                        <div className="absolute inset-0 bg-white/10"></div>
                        <div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-nomad-pink via-nomad-pink to-transparent transition-all duration-100 ease-out"
                            style={{ height: `${lineProgress}%` }}
                        >
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-nomad-pink shadow-[0_0_20px_rgba(255,27,141,0.8),0_0_40px_rgba(255,27,141,0.4)]" />
                        </div>
                    </div>

                    <div className="relative space-y-16 md:space-y-24">
                        {milestones.map((milestone, idx) => {
                            const isLeft = idx % 2 === 0;
                            const isFuture = milestone.status === 'upcoming';
                            const isCurrent = milestone.status === 'current';
                            return (
                                <div
                                    key={idx}
                                    className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{ transitionDelay: `${idx * 200 + 400}ms` }}
                                >
                                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                                        <div
                                            className={`w-3 h-3 rounded-full transition-all duration-500 ${isCurrent ? 'bg-nomad-pink scale-150 shadow-[0_0_20px_rgba(255,27,141,0.8)]' : isFuture ? 'bg-white/20' : 'bg-nomad-pink'}`}
                                            style={{ transitionDelay: `${idx * 200 + 600}ms` }}
                                        ></div>
                                    </div>
                                    <div className={`pl-8 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                                        <div className={`group transition-all duration-500 ${isFuture ? 'opacity-60 hover:opacity-100' : ''}`}>
                                            <div
                                                className={`text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-4 transition-all duration-700 ${isCurrent ? 'text-nomad-pink' : isFuture ? 'text-white/40 group-hover:text-white/60' : 'text-white/30'}`}
                                                style={{ transitionDelay: `${idx * 200 + 500}ms` }}
                                            >
                                                {milestone.year}
                                            </div>
                                            <h3 className={`text-xl md:text-2xl font-medium mb-3 transition-all duration-500 ${isCurrent ? 'text-white' : isFuture ? 'text-white/50 group-hover:text-white/70' : 'text-white/70'}`}>
                                                {milestone.title}
                                                {isCurrent && <span className="ml-3 text-xs font-bold text-nomad-pink uppercase tracking-widest">Now</span>}
                                            </h3>
                                            <p className={`text-sm md:text-base leading-relaxed max-w-md transition-all duration-500 whitespace-pre-line text-left ${isLeft ? 'md:ml-auto' : ''} ${isCurrent ? 'text-white/60' : isFuture ? 'text-white/40 group-hover:text-white/55' : 'text-white/40'}`}>
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const [footerEmail, setFooterEmail] = useState('');
    const [footerSubmitting, setFooterSubmitting] = useState(false);
    const [footerSuccess, setFooterSuccess] = useState(false);

    const handleFooterSubmit = async (e) => {
        e.preventDefault();
        setFooterSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('form-name', 'waitlist');
            formData.append('email', footerEmail);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });
            if (response.ok) {
                setFooterSuccess(true);
                setFooterEmail('');
                setTimeout(() => setFooterSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFooterSubmitting(false);
        }
    };

    return (
        <footer data-theme="dark" className="bg-nomad-black text-white py-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 mb-20 pb-20 border-b border-white/10">
                    <div className="col-span-2">
                        <div className="font-display text-2xl font-medium lowercase tracking-wide mb-6">nomad</div>
                        <p className="text-white/50 leading-relaxed max-w-xs mb-6 text-xl pb-2">The operating system for your body.</p>
                        <p className="text-nomad-pink text-xs italic mb-8 max-w-xs leading-relaxed">
                            Currently in clinical investigation — because we refuse to release anything we can't prove.
                        </p>
                        <p className="text-white/55 text-[10px] uppercase tracking-widest leading-relaxed max-w-xs border-t border-white/5 pt-4 font-tech">
                            * Nomad delivers closed-loop neuromodulation through non-invasive autonomic interfaces.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-[10px] uppercase tracking-[0.2em] text-white/20 font-tech">1.0 Explore</h4>
                        <ul className="space-y-3 text-white/50 text-[11px] uppercase tracking-wider font-tech">
                            <li><a href="#platform" className="hover:text-white transition-colors">Platform</a></li>
                            <li><a href="#technology" className="hover:text-white transition-colors">Technology</a></li>
                            <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                            <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="/signin" className="hover:text-white transition-colors">Investor Portal</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-[10px] uppercase tracking-[0.2em] text-white/20 font-tech">2.0 Follow</h4>
                        <ul className="space-y-3 text-white/50 text-[11px] uppercase tracking-wider font-tech">
                            <li><a href="https://www.linkedin.com/company/nomadneuro/" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="mailto:hello@nomadneuro.com" className="hover:text-white transition-colors">Email</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2">
                        <h4 className="font-bold mb-6 text-[10px] uppercase tracking-[0.2em] text-white/20 font-tech">Newsletter</h4>
                        <form onSubmit={handleFooterSubmit} className="space-y-3 max-w-xs">
                            <label htmlFor="footer-email" className="sr-only">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="Email address"
                                value={footerEmail}
                                onChange={(e) => setFooterEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nomad-pink transition-colors text-white placeholder:text-white/30 font-tech"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={footerSubmitting}
                                className="w-full !rounded-lg"
                                hoverImage="button_back.png"
                            >
                                {footerSuccess ? 'Subscribed!' : footerSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </Button>
                            <p className="mt-3 text-[10px] text-white/30 leading-relaxed font-tech">By subscribing you agree to our <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>. Unsubscribe anytime.</p>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-white/5 font-tech">
                    <div className="flex flex-col gap-8 max-w-4xl">
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40">
                                &copy; 2026 NOMAD NEUROSCIENCE LTD. All rights reserved.
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                                Registered in England and Wales • Company № 16558472
                            </p>
                            <div className="pt-8 mt-8 border-t border-white/5">
                                <p className="text-[10px] font-medium text-nomad-pink tracking-widest uppercase">
                                    Currently in clinical investigation. Not available for commercial or medical use.
                                </p>
                            </div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                                Registered Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                            <div className="space-y-4">
                                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/20">3.0 Regulatory Status</h4>
                                <p className="text-[10px] leading-relaxed text-white/40 uppercase tracking-widest">
                                    Nomad is an investigational device, exclusively for clinical investigation. It has not yet been reviewed or approved by the MHRA or other regulatory authorities and is not available for commercial sale or medical use.
                                </p>
                            </div>
                            <div id="references" className="space-y-4">
                                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/20">4.0 Scientific References [1]</h4>
                                <p className="text-[9px] leading-relaxed text-white/55 uppercase tracking-widest">
                                    Estimates derived from aggregated global prevalence data across primary dysautonomia (Dysautonomia International, 2023: &gt;70M), cardiovascular autonomic neuropathy in diabetes (Spallone et al., Front. Neurosci., 2019; IDF Diabetes Atlas 2021: ~107M), post-COVID autonomic dysfunction (Stiles et al., 2022; Frontera et al., 2025 meta-analysis: &gt;100M), and autonomic impairment in heart failure and hypertension. Total addressable population estimated at &gt;376M. This figure aggregates overlapping at-risk populations and is not a count of unique individuals.
                                </p>
                                <p className="text-[9px] leading-relaxed text-white/55 uppercase tracking-widest pt-2 border-t border-white/5">
                                    As of [15.03.2026], no commercially available or CE/UKCA-approved wearable device integrates real-time ANS biomarker sensing with automated closed-loop neuromodulation.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium text-white/40">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const NumberedSection = ({ number, title, description, badge, linkText, linkHref, badgeHref }) => (
    <div className="border-t border-nomad-black/10 py-16 flex flex-col md:flex-row justify-between items-start gap-12 group">
        <div className="flex gap-8 lg:w-1/2">
            <span className="text-nomad-black text-2xl md:text-3xl font-light transition-transform duration-300 group-hover:translate-x-2">{number}</span>
            <div>
                <h3 className="text-3xl md:text-5xl font-light text-nomad-black leading-tight mb-6 tracking-tight">{title}</h3>
                <p className="text-xl text-nomad-black/60 leading-relaxed max-w-sm">{description}</p>
            </div>
        </div>
        <div className="flex flex-col items-start md:items-end justify-between h-full lg:w-1/2 gap-12">
            {badgeHref ? (
                <Button variant="outline" href={badgeHref} className="!px-5 !py-2 !rounded-full text-xs tracking-widest uppercase font-medium !border-black/10 hover:!bg-black hover:!text-white !text-nomad-black transition-all">
                    {badge}
                </Button>
            ) : (
                <div className="px-5 py-2 rounded-full border border-black/10 text-xs tracking-widest uppercase font-medium">{badge}</div>
            )}
            {linkText && (
                <Button variant="ghost" href={linkHref} className="text-nomad-pink hover:text-white transition-colors font-medium !p-0">
                    {linkText}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform ml-2">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Button>
            )}
        </div>
    </div>
);

const ScienceAndTeam = () => {
    const team = [
        { name: 'Santiago Denari',         role: 'Chief Executive Officer',   image: '/assets/images/Santi.jpg' },
        { name: 'Oliver Case',             role: 'Chief Science Officer',     image: '/assets/images/Ollie.png' },
        { name: 'Ben Black',               role: 'Management Team [NED]',     image: '/assets/images/ben_black.png' },
        { name: 'Ben Newton',              role: 'Management Team',           image: '/assets/images/Ben_Newton.png' },
        { name: 'Callum Shingleton Smith', role: 'Head of Engineering',       image: '/assets/images/callum.png' },
        { name: 'Marcelo Arenas',          role: 'Head of Systems',           image: '/assets/images/Marcelo.png' },
        { name: 'Dr. Guy Winter',          role: 'Management Team',           image: '/assets/images/Guy_Winter.png' },
        { name: 'Dr. Ali Hawks',           role: 'Management Team',           image: '/assets/images/Ali-050.png' },
        { name: 'Patrik Nilsson',          role: 'Supply Chain Resilience',   image: '/assets/images/Patrik_Nilsson.png' },
        { name: 'Prof. Imanuel Lerman',    role: 'Clinical Team',             image: '/assets/images/Imanuel_Lerman.png' },
        { name: 'Prof. Steve Alty',        role: 'Engineering Advisor',       image: '/assets/images/Steve_Alty.png' },
        { name: 'Anders Borg',             role: 'Strategic Advisor',         image: '/assets/images/Anders_borg.png' },
        { name: 'Manuel Hidalgo Sola',     role: 'App Dev Team',              image: '/assets/images/Manuel.png' },
    ];

    return (
        <section className="bg-nomad-cream py-32 md:py-48 px-6 md:px-16 lg:px-24">
            <div className="max-w-[1400px] mx-auto">
                <NumberedSection
                    number="1.0"
                    title="Scientific Evidence"
                    description="Wearables and insights, science-led."
                    badge="Learn How"
                    badgeHref="#technology"
                    linkText="Explore the platform"
                    linkHref="#platform"
                />
                <div className="mt-24" id="team">
                    <NumberedSection
                        number="2.0"
                        title="Driven by People"
                        description="We believe technology is only as powerful as the people behind it. Discover the team that makes it possible."
                        badge="Careers"
                        badgeHref="/careers"
                        linkText="Meet the Team"
                        linkHref="#team"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-16 border-t border-l border-nomad-black/10">
                        {team.map((member, idx) => (
                            <div key={idx} className="border-r border-b border-nomad-black/10">
                                <PhotoGridItem {...member} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const GetInTouch = () => (
    <section className="bg-nomad-cream py-32 md:py-48 px-6 md:px-16 lg:px-24 border-t border-nomad-black/10">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 group">
                <div className="flex gap-8 lg:w-3/5">
                    <span className="text-nomad-black text-2xl md:text-3xl font-light">3.0</span>
                    <div>
                        <h3 className="text-3xl md:text-5xl font-light text-nomad-black leading-tight mb-8 tracking-tight">Who writes to us</h3>
                        <div className="text-xl text-nomad-black/60 leading-relaxed space-y-6">
                            <p>Researchers who want to collaborate. Clinicians who have spent careers treating what we're building for. Engineers who want to work on the hardest problem in wearable medicine.</p>
                            <p>And patients — more than anyone else — who have been waiting for something like this, and want to know if it's real, when it's coming, and whether they can be part of the investigation.</p>
                            <p>All of it matters. All of it gets read.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start md:items-end justify-center lg:w-2/5 gap-12 mt-12 md:mt-0">
                    <div className="space-y-12">
                        <div>
                            <p className="text-nomad-black font-medium text-lg leading-snug mb-4">If you're living with autonomic dysfunction and want to know about our clinical investigation programme — write to us first.</p>
                            <Button variant="ghost" href="mailto:hello@nomadneuro.com" className="text-nomad-pink hover:text-white transition-all font-medium !p-0 text-xl group flex items-center">
                                Write to us
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform ml-2">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                        </div>
                        <div>
                            <p className="text-nomad-black/60 font-medium text-base leading-snug mb-4">If you're a researcher, clinician, or engineer — we'd like to hear what you're working on.</p>
                            <Button variant="ghost" href="mailto:hello@nomadneuro.com" className="text-nomad-black hover:text-nomad-pink transition-all font-medium !p-0 group flex items-center">
                                Collaborate
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform ml-2">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

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

const App = () => {
    const [loading, setLoading] = useState(() => {
        try {
            if (sessionStorage.getItem('nomad-intro-seen') === '1') return false;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        } catch (e) {}
        return true;
    });
    const [loginOpen, setLoginOpen] = useState(false);
    const [waitlistOpen, setWaitlistOpen] = useState(false);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2,
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
            <div className={`font-sans text-nomad-black bg-nomad-cream antialiased selection:bg-nomad-pink selection:text-white transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-nomad-pink focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Skip to content</a>
                <Navbar onWaitlistClick={() => setWaitlistOpen(true)} />
                <main id="main-content">
                    <Hero />
                    <MarqueeText text="SENSING IN REAL TIME • RESPONDING IN MILLISECONDS • NON-INVASIVE • NO SURGERY • NO IMPLANT • PERSONALIZED TO YOUR NERVOUS SYSTEM • THE FIRST OF ITS KIND • " />
                    <OverviewBlock />
                    <MissionGrid />
                    <FutureWearable />
                    <HowItWorks />
                    <MegaStat />
                    <BodyData />
                    <Stats />
                    <DevelopmentTeaser />
                    <ScienceAndTeam />
                    <ResearchTimeline />
                    <Roadmap />
                    <PartnerLogos />
                    <GetInTouch />
                </main>
                <Footer />
                <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
                <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
            </div>
        </>
    );
};

createRoot(document.getElementById('root')).render(<App />);
