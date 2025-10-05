import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { drawGuides } from '@/components/designer/utils';

export const useCanvasSetup = (designState, canvasRef, fabricCanvasRef) => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    useEffect(() => {
        if (!designState || !canvasRef.current || fabricCanvasRef.current) {
            if (fabricCanvasRef.current) setIsCanvasReady(true);
            return;
        }

        const originalWidth = designState.width;
        let originalHeight = designState.height;

        if (designState.product.type === 'rollup') {
            originalHeight = 210;
        }

        const canvasElement = canvasRef.current;
        const parent = canvasElement.closest('.flex-1');
        
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        let canvasWidth, canvasHeight;

        const canvasAspectRatio = originalWidth / originalHeight;
        const parentAspectRatio = parentWidth / parentHeight;

        if (canvasAspectRatio > parentAspectRatio) {
            canvasWidth = parentWidth * 0.9;
            canvasHeight = canvasWidth / canvasAspectRatio;
        } else {
            canvasHeight = parentHeight * 0.9;
            canvasWidth = canvasHeight * canvasAspectRatio;
        }

        const fCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
        });

        fCanvas.originalWidth = originalWidth;
        fCanvas.originalHeight = originalHeight;
        fCanvas.cmToPxScale = canvasWidth / originalWidth;
        fCanvas.productType = designState.product.type;
        fabricCanvasRef.current = fCanvas;

        drawGuides(fCanvas, { ...designState, width: originalWidth, height: originalHeight });
        
        setIsCanvasReady(true);

        return () => {
            if (fCanvas) {
                fCanvas.dispose();
                fabricCanvasRef.current = null;
                setIsCanvasReady(false);
            }
        };
    }, [designState, canvasRef, fabricCanvasRef]);

    return isCanvasReady;
};