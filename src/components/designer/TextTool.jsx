import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Copy, Ruler } from 'lucide-react';

const TextTool = ({ onAddText }) => {

    const handleAdd = () => {
        onAddText();
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-4 border border-slate-700 mt-4">
            <h3 className="text-md font-semibold border-b border-slate-600 pb-2 flex items-center">
                <Type className="mr-2 h-5 w-5 text-cyan-300"/> Aggiungi Testo
            </h3>
            
            <p className="text-sm text-slate-400">
                Aggiungi un nuovo campo di testo alla tela. Potrai modificare il contenuto, il font e le dimensioni dopo averlo aggiunto.
            </p>

            <Button onClick={handleAdd} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                <Type className="mr-2 h-4 w-4" /> Aggiungi Testo alla Tela
            </Button>
        </div>
    );
};

export default TextTool;