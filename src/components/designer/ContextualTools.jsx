import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Sparkles, Bold, Italic, Palette, Droplet, Layers, ArrowUp, ArrowDown, FlipHorizontal, FlipVertical, Ruler, Paintbrush, Image as ImageIcon, Lock, Unlock, RotateCw, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, AlignLeft, AlignRight, AlignLeft as AlignTop, PanelBottom, ChevronsUp, ChevronsDown, Type } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ColorPicker from '@/components/CmykColorPicker';

const PRESET_COLORS = [
    '#ffffff', '#000000', '#e03131', '#c92a2a', '#1864ab', '#fcc419', '#e67700', '#212529', '#343a40', '#2f9e44', '#a9e34b', '#111827', '#2dd4bf', '#495057'
];

export const BackgroundTools = ({ canvasRef, updateBackground }) => {
    const canvas = canvasRef?.current;
    if (!canvas) return null;

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700 mt-4">
            <h3 className="text-md font-semibold border-b border-slate-600 pb-2 flex items-center">
                <Paintbrush className="mr-2 h-4 w-4 text-cyan-300"/> Modifica Sfondo
            </h3>
            <div className="space-y-2">
                <Label className="text-sm">Colore di Sfondo</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 w-full justify-start" style={{ background: canvas.backgroundColor, color: '#fff' }}>
                            {canvas.backgroundColor}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0" side="bottom">
                        <ColorPicker color={canvas.backgroundColor || '#ffffff'} onChange={(color) => updateBackground({ backgroundColor: color })} />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label className="text-sm flex items-center"><ImageIcon className="mr-2 h-4 w-4"/> Immagine di Sfondo</Label>
                <Input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (f) => updateBackground({ backgroundImage: f.target.result });
                        reader.readAsDataURL(file);
                    }}
                    className="w-full text-xs text-slate-400 file:bg-slate-700 file:border-none file:text-white file:rounded file:mr-2 file:px-2 file:py-1"
                />
            </div>
        </div>
    );
};

