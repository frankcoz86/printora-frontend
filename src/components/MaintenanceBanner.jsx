import React, { useState, useEffect } from 'react';

const BANNER_SESSION_KEY = 'printora_maintenance_banner_shown';

export default function MaintenanceBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem(BANNER_SESSION_KEY);
        if (!alreadyShown) {
            setVisible(true);
            sessionStorage.setItem(BANNER_SESSION_KEY, 'true');
        }
    }, []);

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes bannerSlideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                @keyframes bannerFadeOut {
                    from { transform: translateY(0);    opacity: 1; }
                    to   { transform: translateY(-100%); opacity: 0; }
                }
                .maintenance-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 13px 20px;
                    background: linear-gradient(135deg, rgba(234, 88, 12, 0.92) 0%, rgba(220, 38, 38, 0.92) 100%);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 4px 24px rgba(234, 88, 12, 0.35);
                    animation: bannerSlideDown 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .maintenance-banner.hiding {
                    animation: bannerFadeOut 0.35s cubic-bezier(0.7, 0, 0.84, 0) forwards;
                }
                .maintenance-banner__icon {
                    font-size: 18px;
                    flex-shrink: 0;
                    filter: drop-shadow(0 0 6px rgba(255,200,100,0.6));
                }
                .maintenance-banner__text {
                    font-family: 'Inter', 'Outfit', system-ui, sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    color: #fff;
                    line-height: 1.4;
                    letter-spacing: 0.01em;
                    text-align: center;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    flex: 1;
                }
                .maintenance-banner__text strong {
                    font-weight: 700;
                }
                .maintenance-banner__close {
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.25);
                    border-radius: 50%;
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #fff;
                    font-size: 14px;
                    line-height: 1;
                    transition: background 0.2s, transform 0.2s;
                    padding: 0;
                }
                .maintenance-banner__close:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                @media (max-width: 600px) {
                    .maintenance-banner {
                        padding: 11px 14px;
                        gap: 10px;
                    }
                    .maintenance-banner__text {
                        font-size: 12.5px;
                    }
                    .maintenance-banner__icon {
                        font-size: 16px;
                    }
                }
            `}</style>

            <div className="maintenance-banner" id="maintenance-banner" role="alert" aria-live="polite">
                <span className="maintenance-banner__icon" aria-hidden="true">🔧</span>
                <p className="maintenance-banner__text">
                    <strong>Avviso importante:</strong>{' '}
                    Informiamo i nostri stimati clienti che <strong>questo sabato</strong> il sito sarà temporaneamente offline per un importante aggiornamento del sistema.
                </p>
                <button
                    className="maintenance-banner__close"
                    aria-label="Chiudi avviso"
                    onClick={() => {
                        const el = document.getElementById('maintenance-banner');
                        if (el) {
                            el.classList.add('hiding');
                            setTimeout(() => setVisible(false), 350);
                        }
                    }}
                >
                    ✕
                </button>
            </div>
        </>
    );
}
