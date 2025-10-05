import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Repeat, Grid, Type } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DtfToolsTab from '@/components/dtf-designer/sidebar/DtfToolsTab';
import DtfTextTab from '@/components/dtf-designer/sidebar/DtfTextTab';
import DtfClipartTab from '@/components/dtf-designer/sidebar/DtfClipartTab';
import DtfMultiplierTab from '@/components/dtf-designer/sidebar/DtfMultiplierTab';
import DtfObjectProperties from '@/components/dtf-designer/sidebar/DtfObjectProperties';

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
    
    const duplicateCanvas = () => {
        const currentCanvas = canvasRef;
        if (!currentCanvas) return;
        const json = currentCanvas.toJSON();
        setCanvases(prev => [...prev, { json }]);
    };

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
                    <DtfToolsTab
                        fileInputRef={fileInputRef}
                        onAddImage={onAddImage}
                        onDuplicate={onDuplicate}
                        onDuplicateCanvas={duplicateCanvas}
                        onDelete={onDelete}
                        activeObject={activeObject}
                    />
                </TabsContent>
                <TabsContent value="text" className="mt-4">
                    <DtfTextTab onAddText={onAddText} />
                </TabsContent>
                <TabsContent value="multiplier">
                    <DtfMultiplierTab
                        fabricCanvasRefs={fabricCanvasRefs}
                        setCanvases={setCanvases}
                        designState={designState}
                        canvasRef={canvasRef}
                    />
                </TabsContent>
                <TabsContent value="clipart" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <DtfClipartTab onAddClipart={onAddClipart} />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            
            {activeObject && (
                <DtfObjectProperties
                    activeObject={activeObject}
                    updateProperty={updateProperty}
                    canvasRef={canvasRef}
                    fontFamilies={fontFamilies}
                    alignActiveObject={alignActiveObject}
                    moveLayer={moveLayer}
                    hasFluo={hasFluo}
                />
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