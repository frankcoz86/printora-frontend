import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import QuantitySelector from '@/components/QuantitySelector';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, getCartSubtotal, getCartQuantity, updateCartItemQuantity } = useCart();

  const subtotal = getCartSubtotal();
  const cartQuantity = getCartQuantity();

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-700"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">Il Tuo Carrello</h2>
                {cartQuantity > 0 && (
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {cartQuantity}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <div className="relative mb-6 flex items-center justify-center w-32 h-32 rounded-full bg-slate-800">
                  <ShoppingBag className="w-16 h-16 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Il carrello è vuoto</h3>
                <p className="text-slate-400 text-sm max-w-xs">Aggiungi prodotti per vederli qui.</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-grow">
                  <div className="p-6 space-y-4">
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                          className="flex items-start gap-4 py-4 border-b border-slate-800 last:border-b-0"
                        >
                          <div className="w-20 h-20 bg-slate-800 rounded-md flex items-center justify-center overflow-hidden shrink-0 p-1">
                            {item.details?.fileUrl ? (
                              <img src={item.details.fileUrl} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              item.image ?
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                : <ImageIcon className="w-8 h-8 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-grow pr-4">
                            <h3 className="font-medium text-white text-lg mb-1 leading-tight">{item.name}</h3>

                            {/* Show dimensions */}
                            {item.details?.dimensions && (
                              <p className="text-sm text-slate-400">📏 {item.details.dimensions}</p>
                            )}

                            {/* Show extras/options */}
                            {item.details?.options && item.details.options !== 'Nessuna' && (
                              <p className="text-xs text-emerald-300 mt-1">✨ {item.details.options}</p>
                            )}

                            {/* Fallback to description if no dimensions */}
                            {!item.details?.dimensions && item.details?.description && (
                              <p className="text-sm text-slate-400">{item.details.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <QuantitySelector
                                quantity={item.quantity}
                                setQuantity={(newQuantity) => updateCartItemQuantity(item.id, newQuantity)}
                                onRemove={() => removeFromCart(item.id)}
                                min={1}
                              />
                              <p className="text-xl font-semibold text-primary shrink-0">€{(item.total || 0).toFixed(2)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-500 hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <div className="p-6 border-t border-slate-700 mt-auto bg-slate-900">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-lg">
                      <span className="text-slate-400">Subtotale</span>
                      <span className="font-semibold text-white">€{subtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500 text-left">IVA inclusa. Spedizione calcolata al checkout.</p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-12 bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Link to="/carrello">
                      <span>Vai al Checkout</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;