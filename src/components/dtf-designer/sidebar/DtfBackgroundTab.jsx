import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ColorPicker from '@/components/CmykColorPicker';
import { Image } from 'lucide-react';

const DtfBackgroundTab = ({ updateBackground, canvasRef }) => {
    const canvas = canvasRef;
    const backgroundColor = canvas?.backgroundColor || '#ffffff';

    const handleColorChange = (color) => {
        updateBackground({ backgroundColor: color });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300 flex items-center">
                <Image className="mr-2" /> Modifica Sfondo
            </h3>
            <div className="space-y-2">
                <Label className="text-sm">Colore di Sfondo</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            style={{ backgroundColor }}
                        >
                            <div className="w-full flex items-center">
                                <div
                                    className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                                    style={{ background: backgroundColor }}
                                />
                                <div className="ml-2 flex-1 text-white">
                                    {backgroundColor}
                                </div>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0" side="bottom">
                        <ColorPicker
                            color={backgroundColor}
                            onChange={handleColorChange}
                            showWhite={true}
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-slate-400 mt-1">
                    Il colore di sfondo serve solo come riferimento visivo e non verrà stampato.
                </p>
            </div>
        </div>
    );
};

export default DtfBackgroundTab;