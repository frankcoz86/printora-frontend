import React, { useState } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/components/ui/use-toast';
import MultiplierTool from '@/components/designer/MultiplierTool';

const DtfMultiplierTab = ({ fabricCanvasRefs, setCanvases, designState, canvasRef }) => {
    const [multiplierLogos, setMultiplierLogos] = useState([]);
    const [isApplyingMultiplier, setIsApplyingMultiplier] = useState(false);

    const applyMultiplier = async () => {
        if (multiplierLogos.length === 0 || !designState) return;
        setIsApplyingMultiplier(true);

        try {
            const canvasTemplate = fabricCanvasRefs.current[0] || canvasRef;
            if (!canvasTemplate) {
                toast({ title: "Errore", description: "Canvas non inizializzato.", variant: "destructive" });
                setIsApplyingMultiplier(false);
                return;
            }

            const canvasWidth = canvasTemplate.width;
            const canvasHeight = canvasTemplate.height;
            const cmToPxScale = canvasTemplate.cmToPxScale;

            const allImagesToPlace = [];
            for (const logo of multiplierLogos) {
                const img = await new Promise(resolve => fabric.Image.fromURL(logo.src, img => resolve(img)));
                for (let i = 0; i < logo.count; i++) {
                    allImagesToPlace.push({ img, logo });
                }
            }

            const layouts = [];
            let currentLayout = [];
            let currentX = 0;
            let currentY = 0;
            let rowMaxHeight = 0;

            for (const { img, logo } of allImagesToPlace) {
                const spacingXPx = (logo.spacingX / 10) * cmToPxScale;
                const spacingYPx = (logo.spacingY / 10) * cmToPxScale;
                const imgWidthPx = logo.width * cmToPxScale;
                
                img.scaleToWidth(imgWidthPx);
                const imgHeightPx = img.getScaledHeight();

                if (currentX === 0) { 
                    currentX = spacingXPx;
                    currentY = currentY === 0 ? spacingYPx : currentY + rowMaxHeight + spacingYPx;
                    rowMaxHeight = 0;
                }

                if (currentX + imgWidthPx + spacingXPx > canvasWidth) {
                    currentX = spacingXPx;
                    currentY += rowMaxHeight + spacingYPx;
                    rowMaxHeight = 0;
                }

                if (currentY + imgHeightPx + spacingYPx > canvasHeight) {
                    if (currentLayout.length > 0) layouts.push(currentLayout);
                    currentLayout = [];
                    currentX = spacingXPx;
                    currentY = spacingYPx;
                    rowMaxHeight = 0;
                }
                
                rowMaxHeight = Math.max(rowMaxHeight, imgHeightPx);
                
                const clonedImg = fabric.util.object.clone(img);
                clonedImg.set({ left: currentX, top: currentY });
                currentLayout.push(clonedImg);

                currentX += imgWidthPx + spacingXPx;
            }
            if (currentLayout.length > 0) {
                layouts.push(currentLayout);
            }

            setCanvases(Array(layouts.length).fill({}));

            await new Promise(resolve => setTimeout(resolve, 100));

            fabricCanvasRefs.current.forEach((canvas, index) => {
                if (canvas) {
                    canvas.clear();
                    if (layouts[index]) {
                        layouts[index].forEach(obj => canvas.add(obj));
                    }
                    canvas.renderAll();
                }
            });
            
            toast({
                title: "Layout Applicato!",
                description: `Sono stati creati ${layouts.length} teli.`
            });

        } catch (error) {
            console.error("Error applying multiplier:", error);
            toast({ title: "Errore", description: "Si è verificato un errore durante l'applicazione della serie.", variant: "destructive" });
        } finally {
            setIsApplyingMultiplier(false);
        }
    };

    return (
        <MultiplierTool 
            logos={multiplierLogos} 
            setLogos={setMultiplierLogos} 
            onApply={applyMultiplier}
            isApplying={isApplyingMultiplier}
        />
    );
};

export default DtfMultiplierTab;