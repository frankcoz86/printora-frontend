import React, { useState, useEffect } from 'react';

const BANNER_SESSION_KEY = 'printora_maintenance_banner_shown';

export default function MaintenanceBanner() {
    const [visible, setVisible] = useState(false);
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem(BANNER_SESSION_KEY);
        if (!alreadyShown) {
            setVisible(true);
            sessionStorage.setItem(BANNER_SESSION_KEY, 'true');
        }
    }, []);

    const handleClose = () => {
        setHiding(true);
        setTimeout(() => setVisible(false), 380);
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes bannerSlideDown {
                    from { max-height: 0; opacity: 0; }
                    to   { max-height: 80px; opacity: 1; }
                }
                @keyframes bannerSlideUp {
                    from { max-height: 80px; opacity: 1; }
                    to   { max-height: 0;   opacity: 0; }
                }
                .maintenance-banner-wrap {
                    overflow: hidden;
                    animation: bannerSlideDown 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .maintenance-banner-wrap.hiding {
                    animation: bannerSlideUp 0.38s cubic-bezier(0.7, 0, 0.84, 0) forwards;
                }
                .maintenance-banner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 11px 20px;
                    background: linear-gradient(90deg, #b91c1c 0%, #ea580c 55%, #b91c1c 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.12);
                    box-shadow: 0 2px 16px rgba(220, 38, 38, 0.3);
                    width: 100%;
                }
                .maintenance-banner__icon {
                    font-size: 17px;
                    flex-shrink: 0;
                    filter: drop-shadow(0 0 5px rgba(255,200,80,0.55));
                    animation: wrench-rock 1.8s ease-in-out infinite;
                }
                @keyframes wrench-rock {
                    0%, 100% { transform: rotate(0deg); }
                    20%      { transform: rotate(-15deg); }
                    40%      { transform: rotate(12deg); }
                    60%      { transform: rotate(-8deg); }
                    80%      { transform: rotate(5deg); }
                }
                .maintenance-banner__text {
                    font-family: 'Inter', 'Outfit', system-ui, sans-serif;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: #fff;
                    line-height: 1.45;
                    letter-spacing: 0.01em;
                    text-align: center;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.25);
                    flex: 1;
                    margin: 0;
                }
                .maintenance-banner__text strong {
                    font-weight: 700;
                }
                .maintenance-banner__close {
                    flex-shrink: 0;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.25);
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #fff;
                    font-size: 13px;
                    line-height: 1;
                    transition: background 0.2s, transform 0.15s;
                    padding: 0;
                }
                .maintenance-banner__close:hover {
                    background: rgba(255,255,255,0.28);
                    transform: scale(1.12);
                }
                @media (max-width: 600px) {
                    .maintenance-banner {
                        padding: 10px 14px;
                        gap: 9px;
                    }
                    .maintenance-banner__text {
                        font-size: 12px;
                    }
                    .maintenance-banner__icon {
                        font-size: 15px;
                    }
                }
            `}</style>

            <div className={`maintenance-banner-wrap${hiding ? ' hiding' : ''}`}>
                <div className="maintenance-banner" role="alert" aria-live="polite">
                    <span className="maintenance-banner__icon" aria-hidden="true">🔧</span>
                    <p className="maintenance-banner__text">
                        <strong>Avviso importante:</strong>{' '}
                        Informiamo i nostri stimati clienti che <strong>questo sabato</strong> il sito sarà temporaneamente offline per un importante aggiornamento del sistema.
                    </p>
                    <button
                        className="maintenance-banner__close"
                        aria-label="Chiudi avviso"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
}
