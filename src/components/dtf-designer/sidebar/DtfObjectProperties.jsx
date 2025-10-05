import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ColorPicker from '@/components/CmykColorPicker';
import { Type, Ruler, Bold, Italic, Palette, RotateCw, AlignVerticalJustifyCenter, AlignLeft, AlignRight, AlignLeft as AlignTop, PanelBottom, Layers, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Lock, Unlock, AlignHorizontalJustifyCenter } from 'lucide-react';

const DtfObjectProperties = ({ activeObject, updateProperty, canvasRef, fontFamilies, alignActiveObject, moveLayer, hasFluo }) => {
    const [dimensions, setDimensions] = useState({ width: '0', height: '0' });
    const [angle, setAngle] = useState(0);
    const [isLocked, setIsLocked] = useState(activeObject ? activeObject.lockUniScaling : false);
    const [textValue, setTextValue] = useState(activeObject?.text || '');
    const canvas = canvasRef;
    
    const isText = activeObject?.isType('textbox') || activeObject?.isType('i-text');
    const isTextbox = activeObject?.isType('textbox');
    const isGraphicText = activeObject?.isType('i-text');
    
    const getObjectDimensions = useCallback(() => {
        if (!activeObject || !canvas?.cmToPxScale) return { width: '0', height: '0' };
        const scale = canvas.cmToPxScale;
        
        let widthPx, heightPx;

        widthPx = activeObject.getScaledWidth();
        heightPx = activeObject.getScaledHeight();

        const widthCm = (widthPx / scale).toFixed(2);
        const heightCm = (heightPx / scale).toFixed(2);
        return { width: widthCm, height: heightCm };
    }, [activeObject, canvas]);


    useEffect(() => {
        if (activeObject && canvas) {
            const updateVisuals = () => {
                setDimensions(getObjectDimensions());
                setAngle(Math.round(activeObject.angle || 0));
                setIsLocked(activeObject.lockUniScaling);
            };
            
            updateVisuals();
            if (isText) {
                setTextValue(activeObject.text);
            }

            const events = ['rotating', 'scaling', 'modified'];
            if (isText) events.push('changed');
            
            events.forEach(event => activeObject.on(event, updateVisuals));

            return () => {
                 if (activeObject?.__eventListeners) {
                    events.forEach(event => activeObject.off(event, updateVisuals));
                }
            };
        }
    }, [activeObject, canvas, isText, getObjectDimensions]);

    if (!activeObject || !canvas) return null;

    const isShape = ['rect', 'circle', 'triangle', 'path', 'group'].some(type => activeObject.isType(type));

    const toggleStyle = (prop, trueVal, falseVal) => {
        const currentVal = activeObject.get(prop);
        updateProperty(prop, currentVal === trueVal ? falseVal : trueVal);
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
    };

    const handleDimensionChange = (dim, value) => {
        const newDimensions = {...dimensions, [dim]: value};
        setDimensions(newDimensions);
        
        const prop = dim === 'width' ? 'widthCm' : 'heightCm';
        updateProperty(prop, value, false);
    };

    const handleDimensionChangeFinal = (dim, value) => {
        const prop = dim === 'width' ? 'widthCm' : 'heightCm';
        updateProperty(prop, value, true);
    }

    const toggleLock = () => {
        const newLockState = !isLocked;
        setIsLocked(newLockState);
        updateProperty('lockUniScaling', newLockState, true);
    };

    const handleTextChange = (e) => {
        setTextValue(e.target.value);
        updateProperty('text', e.target.value);
    };

    return (
        <div className="mt-4 pt-4 border-t-2 border-slate-700 space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300">Modifica Elemento</h3>
            
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
                        <Button variant="outline" size="icon" onClick={() => toggleStyle('fontWeight', 'bold', 'normal')} className={`h-8 w-8 ${activeObject.get('fontWeight') === 'bold' ? 'bg-primary text-primary-foreground' : ''}`}><Bold className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" onClick={() => toggleStyle('fontStyle', 'italic', 'normal')} className={`h-8 w-8 ${activeObject.get('fontStyle') === 'italic' ? 'bg-primary text-primary-foreground' : ''}`}><Italic className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}
            
            <div className="space-y-2">
                <Label className="flex items-center gap-1"><Ruler className="w-4 h-4"/> Dimensioni (cm)</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="width-input" className="text-xs">Base</Label>
                        <Input 
                            id="width-input" 
                            type="number" 
                            value={dimensions.width} 
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                            onBlur={(e) => handleDimensionChangeFinal('width', e.target.value)}
                            className="bg-slate-800 h-8" 
                            step="0.01"
                        />
                    </div>
                    <div>
                        <Label htmlFor="height-input" className="text-xs">Altezza</Label>
                        <Input 
                            id="height-input" 
                            type="number" 
                            value={dimensions.height} 
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                            onBlur={(e) => handleDimensionChangeFinal('height', e.target.value)}
                            className="bg-slate-800 h-8" 
                            disabled={isLocked} 
                            step="0.01"
                        />
                    </div>
                </div>
                 <div className="flex items-center justify-start">
                    {!isTextbox && (
                        <Button variant="ghost" size="sm" onClick={toggleLock}>
                            {isLocked ? <Lock className="w-4 h-4 mr-2"/> : <Unlock className="w-4 h-4 mr-2"/>}
                            {isLocked ? 'Blocca Proporzioni' : 'Sblocca Proporzioni'}
                        </Button>
                    )}
                </div>
            </div>

            {(isText || isShape) && (
                <div className="space-y-2">
                    <Label className="flex items-center gap-1"><Palette className="w-4 h-4"/> Colore</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-10 w-full justify-start" style={{ background: activeObject.fill, color: '#fff' }}>
                                {activeObject.fill}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0" side="bottom">
                            <ColorPicker color={activeObject.fill || '#ffffff'} onChange={applyFill} showSportColors={hasFluo} showWhite={true} />
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <div className="space-y-2">
                <Label className="flex items-center gap-1"><RotateCw className="w-4 h-4"/> Rotazione</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        type="range" min="-180" max="180" value={angle}
                        onChange={(e) => { setAngle(e.target.value); updateProperty('angle', parseInt(e.target.value), false); }}
                        onMouseUp={(e) => { updateProperty('angle', parseInt(e.target.value), true); }}
                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <Input type="number" value={angle} onChange={(e) => { setAngle(e.target.value); updateProperty('angle', parseInt(e.target.value)); }} className="w-20 bg-slate-800 h-8 text-center" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-1"><AlignVerticalJustifyCenter className="w-4 h-4"/> Allineamento Telo</Label>
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
                <Label className="flex items-center gap-1"><Layers className="w-4 h-4"/> Livello</Label>
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" onClick={() => moveLayer('forward')}><ArrowUp className="mr-2 h-4 w-4" /> Avanti</Button>
                   <Button variant="outline" onClick={() => moveLayer('backward')}><ArrowDown className="mr-2 h-4 w-4" /> Indietro</Button>
                   <Button variant="outline" onClick={() => moveLayer('front')}><ChevronsUp className="mr-2 h-4 w-4" /> Primo Piano</Button>
                   <Button variant="outline" onClick={() => moveLayer('back')}><ChevronsDown className="mr-2 h-4 w-4" /> Secondo Piano</Button>
                </div>
            </div>
        </div>
    );
};

export default DtfObjectProperties;