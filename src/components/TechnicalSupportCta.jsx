import React from 'react';
import { MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const TechnicalSupportCta = ({ productName }) => {
    const phoneNumber = "393792775116";
    const message = `Ciao, ho bisogno di consulenza tecnica per ${productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="mb-6">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg p-3 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <div className="relative bg-slate-900 p-2 rounded-full border border-emerald-500/20 group-hover:border-emerald-500/40">
                            <FaWhatsapp className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Assistenza Tecnica Diretta</span>
                            <span className="text-[10px] ml-auto uppercase tracking-wide font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Esperti</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                            Dubbi? Un grafico a tua disposizione
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default TechnicalSupportCta;