const ObjectTools = ({ activeObject, updateProperty, canvasRef, fontFamilies, alignActiveObject, moveLayer }) => {
    const [dimensions, setDimensions] = useState({ widthCm: 0, heightCm: 0 });
    const [angle, setAngle] = useState(0);
    const [isLocked, setIsLocked] = useState(activeObject ? activeObject.lockUniScaling : false);
    const [textValue, setTextValue] = useState(activeObject?.text || '');
    const canvas = canvasRef.current;

    const isText = activeObject?.isType('textbox') || activeObject?.isType('i-text');
    const isTextbox = activeObject?.isType('textbox');
    const isGraphicText = activeObject?.isType('i-text');

    const getObjectDimensions = useCallback(() => {
        if (!activeObject || !canvas?.cmToPxScale) return { widthCm: 0, heightCm: 0 };
        const scale = canvas.cmToPxScale;
        
        if (activeObject.isType('i-text') && activeObject.aCoords) {
             const { tl, tr, bl } = activeObject.aCoords;
             const widthPx = Math.sqrt(Math.pow(tr.x - tl.x, 2) + Math.pow(tr.y - tl.y, 2));
             const heightPx = Math.sqrt(Math.pow(bl.x - tl.x, 2) + Math.pow(bl.y - tl.y, 2));
             const widthCm = (widthPx / scale).toFixed(2);
             const heightCm = (heightPx / scale).toFixed(2);
             return { widthCm, heightCm };
        }

        const widthPx = activeObject.getScaledWidth();
        const heightPx = activeObject.getScaledHeight();
        
        const widthCm = (widthPx / scale).toFixed(2);
        const heightCm = (heightPx / scale).toFixed(2);
        return { widthCm, heightCm };
    }, [activeObject, canvas]);

    useEffect(() => {
        if (activeObject && canvas) {
            const updateVisuals = () => {
                setDimensions(getObjectDimensions());
                setAngle(Math.round(activeObject.angle || 0));
            };
            
            updateVisuals();
            setIsLocked(activeObject.lockUniScaling);
            if (isText) {
                setTextValue(activeObject.text);
            }

            activeObject.on('rotating', updateVisuals);
            activeObject.on('scaling', updateVisuals);
            activeObject.on('modified', updateVisuals);
            if (isText) {
                activeObject.on('changed', updateVisuals);
            }

            return () => {
                if (activeObject) {
                    activeObject.off('rotating', updateVisuals);
                    activeObject.off('scaling', updateVisuals);
                    activeObject.off('modified', updateVisuals);
                    if (isText) {
                        activeObject.off('changed', updateVisuals);
                    }
                }
            };
        }
    }, [activeObject, canvas, isText, getObjectDimensions]);

    if (!activeObject || !canvas) return null;

    const isShape = ['rect', 'circle', 'triangle', 'path', 'group'].some(type => activeObject.isType(type));
    const isImage = activeObject.isType('image');

    const toggleStyle = (prop, trueVal, falseVal) => {
        const currentVal = activeObject.get(prop);
        updateProperty(prop, currentVal === trueVal ? falseVal : trueVal);
    };

    const flip = (axis) => {
        updateProperty(axis, !activeObject.get(axis));
    };

    const applyFill = (color) => {
        if (activeObject.isType('group')) {
            activeObject.getObjects().forEach(obj => {
                if (obj.isType('path') || obj.isType('textbox') || obj.isType('i-text') || obj.isType('rect') || obj.isType('circle') || obj.isType('triangle')) {
                   obj.set('fill', color);
                }
            });
        } else {
            updateProperty('fill', color);
        }
        canvas.requestRenderAll();
    }

    const handleDimensionChange = (dim, value) => {
        const prop = dim === 'width' ? 'widthCm' : 'heightCm';
        setDimensions(prev => ({...prev, [prop]: value}));
        updateProperty(prop, value);
    };

    const toggleLock = () => {
        const newLockState = !isLocked;
        setIsLocked(newLockState);
        updateProperty('lockUniScaling', newLockState);
    };
    
    const handleTextChange = (e) => {
        setTextValue(e.target.value);
        updateProperty('text', e.target.value);
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700 mt-4">
            <h3 className="text-md font-semibold border-b border-slate-600 pb-2">Proprietà Oggetto Selezionato</h3>
            
            <div className="space-y-3 bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <Label className="text-sm flex items-center text-cyan-300"><Ruler className="mr-2 h-4 w-4" /> Dimensioni</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Larghezza (cm)</Label>
                        <Input type="number" value={dimensions.widthCm} onChange={(e) => handleDimensionChange('width', e.target.value)} className="bg-slate-800 h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Altezza (cm)</Label>
                        <Input type="number" value={dimensions.heightCm} onChange={(e) => handleDimensionChange('height', e.target.value)} className="bg-slate-800 h-8" disabled={isTextbox || isGraphicText} />
                    </div>
                    <div className="col-span-2 flex items-center justify-start">
                        {!isTextbox && !isGraphicText && (
                           <Button variant="ghost" size="sm" onClick={toggleLock}>
                               {isLocked ? <Lock className="w-4 h-4 mr-2"/> : <Unlock className="w-4 h-4 mr-2"/>}
                               {isLocked ? 'Blocca Proporzioni' : 'Sblocca Proporzioni'}
                           </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3 bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <Label className="text-sm flex items-center text-cyan-300"><RotateCw className="mr-2 h-4 w-4" /> Rotazione</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        type="range" min="-180" max="180" value={angle}
                        onChange={(e) => { setAngle(e.target.value); updateProperty('angle', parseInt(e.target.value), false); }}
                        onMouseUp={(e) => updateProperty('angle', parseInt(e.target.value), true)}
                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <Input type="number" value={angle} onChange={(e) => { setAngle(e.target.value); updateProperty('angle', parseInt(e.target.value)); }} className="w-20 bg-slate-800 h-8 text-center" />
                </div>
            </div>
            
            {isText && (
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-md border border-slate-700">
                    <Label className="text-sm flex items-center text-cyan-300"><Type className="mr-2 h-4 w-4" /> Proprietà Testo</Label>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Testo</Label>
                        <Input 
                            type="text" 
                            value={textValue} 
                            onChange={handleTextChange}
                            className="bg-slate-800 border-slate-600 h-8"
                        />
                    </div>
                    <div className="space-y-2">
                         <Label className="text-xs text-slate-400">Font</Label>
                         <Select onValueChange={(v) => updateProperty('fontFamily', v)} defaultValue={activeObject.fontFamily}>
                            <SelectTrigger className="bg-slate-800 border-slate-600 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {fontFamilies.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                            </SelectContent>
                         </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {isTextbox && (
                         <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Dimensione (pt)</Label>
                            <Input type="number" value={Math.round(activeObject.fontSize)} onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 12)} className="bg-slate-800 h-8" />
                        </div>
                        )}
                        {isTextbox && (
                            <div className="space-y-1">
                                 <Label className="text-xs text-slate-400">Allineamento</Label>
                                 <Select onValueChange={(v) => updateProperty('textAlign', v)} defaultValue={activeObject.textAlign}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Sinistra</SelectItem>
                                        <SelectItem value="center">Centro</SelectItem>
                                        <SelectItem value="right">Destra</SelectItem>
                                        <SelectItem value="justify">Giustificato</SelectItem>
                                    </SelectContent>
                                 </Select>
                            </div>
                        )}
                    </div>
                    <div className="flex items-end space-x-1">
                        <Button variant="outline" size="icon" onClick={() => toggleStyle('fontWeight', 'bold', 'normal')} className={`h-8 w-8 ${activeObject.get('fontWeight') === 'bold' ? 'bg-primary text-primary-foreground' : ''}`}><Bold className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" onClick={() => toggleStyle('fontStyle', 'italic', 'normal')} className={`h-8 w-8 ${activeObject.get('fontStyle') === 'italic' ? 'bg-primary text-primary-foreground' : ''}`}><Italic className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}

            {(isText || isShape) && (
                <div className="space-y-2">
                    <Label className="text-sm flex items-center"><Palette className="mr-2 h-4 w-4" /> Colore di Riempimento</Label>
                       <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 w-full justify-start" style={{ background: activeObject.fill, color: '#fff' }}>
                                    {activeObject.fill}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-0" side="bottom">
                                <ColorPicker color={activeObject.fill || '#000000'} onChange={applyFill} />
                            </PopoverContent>
                        </Popover>
                </div>
            )}
            
            <div className="space-y-2">
                <Label className="text-sm flex items-center"><AlignVerticalJustifyCenter className="mr-2 h-4 w-4" /> Allineamento</Label>
                <div className="grid grid-cols-3 gap-1">
                   <TooltipProvider>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('left')}><AlignLeft /></Button></TooltipTrigger><TooltipContent>Allinea a Sinistra</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('center-h')}><AlignHorizontalJustifyCenter /></Button></TooltipTrigger><TooltipContent>Centra Orizzontalmente</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('right')}><AlignRight /></Button></TooltipTrigger><TooltipContent>Allinea a Destra</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('top')}><AlignTop /></Button></TooltipTrigger><TooltipContent>Allinea in Alto</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('center-v')}><AlignVerticalJustifyCenter /></Button></TooltipTrigger><TooltipContent>Centra Verticalmente</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => alignActiveObject('bottom')}><PanelBottom /></Button></TooltipTrigger><TooltipContent>Allinea in Basso</TooltipContent></Tooltip>
                   </TooltipProvider>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label className="text-sm flex items-center"><Layers className="mr-2 h-4 w-4" /> Livello</Label>
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" onClick={() => moveLayer('forward')}><ArrowUp className="mr-2 h-4 w-4" /> Avanti</Button>
                   <Button variant="outline" onClick={() => moveLayer('backward')}><ArrowDown className="mr-2 h-4 w-4" /> Indietro</Button>
                   <Button variant="outline" onClick={() => moveLayer('front')}><ChevronsUp className="mr-2 h-4 w-4" /> Primo Piano</Button>
                   <Button variant="outline" onClick={() => moveLayer('back')}><ChevronsDown className="mr-2 h-4 w-4" /> Secondo Piano</Button>
                </div>
            </div>

            {isImage && (
                 <div className="space-y-2">
                    <Label className="text-sm flex items-center">Rifletti</Label>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="outline" onClick={() => flip('flipX')}><FlipHorizontal className="mr-2 h-4 w-4" /> Oriz.</Button>
                       <Button variant="outline" onClick={() => flip('flipY')}><FlipVertical className="mr-2 h-4 w-4" /> Vert.</Button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label className="text-sm flex items-center"><Droplet className="mr-2 h-4 w-4" /> Opacità</Label>
                <Input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={activeObject.opacity} 
                    onChange={(e) => updateProperty('opacity', parseFloat(e.target.value), false)}
                    onMouseUp={(e) => updateProperty('opacity', parseFloat(e.target.value), true)}
                    onTouchEnd={(e) => updateProperty('opacity', parseFloat(e.target.value), true)}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>
        </div>
    );
}

