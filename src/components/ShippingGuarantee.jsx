import React from 'react';
import { Truck, Clock, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ShippingGuarantee = ({ productionTime = "24h", deliveryTime = "24/48h" }) => {
    const getEstimatedDelivery = () => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 3);
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return deliveryDate.toLocaleDateString('it-IT', options);
    };

    return (
        <div className="my-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
                {/* Production & Delivery */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center text-gray-300 gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>Produzione: <span className="text-white font-medium">{productionTime}</span></span>
                    </div>
                    <div className="flex items-center text-gray-300 gap-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span>Consegna: <span className="text-white font-medium">{deliveryTime}</span></span>
                    </div>
                </div>

                {/* Estimate */}
                <div className="flex-1 sm:text-right">
                    <div className="bg-cyan-500/10 rounded-lg px-3 py-2 border border-cyan-500/20 inline-block">
                        <p className="text-xs text-cyan-300 font-semibold uppercase tracking-wider mb-1">Consegna Stimata</p>
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Calendar className="w-4 h-4" />
                            {getEstimatedDelivery()}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 justify-start sm:justify-end text-[10px] text-gray-400">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>Spedizione tracciata</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingGuarantee;
