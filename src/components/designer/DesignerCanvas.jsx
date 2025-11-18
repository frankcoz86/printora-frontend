import React, { forwardRef, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DesignerCanvas = forwardRef(({ fabricCanvas, isReady }, ref) => {
    const horizontalRulerRef = useRef(null);
    const verticalRulerRef = useRef(null);
    const canvasWrapperRef = useRef(null);

    useEffect(() => {
        if (!isReady || !fabricCanvas || !horizontalRulerRef.current || !verticalRulerRef.current) return;

        const canvas = fabricCanvas;
        const hruler = horizontalRulerRef.current;
        const vruler = verticalRulerRef.current;
        const hCtx = hruler.getContext('2d');
        const vCtx = vruler.getContext('2d');
        
        if (!hCtx || !vCtx) return;

        const drawRulers = () => {
            if (!canvasWrapperRef.current || !canvasWrapperRef.current.parentElement) return;

            const canvasRect = canvasWrapperRef.current.getBoundingClientRect();
            const parentRect = canvasWrapperRef.current.parentElement.getBoundingClientRect();

            const canvasLeft = canvasRect.left - parentRect.left;
            const canvasTop = canvasRect.top - parentRect.top;

            const originalWidthCm = canvas.originalWidth;
            const originalHeightCm = canvas.originalHeight;
            const scale = canvas.cmToPxScale;

            hruler.width = parentRect.width;
            hruler.height = 20;
            vruler.width = 20;
            vruler.height = parentRect.height;

            hruler.style.left = '0px';
            hruler.style.top = `${canvasTop - 20}px`;
            vruler.style.left = `${canvasLeft - 20}px`;
            vruler.style.top = '0px';

            hCtx.clearRect(0, 0, hruler.width, hruler.height);
            vCtx.clearRect(0, 0, vruler.width, vruler.height);

            hCtx.fillStyle = '#94a3b8';
            vCtx.fillStyle = '#94a3b8';
            hCtx.font = '10px sans-serif';
            vCtx.font = '10px sans-serif';
            hCtx.strokeStyle = '#475569';
            vCtx.strokeStyle = '#475569';

            const drawLine = (ctx, x1, y1, x2, y2) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            };

            for (let i = 0; i <= originalWidthCm; i++) {
                const x = canvasLeft + (i * scale);
                const isMajor = i % 10 === 0;
                const isMinor = i % 5 === 0;
                const tickHeight = isMajor ? 10 : (isMinor ? 7 : 4);
                drawLine(hCtx, x, 20, x, 20 - tickHeight);
                if (isMajor && i > 0) {
                    hCtx.fillText(i, x + 2, 10);
                }
            }

            for (let i = 0; i <= originalHeightCm; i++) {
                const y = canvasTop + (i * scale);
                const isMajor = i % 10 === 0;
                const isMinor = i % 5 === 0;
                const tickWidth = isMajor ? 10 : (isMinor ? 7 : 4);
                drawLine(vCtx, 20, y, 20 - tickWidth, y);
                if (isMajor && i > 0) {
                    vCtx.save();
                    vCtx.translate(10, y + 2);
                    vCtx.rotate(-Math.PI / 2);
                    vCtx.fillText(i, 0, 0);
                    vCtx.restore();
                }
            }
        };

        drawRulers();
        const observer = new ResizeObserver(drawRulers);
        if (canvasWrapperRef.current?.parentElement) {
            observer.observe(canvasWrapperRef.current.parentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [fabricCanvas, isReady]);

    return (
        <main className="flex-1 flex items-center justify-center p-8 bg-gray-800/50 relative overflow-auto"
            style={{
                backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                width: '100%',
                height: '100%',
                '@media (min-width: 768px)': { width: 'auto', height: 'auto' }
            }}
        >
            {isReady && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <canvas ref={horizontalRulerRef} className="absolute bg-slate-700 z-10" />
                    <canvas ref={verticalRulerRef} className="absolute bg-slate-700 z-10" />
                    <div className="absolute bg-slate-800 z-20" style={{ left: '0px', top: '0px', width: '20px', height: '20px' }} />
                </motion.div>
            )}
            <div className="relative shadow-2xl border-2 border-slate-600 bg-white" ref={canvasWrapperRef}>
                <canvas ref={ref} />
            </div>
        </main>
    );
});

export default DesignerCanvas;