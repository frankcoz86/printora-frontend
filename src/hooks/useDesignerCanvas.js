
import { useRef } from 'react';
import { useCanvasSetup } from '@/hooks/useCanvasSetup';
import { useCanvasSelection } from '@/hooks/useCanvasSelection';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasActions } from '@/hooks/useCanvasActions';

export const useDesignerCanvas = (designState) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);

    const isCanvasReady = useCanvasSetup(designState, canvasRef, fabricCanvasRef);
    
    const { activeObject } = useCanvasSelection(fabricCanvasRef, isCanvasReady);
    
    const { saveState, undo, redo, canUndo, canRedo } = useCanvasHistory(fabricCanvasRef, isCanvasReady);

    const {
        addImage,
        addText,
        deleteActiveObject,
        addClipart,
        updateProperty,
        alignActiveObject,
        moveLayer,
        updateBackground,
        downloadAsPng,
        downloadAsPdf,
        prepareCanvasForExport,
    } = useCanvasActions(fabricCanvasRef, saveState, activeObject, designState);

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
        addImage,
        addText,
        deleteActiveObject,
        addClipart,
        updateProperty,
        alignActiveObject,
        moveLayer,
        updateBackground,
        downloadAsPng,
        downloadAsPdf,
        prepareCanvasForExport,
    };
};
  