const ContextualTools = ({ activeObject, updateProperty, canvasRef, fontFamilies, updateBackground, alignActiveObject, moveLayer }) => {
    if (!canvasRef || !canvasRef.current) return null;

    const isBannerEditor = ['banner', 'rollup', 'rigid-media'].includes(canvasRef.current.productType);

    if (activeObject) {
         return (
            <>
                <ObjectTools 
                    activeObject={activeObject} 
                    updateProperty={updateProperty} 
                    canvasRef={canvasRef} 
                    fontFamilies={fontFamilies} 
                    alignActiveObject={alignActiveObject}
                    moveLayer={moveLayer}
                />
                {isBannerEditor && <BackgroundTools canvasRef={canvasRef} updateBackground={updateBackground} />}
            </>
        );
    }
    
    if (isBannerEditor) {
        return (
            <BackgroundTools canvasRef={canvasRef} updateBackground={updateBackground} />
        );
    }
    
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700 mt-4 text-center">
            <h3 className="text-md font-semibold text-cyan-300">Pannello Proprietà</h3>
            <p className="text-sm text-slate-400">Seleziona un oggetto sulla tela per modificarne le proprietà, oppure aggiungi nuovi elementi dal pannello Strumenti.</p>
        </div>
    );
};


export default ContextualTools;