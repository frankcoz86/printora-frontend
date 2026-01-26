import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Zap, Factory, CheckCircle, Users } from 'lucide-react';

const ProfessionalCallout = () => {
    return (
        <div className="relative py-6">
            <motion.div
                className="grid md:grid-cols-3 gap-6 md:gap-px md:bg-white/5 md:rounded-2xl md:overflow-hidden md:border md:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Item 1: Production */}
                <div className="relative group bg-slate-900/60 md:bg-transparent rounded-xl md:rounded-none border border-white/10 md:border-none p-6 hover:bg-white/5 transition-colors duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                            <Factory className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Produzione Diretta</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Produciamo internamente, senza intermediari, per offrire qualità professionale a prezzi reali.
                        </p>
                    </div>
                </div>

                {/* Item 2: Target Audience */}
                <div className="relative group bg-slate-900/60 md:bg-transparent rounded-xl md:rounded-none border border-white/10 md:border-none p-6 hover:bg-white/5 transition-colors duration-300">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Per i Professionisti</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Ideale per <strong className="text-gray-300">tipografie, brand, agenzie, creator e aziende</strong> che cercano affidabilità.
                        </p>
                    </div>
                </div>

                {/* Item 3: Speed/Reliability */}
                <div className="relative group bg-slate-900/60 md:bg-transparent rounded-xl md:rounded-none border border-white/10 md:border-none p-6 hover:bg-white/5 transition-colors duration-300">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                            <Zap className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Ordini Rapidi</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tecnologia usata ogni giorno per produzione professionale e gestione veloce degli ordini.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfessionalCallout;
