import { useCallback } from 'react';
import { fabric } from 'fabric';

const useDtfActions = ({ getCurrentCanvas, activeObject, setActiveObject }) => {

    const addImage = useCallback((e) => {
        const canvas = getCurrentCanvas();
        if (!canvas || !e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                fabric.Image.fromURL(event.target.result, (img) => {
                    const scale = Math.min(
                        (canvas.width * 0.8) / img.width,
                        (canvas.height * 0.8) / img.height
                    );
                    img.set({
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        originX: 'center',
                        originY: 'center',
                        scaleX: scale,
                        scaleY: scale,
                    });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                });
            };
            reader.readAsDataURL(file);
        });
        
        e.target.value = '';
    }, [getCurrentCanvas]);

    const addClipart = useCallback((svgString, color = '#ffffff') => {
        const canvas = getCurrentCanvas();
        if (!canvas) return;

        fabric.loadSVGFromString(svgString, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            const scale = Math.min(
                (canvas.width * 0.2) / obj.width,
                (canvas.height * 0.2) / obj.height
            );
            obj.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center',
                scaleX: scale,
                scaleY: scale,
            });

            const applyColor = (target, fillColor) => {
                if (target.isType('group')) {
                    target.forEachObject(o => applyColor(o, fillColor));
                } else {
                    target.set('fill', fillColor);
                }
            };

            if (color) {
                applyColor(obj, color);
            }

            canvas.add(obj);
            canvas.setActiveObject(obj);
            canvas.renderAll();
        });
    }, [getCurrentCanvas]);

    const deleteActiveObject = useCallback(() => {
        const canvas = getCurrentCanvas();
        if (!canvas || !activeObject) return;
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
        setActiveObject(null);
    }, [getCurrentCanvas, activeObject, setActiveObject]);

    const duplicateActiveObject = useCallback(() => {
        const canvas = getCurrentCanvas();
        if (!canvas || !activeObject) return;
        activeObject.clone((cloned) => {
            cloned.set({
                left: activeObject.left + 20,
                top: activeObject.top + 20,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
        });
    }, [getCurrentCanvas, activeObject]);

    const updateObjectProperty = useCallback((property, value) => {
        const canvas = getCurrentCanvas();
        if (!canvas || !activeObject) return;

        if (property === 'widthCm' || property === 'heightCm') {
            const valCm = parseFloat(value);
            if (isNaN(valCm) || valCm <= 0) return;

            const scale = canvas.cmToPxScale;
            const newSizePx = valCm * scale;
            const isWidth = property === 'widthCm';

            const currentWidth = activeObject.getScaledWidth();
            const currentHeight = activeObject.getScaledHeight();

            if (activeObject.lockUniScaling) {
                const aspectRatio = currentWidth / currentHeight;
                if (isWidth) {
                    activeObject.scaleToWidth(newSizePx);
                } else {
                    const newWidth = newSizePx * aspectRatio;
                    activeObject.scaleToWidth(newWidth);
                }
            } else {
                if (isWidth) {
                    activeObject.scaleToWidth(newSizePx, false);
                } else {
                    activeObject.scaleToHeight(newSizePx, false);
                }
            }
        } else {
            activeObject.set(property, value);
        }

        canvas.renderAll();
    }, [getCurrentCanvas, activeObject]);
    
    const addText = useCallback((type) => {
        const canvas = getCurrentCanvas();
        if (!canvas) return;

        let textObject;
        const commonProps = {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 48,
            fontFamily: 'Arial',
            fill: '#ffffff',
            padding: 10,
        };

        if (type === 'textbox') {
            textObject = new fabric.Textbox('Casella di Testo', {
                ...commonProps,
                width: canvas.width * 0.4,
                splitByGrapheme: true,
            });
        } else { // 'graphic'
            textObject = new fabric.IText('Testo Grafico', {
                ...commonProps,
            });
        }

        canvas.add(textObject);
        canvas.setActiveObject(textObject);
        canvas.renderAll();
    }, [getCurrentCanvas]);

    const alignActiveObject = useCallback((alignment) => {
        const canvas = getCurrentCanvas();
        if (!canvas || !activeObject) return;
        switch (alignment) {
            case 'center-h':
                activeObject.centerH();
                break;
            case 'center-v':
                activeObject.centerV();
                break;
            case 'left':
                activeObject.set('left', 0 + activeObject.getScaledWidth() / 2);
                break;
            case 'right':
                activeObject.set('left', canvas.width - activeObject.getScaledWidth() / 2);
                break;
            case 'top':
                activeObject.set('top', 0 + activeObject.getScaledHeight() / 2);
                break;
            case 'bottom':
                activeObject.set('top', canvas.height - activeObject.getScaledHeight() / 2);
                break;
            default:
                break;
        }
        activeObject.setCoords();
        canvas.renderAll();
    }, [getCurrentCanvas, activeObject]);

    const moveLayer = useCallback((direction) => {
        const canvas = getCurrentCanvas();
        if (!canvas || !activeObject) return;
        switch (direction) {
            case 'front':
                canvas.bringToFront(activeObject);
                break;
            case 'back':
                canvas.sendToBack(activeObject);
                break;
            case 'forward':
                canvas.bringForward(activeObject);
                break;
            case 'backward':
                canvas.sendBackwards(activeObject);
                break;
            default:
                break;
        }
        canvas.renderAll();
    }, [getCurrentCanvas, activeObject]);

    return {
        addImage,
        addClipart,
        deleteActiveObject,
        duplicateActiveObject,
        updateObjectProperty,
        addText,
        alignActiveObject,
        moveLayer
    };
};

export default useDtfActions;