import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, UploadCloud, Repeat, XCircle, Settings, FileImage, Loader2, Lock, Unlock } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"

const StepHeader = ({ number, title, icon }) => (
    <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-600 text-white font-bold">{number}</div>
        <h3 className="text-lg font-semibold text-fuchsia-300 flex items-center gap-2">{icon}{title}</h3>
    </div>
);

const MultiplierTool = ({ logos, setLogos, onApply, isApplying }) => {
    const [selectedLogoId, setSelectedLogoId] = React.useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const newLogosPromises = acceptedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const aspectRatio = img.width / img.height;
                        resolve({
                            id: `${file.name}-${Date.now()}`,
                            name: file.name,
                            src: reader.result,
                            count: 10,
                            spacingX: 10,
                            spacingY: 10,
                            width: 5,
                            height: 5 / aspectRatio,
                            aspectRatio,
                            locked: true,
                        });
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newLogosPromises).then(results => {
            setLogos(prev => [...prev, ...results]);
        });
    }, [setLogos]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] },
        multiple: true,
    });

    const updateLogoProperty = (id, prop, value) => {
        setLogos(prev => prev.map(logo => {
            if (logo.id === id) {
                const newLogo = { ...logo, [prop]: value };
                if (logo.locked) {
                    if (prop === 'width') {
                        newLogo.height = (value / logo.aspectRatio).toFixed(2);
                    } else if (prop === 'height') {
                        newLogo.width = (value * logo.aspectRatio).toFixed(2);
                    }
                }
                return newLogo;
            }
            return logo;
        }));
    };
    
    const toggleLock = (id) => {
        setLogos(prev => prev.map(logo => logo.id === id ? { ...logo, locked: !logo.locked } : logo));
    };

    const removeLogo = (id, e) => {
        e.stopPropagation();
        setLogos(prev => prev.filter(logo => logo.id !== id));
        if (selectedLogoId === id) {
            setSelectedLogoId(null);
        }
    };
    
    const removeAllLogos = () => {
        setLogos([]);
        setSelectedLogoId(null);
    }

    const selectedLogo = logos.find(logo => logo.id === selectedLogoId);

    return (
        <div className="space-y-6 mt-4">
            <div className="space-y-3">
                <StepHeader number="1" title="Carica Loghi" icon={<FileImage className="w-5 h-5"/>} />
                <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center
                    ${isDragActive ? 'border-fuchsia-400 bg-fuchsia-900/20' : 'border-slate-600 hover:border-fuchsia-500'}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Trascina i file qui o clicca per selezionare.</p>
                    <p className="text-xs text-slate-500 mt-1">Puoi caricare più file insieme.</p>
                </div>
            </div>

            <div className="space-y-3">
                <StepHeader number="2" title="Imposta Proprietà" icon={<Settings className="w-5 h-5"/>} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                         <Label className="text-sm font-semibold">Galleria Loghi ({logos.length})</Label>
                         {logos.length > 0 ? (
                            <>
                                <ScrollArea className="h-48 w-full rounded-md border border-slate-700 bg-slate-800/50">
                                    <div className="p-2 grid grid-cols-3 gap-2">
                                        {logos.map(logo => (
                                            <div
                                                key={logo.id}
                                                onClick={() => setSelectedLogoId(logo.id)}
                                                className={`relative group p-1 rounded-md cursor-pointer border-2 ${selectedLogoId === logo.id ? 'border-fuchsia-500 bg-fuchsia-900/30' : 'border-transparent hover:border-slate-600'}`}
                                            >
                                                <img src={logo.src} alt={logo.name} className="w-full h-16 object-contain rounded-sm" />
                                                <button onClick={(e) => removeLogo(logo.id, e)} className="absolute -top-1 -right-1 p-0.5 bg-slate-900 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <XCircle className="w-4 h-4"/>
                                                </button>
                                                <p className="text-[10px] text-slate-400 truncate text-center mt-1">{logo.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <Button variant="link" size="sm" onClick={removeAllLogos} className="text-red-400 hover:text-red-300 -mt-1 w-full justify-start">
                                    <Trash2 className="w-3 h-3 mr-1" /> Rimuovi Tutti i Loghi
                                </Button>
                            </>
                         ) : (
                            <div className="h-48 flex items-center justify-center text-center text-slate-500 text-sm bg-slate-800/50 rounded-lg border border-slate-700">
                                Nessun logo caricato.
                            </div>
                         )}
                    </div>
                    <div className="space-y-2">
                         <Label className="text-sm font-semibold">Impostazioni Logo Selezionato</Label>
                        <div className="bg-slate-800/50 p-4 rounded-lg h-full min-h-[220px] border border-slate-700 flex flex-col justify-center">
                           {selectedLogo ? (
                               <div className="space-y-3 animate-in fade-in-50">
                                    <Label className="font-bold text-white truncate block">Modifica: <span className="text-fuchsia-300">{selectedLogo.name}</span></Label>
                                    <div><Label className="text-xs">Quantità</Label><Input type="number" min="1" value={selectedLogo.count} onChange={(e) => updateLogoProperty(selectedLogo.id, 'count', parseInt(e.target.value, 10))} className="bg-slate-700 h-8 text-sm" /></div>
                                    <div className="grid grid-cols-2 gap-3 items-end">
                                        <div><Label className="text-xs">Larghezza (cm)</Label><Input type="number" min="1" value={selectedLogo.width} onChange={(e) => updateLogoProperty(selectedLogo.id, 'width', parseFloat(e.target.value))} className="bg-slate-700 h-8 text-sm" /></div>
                                        <div><Label className="text-xs">Altezza (cm)</Label><Input type="number" min="1" value={selectedLogo.height} onChange={(e) => updateLogoProperty(selectedLogo.id, 'height', parseFloat(e.target.value))} className="bg-slate-700 h-8 text-sm" disabled={selectedLogo.locked} /></div>
                                    </div>
                                    <div className="flex items-center justify-start -mt-1">
                                        <Button variant="ghost" size="sm" onClick={() => toggleLock(selectedLogo.id)}>
                                            {selectedLogo.locked ? <Lock className="w-3 h-3 mr-1"/> : <Unlock className="w-3 h-3 mr-1"/>}
                                            {selectedLogo.locked ? 'Blocca Proporzioni' : 'Sblocca Proporzioni'}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label className="text-xs">Spazio X (mm)</Label><Input type="number" value={selectedLogo.spacingX} onChange={(e) => updateLogoProperty(selectedLogo.id, 'spacingX', parseFloat(e.target.value))} className="bg-slate-700 h-8 text-sm" /></div>
                                        <div><Label className="text-xs">Spazio Y (mm)</Label><Input type="number" value={selectedLogo.spacingY} onChange={(e) => updateLogoProperty(selectedLogo.id, 'spacingY', parseFloat(e.target.value))} className="bg-slate-700 h-8 text-sm" /></div>
                                    </div>
                               </div>
                           ) : (
                               <p className="text-center text-slate-400 text-sm">Seleziona un logo dalla galleria per modificarne le impostazioni.</p>
                           )}
                        </div>
                    </div>
                 </div>
            </div>

            <div className="pt-2 space-y-3">
                 <StepHeader number="3" title="Applica Layout" icon={<Repeat className="w-5 h-5"/>} />
                <Button onClick={onApply} variant="secondary" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white mt-1 h-12 text-base" disabled={logos.length === 0 || isApplying}>
                    {isApplying ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Applicando...</>
                    ) : (
                        <><Repeat className="mr-2 h-5 w-5" /> Applica Serie e Riempi Telo</>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default MultiplierTool;