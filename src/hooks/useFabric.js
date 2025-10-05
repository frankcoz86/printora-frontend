import { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { drawGuides } from '@/components/designer/utils';

const useFabric = (designState) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [activeObject, setActiveObject] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    const saveState = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !canvas.getObjects) return;
        const json = canvas.toJSON(['selectable', 'evented', 'excludeFromExport', 'lockUniScaling']);
        const currentHistory = history.slice(0, historyIndex + 1);
        const newHistory = [...currentHistory, json];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    useEffect(() => {
        if (!designState || !canvasRef.current || fabricCanvasRef.current) {
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

        if (parentWidth === 0 || parentHeight === 0) return;

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
        fabricCanvasRef.current = fCanvas;

        drawGuides(fCanvas, { ...designState, width: originalWidth, height: originalHeight });
        
        saveState();
        setIsCanvasReady(true);

        const handleSelection = (e) => {
            const target = e.target || fCanvas.getActiveObject();
            if (target) {
                if (typeof target.lockUniScaling === 'undefined') {
                    target.set('lockUniScaling', true);
                }
            }
            setActiveObject(fCanvas.getActiveObject());
        };
        const handleModification = () => saveState();
        
        fCanvas.on('selection:created', handleSelection);
        fCanvas.on('selection:updated', handleSelection);
        fCanvas.on('selection:cleared', () => setActiveObject(null));
        fCanvas.on('object:modified', handleModification);

        const resizeObserver = new ResizeObserver(() => {
            if (fabricCanvasRef.current) {
                // Future resize logic can be placed here
            }
        });
        resizeObserver.observe(parent);

        return () => {
            resizeObserver.disconnect();
            fCanvas.off('selection:created', handleSelection);
            fCanvas.off('selection:updated', handleSelection);
            fCanvas.off('selection:cleared', handleModification);
            fCanvas.off('object:modified');
            if (fCanvas) {
                fCanvas.dispose();
                fabricCanvasRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [designState]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const canvas = fabricCanvasRef.current;
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                canvas.renderAll();
                setActiveObject(canvas.getActiveObject());
            });
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const canvas = fabricCanvasRef.current;
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                canvas.renderAll();
                setActiveObject(canvas.getActiveObject());
            });
        }
    }, [history, historyIndex]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return { 
        canvasRef, 
        fabricCanvasRef, 
        activeObject,
        isCanvasReady,
        saveState,
        undo,
        redo,
        canUndo,
        canRedo,
    };
};

export default useFabric;