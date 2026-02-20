
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';

/**
 * Injects a PNG pHYs chunk so that image editors (Photoshop etc.)
 * read the correct DPI from the file metadata.
 * The pHYs chunk is inserted right after the IHDR chunk (byte offset 33),
 * which is exactly where the PNG spec requires it to appear.
 */
const setPngDpiMetadata = (dataURL, dpi) => {
    // --- 1. Decode base64 → Uint8Array ---
    const base64 = dataURL.split(',')[1];
    const binaryStr = atob(base64);
    const src = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) src[i] = binaryStr.charCodeAt(i);

    // --- 2. Tiny CRC-32 (needed to produce a valid PNG chunk) ---
    const crcTable = (() => {
        const t = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            t[n] = c;
        }
        return t;
    })();
    const crc32 = (buf) => {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
    };

    // --- 3. Build the pHYs chunk ---
    // 300 DPI → pixels per metre = round(300 / 0.0254) = 11811
    const ppm = Math.round(dpi / 0.0254);
    const TYPE = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // 'pHYs'
    const data = new Uint8Array(9);
    const dv = new DataView(data.buffer);
    dv.setUint32(0, ppm);  // pixels per unit X
    dv.setUint32(4, ppm);  // pixels per unit Y
    data[8] = 1;           // unit: metre
    const crcInput = new Uint8Array(13);
    crcInput.set(TYPE, 0);
    crcInput.set(data, 4);
    const checksum = crc32(crcInput);
    const chunk = new Uint8Array(4 + 4 + 9 + 4); // length + type + data + crc
    const cv = new DataView(chunk.buffer);
    cv.setUint32(0, 9);         // data length = 9
    chunk.set(TYPE, 4);
    chunk.set(data, 8);
    cv.setUint32(17, checksum); // CRC

    // --- 4. Splice pHYs in after IHDR (offset 33 = 8-byte sig + 25-byte IHDR) ---
    const INSERT_AT = 33;
    const out = new Uint8Array(src.length + chunk.length);
    out.set(src.slice(0, INSERT_AT), 0);
    out.set(chunk, INSERT_AT);
    out.set(src.slice(INSERT_AT), INSERT_AT + chunk.length);

    // --- 5. Re-encode to base64 dataURL ---
    let bin = '';
    out.forEach(b => (bin += String.fromCharCode(b)));
    return 'data:image/png;base64,' + btoa(bin);
};

