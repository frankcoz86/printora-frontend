import { useState, useEffect, useCallback } from 'react';

export const useCanvasHistory = (fabricCanvasRef, isCanvasReady) => {
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const saveState = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !canvas.getObjects) return;
        const json = canvas.toJSON(['selectable', 'evented', 'excludeFromExport', 'lockUniScaling']);
        const currentHistory = history.slice(0, historyIndex + 1);
        const newHistory = [...currentHistory, json];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, fabricCanvasRef]);
    
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if(!canvas || !isCanvasReady) return;

        const handleModification = () => saveState();
        canvas.on('object:modified', handleModification);

        if(history.length === 0 && canvas.getObjects) {
             saveState();
        }

        return () => {
            if(canvas) {
                canvas.off('object:modified', handleModification);
            }
        }

    }, [isCanvasReady, fabricCanvasRef, saveState, history.length]);


    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const canvas = fabricCanvasRef.current;
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                canvas.renderAll();
            });
        }
    }, [history, historyIndex, fabricCanvasRef]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const canvas = fabricCanvasRef.current;
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            canvas.loadFromJSON(history[newIndex], () => {
                canvas.renderAll();
            });
        }
    }, [history, historyIndex, fabricCanvasRef]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return { saveState, undo, redo, canUndo, canRedo };
};