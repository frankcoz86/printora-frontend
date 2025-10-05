import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Trash2, Layers, Repeat, Grid, Copy, PlusSquare, Type, AlignLeft, AlignHorizontalJustifyCenter, AlignRight, AlignLeft as AlignTop, AlignVerticalJustifyCenter, PanelBottom, RotateCw, Palette, ChevronsUp, ChevronsDown, ArrowUp, ArrowDown, Ruler } from 'lucide-react';
import MultiplierTool from '@/components/designer/MultiplierTool';
import TextTool from '@/components/designer/TextTool';
import { CLIPART_CATEGORIES } from '@/components/designer/clipart';
import { fabric } from 'fabric';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import CmykColorPicker from '@/components/CmykColorPicker';

const TooltipButton = ({ tooltip, children, ...props }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button {...props}>{children}</Button>
        </TooltipTrigger>
        <TooltipContent><p>{tooltip}</p></TooltipContent>
    </Tooltip>
);

const DtfEditorSidebar = ({
    activeObject,
    onAddImage,
    onAddClipart,
    onDelete,
    onDuplicate,
    updateProperty,
    canvasRef,
    fontFamilies,
    hasFluo,
    setHasFluo,
    fabricCanvasRefs,
    setCanvases,
    designState,
    onAddText,
    alignActiveObject,
    moveLayer,
}) => {
    const fileInputRef = useRef(null);
    const [multiplierLogos, setMultiplierLogos] = useState([]);
    const [isApplyingMultiplier, setIsApplyingMultiplier] = useState(false);
    const [angle, setAngle] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (activeObject && canvasRef) {
            const updateDimensions = () => {
                const scale = canvasRef.cmToPxScale || 1;
                setDimensions({
                    width: (activeObject.getScaledWidth() / scale).toFixed(2),
                    height: (activeObject.getScaledHeight() / scale).toFixed(2),
                });
            };
            updateDimensions();

            setAngle(Math.round(activeObject.angle || 0));
            const handleRotation = (e) => setAngle(Math.round(e.target.angle || 0));
            const handleScaling = () => updateDimensions();

            activeObject.on('rotating', handleRotation);
            activeObject.on('scaling', handleScaling);
            return () => {
                activeObject.off('rotating', handleRotation);
                activeObject.off('scaling', handleScaling);
            }
        }
    }, [activeObject, canvasRef]);

    const handleDimensionChange = (dim, value) => {
        if (!activeObject || !canvasRef) return;
        const scale = canvasRef.cmToPxScale || 1;
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue <= 0) return;

        const newDimensions = { ...dimensions, [dim]: value };
        setDimensions(newDimensions);

        if (dim === 'width') {
            activeObject.scaleToWidth(numericValue * scale);
        } else {
            activeObject.scaleToHeight(numericValue * scale);
        }
        canvasRef.renderAll();
        // After scaling, re-read dimensions to update the other field if aspect ratio is locked
        const updatedWidth = (activeObject.getScaledWidth() / scale).toFixed(2);
        const updatedHeight = (activeObject.getScaledHeight() / scale).toFixed(2);
        setDimensions({ width: updatedWidth, height: updatedHeight });
    };

    const applyMultiplier = async () => {
        if (multiplierLogos.length === 0 || !designState) return;
        setIsApplyingMultiplier(true);

        try {
            const canvasTemplate = fabricCanvasRefs.current[0] || canvasRef;
            if (!canvasTemplate) {
                toast({ title: "Errore", description: "Canvas non inizializzato.", variant: "destructive" });
                setIsApplyingMultiplier(false);
                return;
            }

            const canvasWidth = canvasTemplate.width;
            const canvasHeight = canvasTemplate.height;
            const cmToPxScale = canvasTemplate.cmToPxScale;

            const allImagesToPlace = [];
            for (const logo of multiplierLogos) {
                const img = await new Promise(resolve => fabric.Image.fromURL(logo.src, img => resolve(img)));
                for (let i = 0; i < logo.count; i++) {
                    allImagesToPlace.push({ img, logo });
                }
            }

            const layouts = [];
            let currentLayout = [];
            let currentX = 0;
            let currentY = 0;
            let rowMaxHeight = 0;

            for (const { img, logo } of allImagesToPlace) {
                const spacingXPx = (logo.spacingX / 10) * cmToPxScale;
                const spacingYPx = (logo.spacingY / 10) * cmToPxScale;
                const imgWidthPx = logo.width * cmToPxScale;
                
                img.scaleToWidth(imgWidthPx);
                const imgHeightPx = img.getScaledHeight();

                if (currentX === 0) { 
                    currentX = spacingXPx;
                    currentY = currentY === 0 ? spacingYPx : currentY + rowMaxHeight + spacingYPx;
                    rowMaxHeight = 0;
                }

                if (currentX + imgWidthPx + spacingXPx > canvasWidth) {
                    currentX = spacingXPx;
                    currentY += rowMaxHeight + spacingYPx;
                    rowMaxHeight = 0;
                }

                if (currentY + imgHeightPx + spacingYPx > canvasHeight) {
                    if (currentLayout.length > 0) layouts.push(currentLayout);
                    currentLayout = [];
                    currentX = spacingXPx;
                    currentY = spacingYPx;
                    rowMaxHeight = 0;
                }
                
                rowMaxHeight = Math.max(rowMaxHeight, imgHeightPx);
                
                const clonedImg = fabric.util.object.clone(img);
                clonedImg.set({ left: currentX, top: currentY });
                currentLayout.push(clonedImg);

                currentX += imgWidthPx + spacingXPx;
            }
            if (currentLayout.length > 0) {
                layouts.push(currentLayout);
            }

            setCanvases(Array(layouts.length).fill({}));

            await new Promise(resolve => setTimeout(resolve, 100));

            fabricCanvasRefs.current.forEach((canvas, index) => {
                if (canvas) {
                    canvas.clear();
                    if (layouts[index]) {
                        layouts[index].forEach(obj => canvas.add(obj));
                    }
                    canvas.renderAll();
                }
            });
            
            toast({
                title: "Layout Applicato!",
                description: `Sono stati creati ${layouts.length} teli.`
            });

        } catch (error) {
            console.error("Error applying multiplier:", error);
            toast({ title: "Errore", description: "Si è verificato un errore durante l'applicazione della serie.", variant: "destructive" });
        } finally {
            setIsApplyingMultiplier(false);
        }
    };
    
    const duplicateCanvas = () => {
        const currentCanvas = canvasRef;
        if (!currentCanvas) return;
        const json = currentCanvas.toJSON();
        setCanvases(prev => [...prev, { json }]);
        toast({ title: "Telo Duplicato", description: "Una copia del telo corrente è stata aggiunta." });
    };

    const applyFill = (color) => {
        const canvas = canvasRef;
        if (!canvas || !activeObject) return;
        
        if (activeObject.isType('group')) {
            activeObject.getObjects().forEach(obj => {
                if (obj.isType('path') || obj.isType('textbox') || obj.isType('rect') || obj.isType('circle') || obj.isType('triangle')) {
                   obj.set('fill', color);
                }
            });
        } else {
            updateProperty('fill', color);
        }
        canvas.requestRenderAll();
    }

    const isText = activeObject?.isType('textbox');
    const isShape = activeObject && ['rect', 'circle', 'triangle', 'path', 'group'].some(type => activeObject.isType(type));

    return (
        <aside className="w-[450px] bg-slate-900 p-4 overflow-y-auto shrink-0 custom-scrollbar">
            <Tabs defaultValue="tools" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                    <TabsTrigger value="tools"><Layers className="w-4 h-4 mr-1"/>Strumenti</TabsTrigger>
                    <TabsTrigger value="text"><Type className="w-4 h-4 mr-1"/>Testo</TabsTrigger>
                    <TabsTrigger value="clipart"><Grid className="w-4 h-4 mr-1"/>Clipart</TabsTrigger>
                    <TabsTrigger value="multiplier"><Repeat className="w-4 h-4 mr-1"/>Serie</TabsTrigger>
                </TabsList>
                <TabsContent value="tools" className="space-y-3 mt-4">
                    <TooltipProvider>
                        <TooltipButton className="w-full justify-start" variant="outline" onClick={() => fileInputRef.current.click()} tooltip="Carica le tue immagini (PNG, JPG)">
                            <ImageIcon className="mr-3 h-5 w-5 text-cyan-400" /> Aggiungi Immagine
                        </TooltipButton>
                        <Input type="file" ref={fileInputRef} className="hidden" onChange={onAddImage} accept="image/*" multiple />
                        
                        <TooltipButton className="w-full justify-start" variant="outline" onClick={onDuplicate} disabled={!activeObject} tooltip="Duplica l'elemento selezionato">
                            <Copy className="mr-3 h-5 w-5 text-cyan-400" /> Duplica Selezionato
                        </TooltipButton>

                        <TooltipButton className="w-full justify-start" variant="outline" onClick={duplicateCanvas} tooltip="Crea una copia del telo corrente">
                            <PlusSquare className="mr-3 h-5 w-5 text-cyan-400" /> Duplica Telo
                        </TooltipButton>

                        <TooltipButton className="w-full justify-start" variant="destructive" onClick={onDelete} disabled={!activeObject} tooltip="Elimina l'elemento selezionato">
                            <Trash2 className="mr-3 h-5 w-5" /> Elimina Selezionato
                        </TooltipButton>
                    </TooltipProvider>
                </TabsContent>
                <TabsContent value="text" className="mt-4">
                    <TextTool
                        fontFamilies={fontFamilies}
                        onAddText={onAddText}
                        isDtf={true}
                        hasFluo={hasFluo}
                    />
                </TabsContent>
                <TabsContent value="multiplier">
                    <MultiplierTool 
                        logos={multiplierLogos} 
                        setLogos={setMultiplierLogos} 
                        onApply={applyMultiplier}
                        isApplying={isApplyingMultiplier}
                    />
                </TabsContent>
                <TabsContent value="clipart" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <TooltipProvider>
                            {CLIPART_CATEGORIES.map(category => (
                                <div key={category.name} className="mb-4">
                                    <h4 className="font-semibold text-sm mb-2 text-cyan-300">{category.name}</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {category.items.map((item, index) => (
                                            <Tooltip key={`${category.name}-${index}`}>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" className="h-20 flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 border-slate-700" onClick={() => onAddClipart(item.svg)}>
                                                        <div dangerouslySetInnerHTML={{ __html: item.svg.replace('<svg', '<svg fill="currentColor" class="w-8 h-8"') }} />
                                                        <p className="text-xs text-slate-400 mt-1">{item.name}</p>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Aggiungi {item.name}</p></TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </TooltipProvider>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            
            {activeObject && (
                <div className="mt-4 pt-4 border-t-2 border-slate-700 space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-300">Modifica Elemento</h3>
                    
                    {isText && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1"><Ruler className="w-4 h-4"/> Dimensioni (cm)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="width-input" className="text-xs">Base</Label>
                                    <Input id="width-input" type="number" value={dimensions.width} onChange={(e) => handleDimensionChange('width', e.target.value)} className="bg-slate-800 h-8" />
                                </div>
                                <div>
                                    <Label htmlFor="height-input" className="text-xs">Altezza</Label>
                                    <Input id="height-input" type="number" value={dimensions.height} onChange={(e) => handleDimensionChange('height', e.target.value)} className="bg-slate-800 h-8" />
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <CmykColorPicker color={activeObject.fill || '#ffffff'} onChange={applyFill} showSportColors={hasFluo} showWhite={true} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="flex items-center gap-1"><RotateCw className="w-4 h-4"/> Rotazione</Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                type="range" min="-180" max="180" value={angle}
                                onChange={(e) => { setAngle(e.target.value); updateProperty('angle', parseInt(e.target.value)); }}
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
            )}

            <div className="mt-4 pt-4 border-t-2 border-slate-700">
                <div className="flex items-center justify-between">
                    <Label htmlFor="fluo-switch" className="font-semibold text-yellow-300">Colori Speciali FLUO</Label>
                    <Switch id="fluo-switch" checked={hasFluo} onCheckedChange={setHasFluo} />
                </div>
                <p className="text-xs text-slate-400 mt-1">Attiva per usare i colori fluorescenti. Verrà applicato un costo aggiuntivo.</p>
            </div>
        </aside>
    );
};

export default DtfEditorSidebar;