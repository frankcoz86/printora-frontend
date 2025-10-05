import { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';

const useDtfCanvas = (designState, isReady) => {
    const canvasRefs = useRef([]);
    const fabricCanvasRefs = useRef([]);
    const [canvases, setCanvases] = useState([{}]);
    const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
    const [activeObject, setActiveObject] = useState(null);

    const initCanvas = useCallback((canvasEl, index, json) => {
        if (!designState || !canvasEl || fabricCanvasRefs.current[index]) return;
        
        const parent = canvasEl.closest('.dtf-canvas-container');
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        let canvasWidth, canvasHeight;
        
        const canvasAspectRatio = designState.width / designState.height;
        const parentAspectRatio = parentWidth / parentHeight;

        if (canvasAspectRatio > parentAspectRatio) {
            canvasWidth = parentWidth * 0.85;
            canvasHeight = canvasWidth / canvasAspectRatio;
        } else {
            canvasHeight = parentHeight * 0.85;
            canvasWidth = canvasHeight * canvasAspectRatio;
        }

        const fCanvas = new fabric.Canvas(canvasEl, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            preserveObjectStacking: true,
        });

        fabricCanvasRefs.current[index] = fCanvas;
        fCanvas.cmToPxScale = canvasWidth / designState.width;
        fCanvas.originalWidth = designState.width;
        fCanvas.originalHeight = designState.height;

        if (json) {
            fCanvas.loadFromJSON(json, fCanvas.renderAll.bind(fCanvas));
        }

        const updateActiveObject = () => setActiveObject(fCanvas.getActiveObject());
        fCanvas.on('selection:created', updateActiveObject);
        fCanvas.on('selection:updated', updateActiveObject);
        fCanvas.on('selection:cleared', () => setActiveObject(null));
        
        fCanvas.on('mouse:down', () => {
            if (fabricCanvasRefs.current.indexOf(fCanvas) !== currentCanvasIndex) {
                 setCurrentCanvasIndex(fabricCanvasRefs.current.indexOf(fCanvas));
                 setActiveObject(fCanvas.getActiveObject());
            }
        });

        return fCanvas;
    }, [designState, currentCanvasIndex]);
    
    useEffect(() => {
        if (!isReady) return;
        
        const newFabricCanvases = canvasRefs.current.map((canvasEl, index) => {
            if (canvasEl && !fabricCanvasRefs.current[index]) {
                return initCanvas(canvasEl, index, canvases[index]?.json);
            }
            return fabricCanvasRefs.current[index];
        });

        fabricCanvasRefs.current.forEach((c, i) => {
            if (c && !canvasRefs.current[i]) {
                c.dispose();
            }
        });
        
        fabricCanvasRefs.current = newFabricCanvases.filter(Boolean);

    }, [canvases, isReady, initCanvas]);


    const getCurrentCanvas = useCallback(() => {
        return fabricCanvasRefs.current[currentCanvasIndex];
    }, [currentCanvasIndex]);

    const downloadAllAsPng = useCallback(() => {
        if (!fabricCanvasRefs.current || fabricCanvasRefs.current.length === 0 || fabricCanvasRefs.current.every(c => !c || c.getObjects().length === 0)) {
            return false;
        }

        const multiplier = 300 / 72; // High resolution

        fabricCanvasRefs.current.forEach((canvas, index) => {
            if (!canvas || canvas.getObjects().length === 0) return;

            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0,
                multiplier: multiplier,
            });
        
            const link = document.createElement('a');
            const productName = designState?.product?.name.replace(/\s+/g, '_') || 'design';
            const dimensions = `${designState?.width}x${designState?.height}cm`;
            const sheetNumber = index + 1;
            link.download = `printora_${productName}_${dimensions}_telo_${sheetNumber}_300dpi.png`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        return true;
    }, [fabricCanvasRefs, designState]);

    return {
        canvasRefs,
        fabricCanvasRefs,
        canvases,
        setCanvases,
        currentCanvasIndex,
        setCurrentCanvasIndex,
        activeObject,
        setActiveObject,
        getCurrentCanvas,
        downloadAllAsPng,
    };
};

export default useDtfCanvas;