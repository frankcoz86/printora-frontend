import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CLIPART_CATEGORIES } from '@/components/designer/clipart';
import { ScrollArea } from '@/components/ui/scroll-area';

const DtfClipartTab = ({ onAddClipart }) => {
    return (
        <TooltipProvider>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4 -mr-4">
                {CLIPART_CATEGORIES.map(category => (
                    <div key={category.name} className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 text-cyan-300">{category.name}</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {category.items.map((item, index) => (
                                <Tooltip key={`${category.name}-${index}`}>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="h-20 flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 border-slate-700" onClick={() => onAddClipart(item.svg)}>
                                            <div dangerouslySetInnerHTML={{ __html: item.svg.replace('<svg', '<svg fill="currentColor" class="w-8 h-8"') }} />
                                            <p className="text-xs text-slate-400 mt-1 text-center">{item.name}</p>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Aggiungi {item.name}</p></TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </TooltipProvider>
    );
};

export default DtfClipartTab;