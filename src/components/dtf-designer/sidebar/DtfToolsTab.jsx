import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Copy, Trash2, CopyPlus, Library } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DtfToolsTab = ({ onAddImage, onDuplicate, onDuplicateCanvas, onDelete, activeObject, onOpenTemplates }) => {
    const fileInputRef = useRef(null);

    return (
        <TooltipProvider>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => fileInputRef.current.click()} variant="outline" className="h-20 flex-col">
                        <Upload className="w-6 h-6 mb-1" />
                        Carica Immagine
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onAddImage}
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml, image/tiff"
                        multiple
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={onDuplicate} disabled={!activeObject} variant="outline" className="h-20 flex-col">
                                <Copy className="w-6 h-6 mb-1" />
                                Duplica Oggetto
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplica l'oggetto selezionato</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={onDelete} disabled={!activeObject} variant="destructive" className="h-20 flex-col">
                                <Trash2 className="w-6 h-6 mb-1" />
                                Elimina Oggetto
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Elimina l'oggetto selezionato</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button onClick={onDuplicateCanvas} variant="outline" className="h-20 flex-col">
                                <CopyPlus className="w-6 h-6 mb-1"/>
                                Duplica Telo
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crea un nuovo telo con gli stessi elementi di quello attuale</TooltipContent>
                    </Tooltip>
                </div>
                <Button onClick={onOpenTemplates} variant="outline" className="w-full">
                    <Library className="w-4 h-4 mr-2" />
                    Sfoglia Template
                </Button>
            </div>
        </TooltipProvider>
    );
};

export default DtfToolsTab;