export const useCanvasActions = (fabricCanvasRef, saveState, activeObject, designState) => {
    const addImage = useCallback((imageFile) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !imageFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            fabric.Image.fromURL(e.target.result, (img) => {
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
                saveState();
            });
        };
        reader.readAsDataURL(imageFile);
    }, [fabricCanvasRef, saveState]);

    const addText = useCallback((type, color = '#000000') => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        let textObject;
        const commonProps = {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 48,
            fontFamily: 'Arial',
            fill: color,
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
                lockUniScaling: true,
            });
        }

        canvas.add(textObject);
        canvas.setActiveObject(textObject);
        canvas.renderAll();
        saveState();
    }, [fabricCanvasRef, saveState]);

    const deleteActiveObject = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !activeObject) return;
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
        saveState();
    }, [fabricCanvasRef, activeObject, saveState]);

    const addClipart = useCallback((svgString, color) => {
        const canvas = fabricCanvasRef.current;
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
            saveState();
        });
    }, [fabricCanvasRef, saveState]);

    const updateProperty = useCallback((property, value, isFinal = true) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !activeObject) return;

        if (property === 'widthCm' || property === 'heightCm') {
            const valCm = parseFloat(value);
            if (isNaN(valCm) || valCm <= 0) return;

            const scale = canvas.cmToPxScale;
            const newSizePx = valCm * scale;

            const isWidth = property === 'widthCm';

            if (activeObject.isType('textbox')) {
                if (isWidth) {
                    activeObject.set('width', newSizePx / activeObject.scaleX);
                } else {
                    // Height is controlled by content for textbox
                }
            } else if (activeObject.isType('i-text')) {
                // For graphic text, always scale proportionally based on width
                if (isWidth) {
                    activeObject.scaleToWidth(newSizePx);
                }
            } else if (activeObject.lockUniScaling) {
                if (isWidth) {
                    activeObject.scaleToWidth(newSizePx);
                } else {
                    activeObject.scaleToHeight(newSizePx);
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
        if (isFinal) {
            saveState();
        }
    }, [fabricCanvasRef, activeObject, saveState]);

    const alignActiveObject = useCallback((alignment) => {
        const canvas = fabricCanvasRef.current;
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
        saveState();
    }, [fabricCanvasRef, activeObject, saveState]);

    const moveLayer = useCallback((direction) => {
        const canvas = fabricCanvasRef.current;
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
        saveState();
    }, [fabricCanvasRef, activeObject, saveState]);

    const updateBackground = useCallback((props) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        if (props.backgroundColor) {
            canvas.setBackgroundColor(props.backgroundColor, canvas.renderAll.bind(canvas));
        }
        if (props.backgroundImage) {
            fabric.Image.fromURL(props.backgroundImage, (img) => {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    scaleX: canvas.width / img.width,
                    scaleY: canvas.height / img.height,
                });
            });
        }
        saveState();
    }, [fabricCanvasRef, saveState]);

    const prepareCanvasForExport = useCallback((isFinalSave = false) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return { cleanup: () => { } };

        const originalProps = new Map();
        canvas.getObjects().forEach(obj => {
            if (obj.guideType) {
                originalProps.set(obj, { visible: obj.visible, excludeFromExport: obj.excludeFromExport });
                if (isFinalSave) {
                    // For final save, only show eyelets if the option is selected
                    const showEyelets = designState.product.type === 'banner' && designState.extras.some(e => e.name.includes('Occhielli'));
                    if (obj.guideType === 'eyelet' && showEyelets) {
                        obj.set('visible', true);
                        obj.set('excludeFromExport', false);
                    } else {
                        obj.set('visible', false);
                        obj.set('excludeFromExport', true);
                    }
                } else {
                    // For PNG/PDF download, always show eyelets for banners
                    if (obj.guideType === 'eyelet' && designState.product.type === 'banner') {
                        obj.set('visible', true);
                        obj.set('excludeFromExport', false);
                    } else {
                        obj.set('visible', false);
                        obj.set('excludeFromExport', true);
                    }
                }
            }
        });
        canvas.renderAll();

        const cleanup = () => {
            originalProps.forEach((props, obj) => {
                obj.set('visible', props.visible);
                obj.set('excludeFromExport', props.excludeFromExport);
            });
            canvas.renderAll();
        };

        return { cleanup };
    }, [fabricCanvasRef, designState]);

    const downloadAsPng = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !designState) return;

        const { cleanup } = prepareCanvasForExport(false);

        const DPI = 300;
        const multiplier = DPI / 72;

        const rawDataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0,
            multiplier: multiplier,
        });

        cleanup();

        // Embed the 300 DPI value into the PNG pHYs metadata chunk
        const dataURL = setPngDpiMetadata(rawDataURL, DPI);

        const link = document.createElement('a');
        link.download = 'printora_design_300dpi.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [fabricCanvasRef, designState, prepareCanvasForExport]);

    const downloadAsPdf = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas || !designState) return;

        const { cleanup } = prepareCanvasForExport(false);

        const { width, height, product } = designState;
        const DPI = 300;
        const multiplier = DPI / 72;

        const dataURL = canvas.toDataURL({
            format: 'png',
            multiplier: multiplier,
        });

        cleanup();

        const doc = new jsPDF({
            orientation: width > height ? 'l' : 'p',
            unit: 'cm',
            format: [width, height],
        });

        doc.addImage(dataURL, 'PNG', 0, 0, width, height);

        const productName = product?.name.replace(/\s+/g, '_') || 'design';
        const dimensions = `${width}x${height}cm`;
        doc.save(`printora_${productName}_${dimensions}_300dpi.pdf`);

    }, [fabricCanvasRef, designState, prepareCanvasForExport]);

    return {
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
