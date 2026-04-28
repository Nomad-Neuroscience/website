// Site-wide cookie banner. Vanilla DOM so every entry (React or static) can mount it.
// Persists dismissal in localStorage under "nomad-cookie-ack".

const STORAGE_KEY = 'nomad-cookie-ack';

export function mountCookieBanner() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
        if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch (e) {}

    const mount = () => {
        if (document.getElementById('nomad-cookie-banner')) return;

        const root = document.createElement('div');
        root.id = 'nomad-cookie-banner';
        root.setAttribute('role', 'region');
        root.setAttribute('aria-label', 'Cookie notice');
        root.style.cssText = [
            'position: fixed',
            'left: 0',
            'right: 0',
            'bottom: 0',
            'z-index: 200',
            'background: #0A0A0A',
            'color: rgba(255,255,255,0.7)',
            "font-family: 'JetBrains Mono', ui-monospace, monospace",
            'font-size: 12px',
            'letter-spacing: 0.04em',
            'border-top: 1px solid rgba(255,255,255,0.08)',
            'box-shadow: 0 -8px 24px rgba(0,0,0,0.25)',
        ].join(';');

        const inner = document.createElement('div');
        inner.style.cssText = [
            'max-width: 1400px',
            'margin: 0 auto',
            'padding: 14px 24px',
            'display: flex',
            'flex-wrap: wrap',
            'align-items: center',
            'justify-content: space-between',
            'gap: 16px',
        ].join(';');

        const text = document.createElement('p');
        text.textContent = 'we use the minimum necessary cookies. nothing for advertising.';
        text.style.cssText = 'margin: 0; line-height: 1.5;';

        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 10px; flex-shrink: 0;';

        const sharedBtnCss = [
            "font-family: 'JetBrains Mono', ui-monospace, monospace",
            'font-size: 11px',
            'letter-spacing: 0.16em',
            'text-transform: lowercase',
            'padding: 8px 16px',
            'border-radius: 999px',
            'border: 1px solid rgba(255,255,255,0.18)',
            'background: transparent',
            'color: rgba(255,255,255,0.55)',
            'cursor: pointer',
            'transition: color 0.2s ease, border-color 0.2s ease',
            'text-decoration: none',
        ].join(';');

        const accept = document.createElement('button');
        accept.type = 'button';
        accept.textContent = 'accept';
        accept.style.cssText = sharedBtnCss;
        accept.addEventListener('mouseenter', () => {
            accept.style.color = 'rgba(255,255,255,0.9)';
            accept.style.borderColor = 'rgba(255,255,255,0.4)';
        });
        accept.addEventListener('mouseleave', () => {
            accept.style.color = 'rgba(255,255,255,0.55)';
            accept.style.borderColor = 'rgba(255,255,255,0.18)';
        });
        accept.addEventListener('click', () => {
            try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
            root.remove();
        });

        const details = document.createElement('a');
        details.href = '/cookies';
        details.textContent = 'details →';
        details.style.cssText = sharedBtnCss;
        details.addEventListener('mouseenter', () => {
            details.style.color = 'rgba(255,255,255,0.9)';
            details.style.borderColor = 'rgba(255,255,255,0.4)';
        });
        details.addEventListener('mouseleave', () => {
            details.style.color = 'rgba(255,255,255,0.55)';
            details.style.borderColor = 'rgba(255,255,255,0.18)';
        });

        actions.appendChild(accept);
        actions.appendChild(details);
        inner.appendChild(text);
        inner.appendChild(actions);
        root.appendChild(inner);
        document.body.appendChild(root);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
        mount();
    }
}
