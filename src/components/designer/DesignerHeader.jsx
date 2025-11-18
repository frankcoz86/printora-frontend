import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Download, FileText, BookOpen, Undo, Redo, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DesignerHeader = ({ 
    designState, 
    onSave, 
    isSaving, 
    onNavigateBack, 
    onTogglePreview, 
    isPreviewMode, 
    onDownloadPng, 
    onDownloadPdf, 
    onOpenHelp,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onDelete,
    activeObject
}) => (
    <header className="flex items-center justify-between p-3 bg-slate-900 shadow-md z-30 shrink-0 md:flex-row flex-col">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Button variant="ghost" onClick={onNavigateBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Torna
            </Button>
            <div className="pl-2 ml-2 border-l border-slate-700 flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo}>
                                <Undo className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Annulla</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo}>
                                <Redo className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Ripristina</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-900/50" onClick={onDelete} disabled={!activeObject}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Elimina Oggetto</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
        <div className="text-center mb-2 md:mb-0 md:hidden">
            <h1 className="text-xl font-bold">Editor Grafico: {designState.product.name}</h1>
            <p className="text-sm text-gray-400">Dimensioni Finali: {designState.width}cm x {designState.height}cm</p>
        </div>
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={onTogglePreview}>
                            {isPreviewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{isPreviewMode ? 'Esci da Anteprima' : 'Mostra Anteprima a Schermo Intero'}</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onOpenHelp}
                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300"
                        >
                            <BookOpen className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Apri la Guida Rapida dell'Editor</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={onDownloadPng} disabled={isSaving}>
                            <Download className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Scarica un'anteprima in formato PNG</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={onDownloadPdf} disabled={isSaving} className="border-yellow-500 text-yellow-400 hover:bg-yellow-900/50 hover:text-yellow-300">
                            <FileText className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Scarica PDF per approvazione (obbligatorio per salvare)</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Button onClick={onSave} variant="accent" size="lg" disabled={isSaving}>
                {isSaving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                ) : (
                    <><Save className="mr-2 h-4 w-4" /> Salva e Continua</>
                )}
            </Button>
        </div>
    </header>
);

export default DesignerHeader;