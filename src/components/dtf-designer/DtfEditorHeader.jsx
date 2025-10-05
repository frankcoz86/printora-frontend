import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Save, Loader2, BookOpen, Download, AlertTriangle } from 'lucide-react';

const DtfEditorHeader = ({ designState, onNavigateBack, onOpenHelp, onSave, isSaving, onDownloadPng, hasDownloadedPngs }) => (
    <header className="flex items-center justify-between p-3 bg-slate-900 shadow-md z-10 shrink-0">
        <Button variant="ghost" onClick={onNavigateBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Torna
        </Button>
        <div className="text-center hidden md:block">
            <h1 className="text-xl font-bold">Editor Layout DTF</h1>
            <p className="text-sm text-gray-400">Dimensioni Telo: {designState.width}cm x {designState.height}cm</p>
        </div>
        <div className="flex items-center gap-2">
            <TooltipProvider>
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
                    <TooltipContent><p>Guida Rapida</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={onDownloadPng} 
                          disabled={isSaving} 
                          className={`relative transition-all duration-300 ${!hasDownloadedPngs ? 'border-yellow-400 text-yellow-400 animate-pulse-slow hover:bg-yellow-900/50 hover:text-yellow-300' : 'border-green-500 text-green-500'}`}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Scarica Anteprima PNG
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-slate-100 border-slate-600">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400"/>
                            <p>Anteprima obbligatoria per salvare (PNG 300dpi)</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
            <Button onClick={onSave} variant="accent" size="lg" disabled={isSaving || !hasDownloadedPngs}>
                {isSaving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                ) : (
                    <><Save className="mr-2 h-4 w-4" /> Salva e Aggiungi</>
                )}
            </Button>
        </div>
    </header>
);

export default DtfEditorHeader;