import React from 'react';
import { SketchPicker } from 'react-color';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Droplet, Zap, Snowflake } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

const PRESET_COLORS = [
    '#000000', '#e03131', '#c92a2a', '#1864ab', '#fcc419', '#e67700', '#212529', '#343a40', '#2f9e44', '#a9e34b', '#111827', '#2dd4bf', '#495057'
];

const SPORT_COLORS = [
    { name: 'Giallo Fluo', color: '#fefd00' },
    { name: 'Verde Fluo', color: '#5efd00' },
    { name: 'Fucsia Fluo', color: '#fe00f6' },
    { name: 'Arancio Fluo', color: '#fe8f00' },
];

const ColorPicker = ({ color, onChange, showSportColors = false, showWhite = false }) => {
    
    const handleColorChange = (colorResult) => {
        onChange(colorResult.hex);
    };

    const handlePresetChange = (presetColor) => {
        onChange(presetColor);
    }
    
    const getGridColsClass = () => {
        let count = 2; // Presets, RGB
        if (showSportColors) count++;
        if (showWhite) count++;
        if (count === 4) return 'grid-cols-4';
        if (count === 3) return 'grid-cols-3';
        return 'grid-cols-2';
    };

    return (
        <div className="w-[280px] p-2 bg-slate-800 border border-slate-700 rounded-md">
            <Tabs defaultValue="presets" className="w-full">
                <TabsList className={`grid w-full ${getGridColsClass()} bg-slate-900`}>
                    <TabsTrigger value="presets"><Palette className="w-4 h-4 mr-1"/> Predefiniti</TabsTrigger>
                    {showWhite && <TabsTrigger value="white"><Snowflake className="w-4 h-4 mr-1"/> Bianco</TabsTrigger>}
                    {showSportColors && <TabsTrigger value="sport" className="text-yellow-300"><Zap className="w-4 h-4 mr-1"/> Sport</TabsTrigger>}
                    <TabsTrigger value="rgb"><Droplet className="w-4 h-4 mr-1"/> RGB</TabsTrigger>
                </TabsList>
                <TabsContent value="presets" className="pt-2">
                    <div className="grid grid-cols-7 gap-2">
                        {PRESET_COLORS.map(c => (
                            <Button key={c} variant="outline" className="h-8 w-8 p-0 border-2" style={{borderColor: c}} onClick={() => handlePresetChange(c)}>
                                <div className="h-full w-full rounded-sm" style={{backgroundColor: c}}></div>
                            </Button>
                        ))}
                    </div>
                </TabsContent>
                {showWhite && (
                    <TabsContent value="white" className="pt-2">
                        <div className="flex justify-center">
                            <Button variant="outline" className="h-20 w-20 p-0 border-4 border-slate-600" onClick={() => handlePresetChange('#ffffff')}>
                                <div className="h-full w-full rounded-sm bg-white"></div>
                            </Button>
                        </div>
                         <p className="text-xs text-center text-slate-400 mt-2">Seleziona bianco puro per la stampa.</p>
                    </TabsContent>
                )}
                 {showSportColors && (
                    <TabsContent value="sport" className="pt-2">
                        <TooltipProvider>
                            <div className="grid grid-cols-4 gap-2">
                                {SPORT_COLORS.map(c => (
                                    <Tooltip key={c.name}>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" className="h-10 w-10 p-0 border-2" style={{borderColor: c.color}} onClick={() => handlePresetChange(c.color)}>
                                                <div className="h-full w-full rounded-sm" style={{backgroundColor: c.color}}></div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{c.name}</p></TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    </TabsContent>
                )}
                <TabsContent value="rgb" className="pt-2 flex justify-center">
                    <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                        disableAlpha={true}
                        presetColors={[]}
                        styles={{
                            default: {
                                picker: {
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    padding: '0',
                                },
                                color: {
                                    width: '100%',
                                    height: '20px',
                                },
                                controls: {
                                    color: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                },
                                activeColor: {
                                    boxShadow: 'none',
                                },
                            }
                        }}
                    />
                </TabsContent>
            </Tabs>
            <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-slate-600" style={{ backgroundColor: color }} />
                <div className="flex-1 text-sm font-mono bg-slate-900 px-2 py-1 rounded">{color}</div>
            </div>
        </div>
    );
};

export default ColorPicker;