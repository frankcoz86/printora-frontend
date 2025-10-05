import { useState, useEffect } from 'react';

export const useCanvasSelection = (fabricCanvasRef, isCanvasReady) => {
    const [activeObject, setActiveObject] = useState(null);

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !isCanvasReady) return;

        const handleSelection = (e) => {
            const selection = e.selected ? e.selected[0] : e.target;
            if (selection) {
                if (typeof selection.lockUniScaling === 'undefined') {
                    selection.set('lockUniScaling', true);
                }
            }
            setActiveObject(canvas.getActiveObject());
        };

        const handleCleared = () => setActiveObject(null);

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleCleared);

        return () => {
            if (canvas) {
                canvas.off('selection:created', handleSelection);
                canvas.off('selection:updated', handleSelection);
                canvas.off('selection:cleared', handleCleared);
            }
        };
    }, [fabricCanvasRef, isCanvasReady]);

    return { activeObject, setActiveObject };
};