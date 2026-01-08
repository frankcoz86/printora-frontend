import React from 'react';
import { useCart } from '@/context/CartContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, ArrowRight, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackInitiateCheckout } from '@/lib/fbPixel';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const CartPage = () => {
    const { cart, removeFromCart, updateCartItemQuantity, getCartSubtotal, getCartQuantity } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartSubtotal();
    const quantity = getCartQuantity();

    if (cart.length === 0) {
        return (
            <div className="relative py-24 sm:py-32 bg-slate-900 overflow-hidden min-h-screen flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-10 blur-3xl animate-blob top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-10 blur-3xl animation-delay-4000 animate-blob bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <ShoppingCart className="mx-auto h-24 w-24 text-slate-500 mb-6" />
                        <h1 className="text-4xl font-bold text-white mb-4">Il tuo carrello è vuoto</h1>
                        <p className="text-slate-400 mb-8">Sembra che tu non abbia ancora aggiunto nulla. Esplora i nostri prodotti!</p>
                        <Button onClick={() => navigate('/')} size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                            Continua lo Shopping <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Carrello | Printora</title>
                <meta name="description" content="Rivedi il tuo ordine e procedi al checkout." />
            </Helmet>
            <div className="relative py-16 sm:py-24 bg-slate-900 overflow-hidden min-h-screen">
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-10 blur-3xl animate-blob top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-10 blur-3xl animation-delay-4000 animate-blob bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between items-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-lg">Il Tuo Carrello</h1>
                        <Button variant="outline" onClick={() => navigate('/')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Continua lo Shopping
                        </Button>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        <motion.div
                            className="lg:col-span-2 space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {cart.map(item => (
                                <motion.div key={item.id} variants={itemVariants} className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-contain mr-6 bg-slate-700/50" />
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-bold text-white">{item.name}</h2>
                                        {item.details?.dimensions && <p className="text-sm text-slate-400">{item.details.dimensions}</p>}
                                        {item.details?.type && <p className="text-sm text-slate-400">{item.details.type}</p>}
                                        {item.details?.description && <p className="text-sm text-slate-400 max-w-md truncate">{item.details.description}</p>}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateCartItemQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 text-center bg-slate-800 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                                            min="1"
                                        />
                                        <p className="text-lg font-semibold w-24 text-right text-white">€{(item.total || 0).toFixed(2)}</p>
                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="hover:bg-red-500/20">
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            className="lg:col-span-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 sticky top-24 shadow-2xl shadow-black/30">
                                <h2 className="text-2xl font-bold text-white mb-6">Riepilogo Ordine</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-300">
                                        <span>Subtotale ({quantity} articoli)</span>
                                        <span className="font-semibold text-white">€{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Spedizione</span>
                                        <span className="text-sm font-semibold text-green-400">Da calcolare</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-700">
                                        <span className="text-white">Totale (IVA Escl.)</span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">€{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Button onClick={() => {
                                        // Track Facebook Pixel InitiateCheckout event
                                        trackInitiateCheckout({
                                            content_ids: cart.map(item => String(item.productId ?? item.id ?? 'custom')),
                                            contents: cart.map(item => ({
                                                id: String(item.productId ?? item.id ?? 'custom'),
                                                quantity: Number(item.quantity ?? 1)
                                            })),
                                            value: subtotal,
                                            currency: 'EUR',
                                            num_items: quantity
                                        });
                                        navigate('/checkout');
                                    }} size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                                        Procedi al Checkout
                                        <CreditCard className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 text-center mt-4">Tasse e spedizione verranno calcolate al checkout.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;