import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, BarChart, Users, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
    stats: {
        revenue: 12530.55,
        orders: 152,
        avgOrderValue: 82.44,
        bestSeller: { name: 'Stampa DTF (telo)', count: 89 },
    },
    revenueData: [
        { name: 'Gen', 'Fatturato': 4000 },
        { name: 'Feb', 'Fatturato': 3000 },
        { name: 'Mar', 'Fatturato': 5000 },
        { name: 'Apr', 'Fatturato': 4500 },
        { name: 'Mag', 'Fatturato': 6200 },
        { name: 'Giu', 'Fatturato': 5800 },
        { name: 'Lug', 'Fatturato': 12530 },
    ],
    recentOrders: [
        { id: 'ORD-0152', customer: 'Mario Rossi', date: '2025-07-29', total: 120.00, status: 'Completato' },
        { id: 'ORD-0151', customer: 'Studio Grafico ABC', date: '2025-07-29', total: 450.50, status: 'In Lavorazione' },
        { id: 'ORD-0150', customer: 'Luigi Bianchi', date: '2025-07-28', total: 75.20, status: 'Completato' },
        { id: 'ORD-0149', customer: 'T-Shirt World', date: '2025-07-27', total: 890.00, status: 'Spedito' },
        { id: 'ORD-0148', customer: 'Anna Verdi', date: '2025-07-26', total: 35.80, status: 'Completato' },
    ]
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between"
    >
        <div>
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <Icon className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        {trend && (
            <div className="flex items-center text-xs text-green-400 mt-4">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>{trend} vs mese scorso</span>
            </div>
        )}
    </motion.div>
);

const DashboardPage = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard Aziendale - Printora</title>
                <meta name="description" content="Il tuo centro di controllo per monitorare le performance di Printora." />
            </Helmet>
            <div className="relative min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.1),_transparent_40%)]"></div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-extrabold text-white">Dashboard Aziendale</h1>
                        <p className="text-lg text-gray-400 mt-1">Benvenuto nel tuo centro di controllo.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <StatCard title="Fatturato (Luglio)" value={`€${mockData.stats.revenue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} icon={DollarSign} trend="+22.5%" />
                        <StatCard title="Ordini Totali (Luglio)" value={mockData.stats.orders} icon={ShoppingCart} trend="+15%" />
                        <StatCard title="Valore Medio Ordine" value={`€${mockData.stats.avgOrderValue.toFixed(2)}`} icon={BarChart} />
                        <StatCard title="Prodotto Top" value={mockData.stats.bestSeller.name} icon={Users} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Andamento Fatturato</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={mockData.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" tickFormatter={(value) => `€${value/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                                                borderColor: '#a855f7',
                                                color: '#fff'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="Fatturato" stroke="#a855f7" strokeWidth={2} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg"
                        >
                             <h3 className="text-xl font-bold text-white mb-4">Ordini Recenti</h3>
                             <div className="space-y-4">
                                 {mockData.recentOrders.map(order => (
                                     <div key={order.id} className="flex justify-between items-center text-sm">
                                         <div>
                                             <p className="font-semibold text-white">{order.id}</p>
                                             <p className="text-gray-400">{order.customer}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="font-bold text-white">€{order.total.toFixed(2)}</p>
                                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                 order.status === 'Completato' ? 'bg-green-500/20 text-green-300' :
                                                 order.status === 'In Lavorazione' ? 'bg-yellow-500/20 text-yellow-300' :
                                                 'bg-cyan-500/20 text-cyan-300'
                                             }`}>
                                                 {order.status}
                                             </span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;