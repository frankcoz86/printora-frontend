import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Text, Superscript } from 'lucide-react';

const DtfTextTab = ({ onAddText }) => {
    return (
        <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-lg space-y-3 border border-slate-700">
                <h3 className="text-md font-semibold border-b border-slate-600 pb-2 flex items-center">
                    <Superscript className="mr-2 h-5 w-5 text-cyan-300"/> Testo Grafico
                </h3>
                <p className="text-sm text-slate-400">
                    Ideale per titoli o scritte singole. Si comporta come un'immagine, la dimensione del font si adatta per riempire lo spazio.
                </p>
                <Button onClick={() => onAddText('graphic')} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Superscript className="mr-2 h-4 w-4" /> Aggiungi Testo Grafico
                </Button>
            </div>

             <div className="bg-slate-800/50 p-4 rounded-lg space-y-3 border border-slate-700">
                <h3 className="text-md font-semibold border-b border-slate-600 pb-2 flex items-center">
                    <Text className="mr-2 h-5 w-5 text-cyan-300"/> Casella di Testo
                </h3>
                <p className="text-sm text-slate-400">
                    Perfetta per paragrafi o testi su più righe. Il testo va a capo automaticamente e puoi definire la dimensione del font.
                </p>
                <Button onClick={() => onAddText('textbox')} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Text className="mr-2 h-4 w-4" /> Aggiungi Casella di Testo
                </Button>
            </div>
        </div>
    );
};

export default DtfTextTab;