import React from 'react';
import { Link } from 'react-router-dom';
import { Palette } from 'lucide-react';

const TechnicalSupportCta = () => (
    <div className="mb-4">
        <Link
            to="/consulenza-grafica"
            className="group block w-full bg-violet-950/50 hover:bg-violet-900/50 border border-violet-500/30 hover:border-violet-500/60 rounded-lg p-3 transition-all duration-300"
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500 blur opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <div className="relative bg-slate-900 p-2 rounded-full border border-violet-500/20 group-hover:border-violet-500/40">
                        <Palette className="w-5 h-5 text-violet-400" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                            Consulenza Grafica Dedicata — €15
                        </span>
                        <span className="text-[10px] ml-auto uppercase tracking-wide font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full shrink-0">
                            Expert
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        Crea o corregge il tuo file · Consegna 24h · Garanzia rimborso
                    </p>
                </div>
            </div>
        </Link>
    </div>
);

export default TechnicalSupportCta;
