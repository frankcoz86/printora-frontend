import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Palette, Type, Image as ImageIcon, Smile, ArrowUp, ArrowDown, FlipHorizontal, FlipVertical, Trash2, Copy, AlignCenter, AlignLeft, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SketchPicker } from 'react-color';
import { FONT_FAMILIES } from './utils';

const AccordionItem = ({ title, icon, children, isOpen, onClick }) => (
    <div className="border-b border-slate-700">
        <button onClick={onClick} className="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-slate-700/50 transition-colors">
            <span className="flex items-center gap-2">{icon}{title}</span>
            <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
                <ArrowDown size={16} />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 space-y-4 bg-slate-800/30">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const ColorPicker = ({ color, onChange }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-slate-500" style={{ backgroundColor: color }}></div>
                    <span>{color}</span>
                </div>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-0" side="right" align="start">
            <SketchPicker color={color} onChangeComplete={(c) => onChange(c.hex)} />
        </PopoverContent>
    </Popover>
);

const PropertiesPanel = ({ canvas, activeObject, setBackgroundColor, addImage }) => {
    const [activeAccordion, setActiveAccordion] = useState('canvas');
    const [objectProps, setObjectProps] = useState({});

    useEffect(() => {
        if (activeObject) {
            setObjectProps({
                fill: activeObject.fill || '#ffffff',
                opacity: activeObject.opacity || 1,
                fontFamily: activeObject.fontFamily || 'Arial',
                fontSize: activeObject.fontSize || 24,
                textAlign: activeObject.textAlign || 'left',
                fontWeight: activeObject.fontWeight || 'normal',
                fontStyle: activeObject.fontStyle || 'normal',
                underline: activeObject.underline || false,
                stroke: activeObject.stroke || '#000000',
                strokeWidth: activeObject.strokeWidth || 0,
            });
            const type = activeObject.type === 'i-text' ? 'text' : 'image';
            setActiveAccordion(type);
        } else {
            setActiveAccordion('canvas');
        }
    }, [activeObject]);

    const updateProperty = (prop, value) => {
        if (!activeObject) return;
        activeObject.set(prop, value);
        canvas.requestRenderAll();
        setObjectProps(prev => ({ ...prev, [prop]: value }));
    };

    const handleObjectAction = (action) => {
        if (!activeObject) return;
        switch (action) {
            case 'delete': canvas.remove(activeObject); break;
            case 'clone':
                activeObject.clone(cloned => {
                    cloned.set({ left: activeObject.left + 10, top: activeObject.top + 10 });
                    canvas.add(cloned);
                });
                break;
            case 'bringForward': canvas.bringForward(activeObject); break;
            case 'sendBackwards': canvas.sendBackwards(activeObject); break;
            case 'flipX': updateProperty('flipX', !activeObject.flipX); break;
            case 'flipY': updateProperty('flipY', !activeObject.flipY); break;
            default: break;
        }
        canvas.discardActiveObject().requestRenderAll();
    };
    
    const handleTextAlign = (align) => {
        if(activeObject && activeObject.type === 'i-text'){
            updateProperty('textAlign', align);
        }
    };
    
    const toggleTextStyle = (style) => {
        if(activeObject && activeObject.type === 'i-text'){
            switch(style){
                case 'bold': updateProperty('fontWeight', objectProps.fontWeight === 'bold' ? 'normal' : 'bold'); break;
                case 'italic': updateProperty('fontStyle', objectProps.fontStyle === 'italic' ? 'normal' : 'italic'); break;
                case 'underline': updateProperty('underline', !objectProps.underline); break;
                default: break;
            }
        }
    }
    
    const handleBgImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (f) => {
            setBackgroundColor({ source: f.target.result, type: 'image' });
        };
        reader.readAsDataURL(file);
    };

    const toggleAccordion = (id) => {
        setActiveAccordion(prev => (prev === id ? null : id));
    };

    return (
        <div className="bg-slate-800 text-white w-full h-full flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeObject ? activeObject.id : 'canvas'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-grow overflow-y-auto"
                >
                    {/* Pannello Sfondo (default) */}
                    <AccordionItem title="Proprietà Sfondo" icon={<Palette size={16} />} isOpen={activeAccordion === 'canvas'} onClick={() => toggleAccordion('canvas')}>
                        <Label>Colore di Sfondo</Label>
                        <ColorPicker color={canvas.backgroundColor} onChange={(color) => setBackgroundColor({ source: color, type: 'color' })} />
                         <div>
                            <Label>Immagine di Sfondo</Label>
                            <Input type="file" accept="image/*" onChange={handleBgImageUpload} className="text-xs"/>
                        </div>
                    </AccordionItem>

                    {/* Pannello Testo */}
                    {activeObject?.type === 'i-text' && (
                        <>
                            <AccordionItem title="Proprietà Testo" icon={<Type size={16} />} isOpen={activeAccordion === 'text'} onClick={() => toggleAccordion('text')}>
                                <Label>Font</Label>
                                <Select value={objectProps.fontFamily} onValueChange={(v) => updateProperty('fontFamily', v)}>
                                    <SelectTrigger><SelectValue placeholder="Seleziona un font" /></SelectTrigger>
                                    <SelectContent>
                                        {FONT_FAMILIES.map(font => <SelectItem key={font} value={font} style={{fontFamily: font}}>{font}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                
                                <Label>Dimensione</Label>
                                <Input type="number" value={objectProps.fontSize} onChange={(e) => updateProperty('fontSize', parseInt(e.target.value, 10))} />

                                <Label>Colore Testo</Label>
                                <ColorPicker color={objectProps.fill} onChange={(c) => updateProperty('fill', c)} />
                                
                                <Label>Stile</Label>
                                <div className="flex gap-1">
                                    <Button variant={objectProps.fontWeight === 'bold' ? 'secondary' : 'outline'} size="icon" onClick={() => toggleTextStyle('bold')}><Bold size={16}/></Button>
                                    <Button variant={objectProps.fontStyle === 'italic' ? 'secondary' : 'outline'} size="icon" onClick={() => toggleTextStyle('italic')}><Italic size={16}/></Button>
                                    <Button variant={objectProps.underline ? 'secondary' : 'outline'} size="icon" onClick={() => toggleTextStyle('underline')}><Underline size={16}/></Button>
                                </div>
                                
                                <Label>Allineamento</Label>
                                <div className="flex gap-1">
                                    <Button variant={objectProps.textAlign === 'left' ? 'secondary' : 'outline'} size="icon" onClick={() => handleTextAlign('left')}><AlignLeft size={16}/></Button>
                                    <Button variant={objectProps.textAlign === 'center' ? 'secondary' : 'outline'} size="icon" onClick={() => handleTextAlign('center')}><AlignCenter size={16}/></Button>
                                    <Button variant={objectProps.textAlign === 'right' ? 'secondary' : 'outline'} size="icon" onClick={() => handleTextAlign('right')}><AlignRight size={16}/></Button>
                                </div>
                            </AccordionItem>
                            
                            <AccordionItem title="Effetti Testo" icon={<Sliders size={16} />} isOpen={activeAccordion === 'text_effects'} onClick={() => toggleAccordion('text_effects')}>
                                 <Label>Opacità</Label>
                                <Slider value={[objectProps.opacity]} onValueChange={(v) => updateProperty('opacity', v[0])} max={1} step={0.01} />
                                
                                <Label>Traccia</Label>
                                <ColorPicker color={objectProps.stroke} onChange={(c) => updateProperty('stroke', c)} />
                                <Slider value={[objectProps.strokeWidth]} onValueChange={(v) => updateProperty('strokeWidth', v[0])} max={10} step={0.5} />
                            </AccordionItem>
                        </>
                    )}

                    {/* Pannello Immagine */}
                    {activeObject && ['image', 'path-group'].includes(activeObject.type) && (
                         <AccordionItem title="Proprietà Immagine" icon={<ImageIcon size={16} />} isOpen={activeAccordion === 'image'} onClick={() => toggleAccordion('image')}>
                             <Label>Opacità</Label>
                             <Slider value={[objectProps.opacity]} onValueChange={(v) => updateProperty('opacity', v[0])} max={1} step={0.01} />
                             {/* Placeholder for filters */}
                             <Label>Filtri</Label>
                             <div className="flex gap-2">
                                <Button variant="outline" size="sm">Normale</Button>
                                <Button variant="outline" size="sm">B/N</Button>
                                <Button variant="outline" size="sm">Seppia</Button>
                             </div>
                        </AccordionItem>
                    )}

                    {/* Pannello Azioni Comuni */}
                    {activeObject && (
                         <AccordionItem title="Azioni Oggetto" icon={<Sliders size={16} />} isOpen={activeAccordion === 'actions'} onClick={() => toggleAccordion('actions')}>
                             <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleObjectAction('bringForward')}><ArrowUp size={16} className="mr-2" />Porta avanti</Button>
                                <Button variant="outline" size="sm" onClick={() => handleObjectAction('sendBackwards')}><ArrowDown size={16} className="mr-2" />Porta indietro</Button>
                                <Button variant="outline" size="sm" onClick={() => handleObjectAction('flipX')}><FlipHorizontal size={16} className="mr-2" />Rifletti Oriz.</Button>
                                <Button variant="outline" size="sm" onClick={() => handleObjectAction('flipY')}><FlipVertical size={16} className="mr-2" />Rifletti Vert.</Button>
                                <Button variant="outline" size="sm" onClick={() => handleObjectAction('clone')}><Copy size={16} className="mr-2" />Duplica</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleObjectAction('delete')}><Trash2 size={16} className="mr-2" />Elimina</Button>
                             </div>
                        </AccordionItem>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PropertiesPanel;