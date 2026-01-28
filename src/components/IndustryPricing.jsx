import React from 'react';
import { motion } from 'framer-motion';
import { Check, TrendingDown, Building2, Euro } from 'lucide-react';

const ComparisonRow = ({ label, marketValue, printoraValue, isPrice = false, isPositive = true }) => (
    <div className="grid grid-cols-3 items-center py-4 border-b border-white/5 last:border-0 relative group">
        <div className="text-sm text-gray-400 font-medium pl-2">{label}</div>

        <div className="text-center relative">
            <div className={`text-sm ${isPrice ? 'line-through text-gray-500' : 'text-gray-500'}`}>
                {marketValue}
            </div>
            {/* Mobile label for context */}
            <span className="md:hidden absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-600 uppercase tracking-widest">Market</span>
        </div>

        <div className="text-center relative">
            <div className={`text-sm font-bold flex items-center justify-center gap-1.5 ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
                {printoraValue}
            </div>
            {/* Mobile label for context */}
            <span className="md:hidden absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-emerald-500/50 uppercase tracking-widest">Printora</span>
            <div className="absolute inset-0 bg-emerald-500/5 -mx-4 -my-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    </div>
);

const PriceComparison = ({ product }) => {
    const marketPrice = product.list_price || product.price * 1.8;
    const savingsPercent = Math.round(((marketPrice - product.price) / marketPrice) * 100);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-3 p-4 bg-white/5 border-b border-white/5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confronto</div>
                <div className="text-xs font-bold text-gray-500 text-center uppercase tracking-wider">Rivenditori</div>
                <div className="text-xs font-bold text-emerald-400 text-center uppercase tracking-wider bg-emerald-500/10 py-1 rounded-full">Printora</div>
            </div>

            <div className="p-4">
                <ComparisonRow
                    label="Prezzo"
                    marketValue={`€${marketPrice.toFixed(2)}`}
                    printoraValue={`€${product.price.toFixed(2)}`}
                    isPrice={true}
                />
                <ComparisonRow
                    label="Intermediari"
                    marketValue="Si (1-2)"
                    printoraValue={<><Check className="w-3 h-3" /> Diretto</>}
                    isPrice={false}
                />
                <ComparisonRow
                    label="Produzione"
                    marketValue="Esterna"
                    printoraValue={<><Building2 className="w-3 h-3" /> Interna</>}
                    isPrice={false}
                />
            </div>

            {/* Savings Footer */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-4 flex items-center justify-center gap-2 border-t border-emerald-500/20">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-semibold">Risparmi il {savingsPercent}% sui prezzi di mercato</span>
            </div>
        </div>
    );
};



const IndustryPricing = ({ product }) => {
    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            <div className="absolute -left-40 top-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Euro className="w-3 h-3" /> Prezzi Industriali
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Qualità da Rivenditore,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prezzi da Produttore.</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                            Saltando gli intermediari, ti offriamo l'accesso diretto ai prezzi di produzione.
                            La stessa qualità che trovi nelle grandi agenzie, ma a una frazione del costo.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                                    <Building2 className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Laboratorio Proprietario</h4>
                                    <p className="text-sm text-gray-500">100% Made in Italy, nessun outsourcing.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                                    <TrendingDown className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Listino Trasparente</h4>
                                    <p className="text-sm text-gray-500">Nessun costo nascosto, quello che vedi paghi.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl transform rotate-3"></div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
                            <PriceComparison product={product} />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default IndustryPricing;
