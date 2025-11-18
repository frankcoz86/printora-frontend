import React, { forwardRef, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DtfRulerCanvas = forwardRef(({ fabricCanvas, orientation }, ref) => {
    useEffect(() => {
        if (!fabricCanvas || !ref.current) return;

        const canvas = fabricCanvas;
        const rulerEl = ref.current;
        const ctx = rulerEl.getContext('2d');
        
        const drawRuler = () => {
            const width = canvas.width;
            const height = canvas.height;
            const originalWidthCm = canvas.originalWidth;
            const originalHeightCm = canvas.originalHeight;
            const scale = canvas.cmToPxScale;

            if (orientation === 'horizontal') {
                rulerEl.width = width;
                rulerEl.height = 20;
            } else {
                rulerEl.width = 20;
                rulerEl.height = height;
            }

            ctx.clearRect(0, 0, rulerEl.width, rulerEl.height);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px sans-serif';
            ctx.strokeStyle = '#475569';

            const drawLine = (x1, y1, x2, y2) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            };

            if (orientation === 'horizontal') {
                for (let i = 0; i <= originalWidthCm; i++) {
                    const x = i * scale;
                    const isMajor = i % 10 === 0;
                    const isMinor = i % 5 === 0;
                    const tickHeight = isMajor ? 10 : (isMinor ? 7 : 4);
                    drawLine(x, 20, x, 20 - tickHeight);
                    if (isMajor && i > 0) {
                        ctx.fillText(i, x + 2, 10);
                    }
                }
            } else {
                for (let i = 0; i <= originalHeightCm; i++) {
                    const y = i * scale;
                    const isMajor = i % 10 === 0;
                    const isMinor = i % 5 === 0;
                    const tickWidth = isMajor ? 10 : (isMinor ? 7 : 4);
                    drawLine(20, y, 20 - tickWidth, y);
                    if (isMajor && i > 0) {
                        ctx.save();
                        ctx.translate(10, y + 2);
                        ctx.rotate(-Math.PI / 2);
                        ctx.fillText(i, 0, 0);
                        ctx.restore();
                    }
                }
            }
        };

        drawRuler();
        const observer = new ResizeObserver(drawRuler);
        const parentEl = canvas.wrapperEl.closest('.dtf-canvas-container');
        if (parentEl) {
            observer.observe(parentEl);
        }

        return () => {
            observer.disconnect();
        };
    }, [fabricCanvas, orientation, ref]);

    return <canvas ref={ref} />;
});


const DtfCanvasArea = ({ canvases, canvasRefs, fabricCanvasRefs, currentCanvasIndex, setCurrentCanvasIndex }) => {
    const horizontalRulerRef = useRef(null);
    const verticalRulerRef = useRef(null);
    const currentFabricCanvas = fabricCanvasRefs.current[currentCanvasIndex];

    return (
        <main className="flex-1 flex items-center justify-center p-2 md:p-8 bg-slate-800/50 relative overflow-auto dtf-canvas-container" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            <div className="relative">
                <div className="absolute bottom-full left-0 bg-slate-700" style={{ left: '0', top: '-20px' }}>
                    <DtfRulerCanvas ref={horizontalRulerRef} fabricCanvas={currentFabricCanvas} orientation="horizontal" />
                </div>
                <div className="absolute right-full top-0 bg-slate-700" style={{ top: '0', left: '-20px' }}>
                    <DtfRulerCanvas ref={verticalRulerRef} fabricCanvas={currentFabricCanvas} orientation="vertical" />
                </div>
                <div className="absolute right-full bottom-full w-[20px] h-[20px] bg-slate-800" style={{ top: '-20px', left: '-20px' }} />
                <div className="shadow-2xl border-2 border-slate-600 relative" style={{backgroundImage: 'url(/assets/transparent-bg-dark.png)', backgroundRepeat: 'repeat'}}>
                    {canvases.map((_, index) => (
                        <canvas key={index} ref={el => canvasRefs.current[index] = el} style={{ display: index === currentCanvasIndex ? 'block' : 'none' }} />
                    ))}
                </div>
            </div>
            {canvases.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentCanvasIndex(i => Math.max(0, i - 1))} disabled={currentCanvasIndex === 0}><ChevronLeft /></Button>
                    <span className="font-semibold text-sm tabular-nums">Telo {currentCanvasIndex + 1} / {canvases.length}</span>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentCanvasIndex(i => Math.min(canvases.length - 1, i + 1))} disabled={currentCanvasIndex === canvases.length - 1}><ChevronRight /></Button>
                </div>
            )}
        </main>
    );
};

export default DtfCanvasArea;