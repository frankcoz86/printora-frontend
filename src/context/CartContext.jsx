import React, { createContext, useContext, useState, useEffect } from 'react';
import { gtmPush } from '@/lib/gtm';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('printora_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Could not parse cart from localStorage', error);
    return [];
  }
};

// Small utility to coerce numeric values safely
const n = (val, fallback = 0) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('printora_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Could not save cart to localStorage', error);
    }
  }, [cart]);

  /**
   * Normalized addToCart that supports:
   * 1) addToCart(product, quantity, selectedExtras?, details?)
   * 2) addToCart({ product, name?, image?, price?, quantity?, extras?, total?, details? })
   */
  const addToCart = (arg1, quantity, selectedExtras = [], details = {}) => {
    let product, qty, extras, unitPrice, lineTotal, det, displayName, image;

    if (arg1 && typeof arg1 === 'object' && 'product' in arg1) {
      // Object signature (e.g., Designer flow)
      const payload = arg1;
      product = payload.product || {};
      qty = n(payload.quantity, 1);
      extras = payload.extras || payload.selectedExtras || [];
      // Prefer explicitly provided price/total; fall back to product.price * qty
      unitPrice = n(payload.price, n(product.price, 0));
      lineTotal = n(payload.total, unitPrice * qty);
      det = payload.details || {};
      displayName = payload.name ?? product.name;
      image = payload.image ?? det.fileUrl ?? product.image;
    } else {
      // Positional signature (legacy)
      product = arg1 || {};
      qty = n(quantity, 1);
      extras = selectedExtras || [];

      // Some pages mistakenly pass total as the 4th argument (details as number)
      if (typeof details === 'number') {
        lineTotal = n(details);
        det = {};
      } else {
        det = details || {};
      }

      unitPrice = n(product.price, 0);
      lineTotal = n(lineTotal, unitPrice * qty);
      displayName = product.name;
      image = det.fileUrl ?? product.image;
    }

    // Final safety
    if (!Number.isFinite(unitPrice)) unitPrice = 0;
    if (!Number.isFinite(lineTotal)) lineTotal = unitPrice * qty;

    const newItem = {
      id: `${product.id || 'custom'}-${Date.now()}`,
      productId: product.id,
      name: displayName,
      image,
      price: n(unitPrice, 0),
      quantity: Math.max(1, n(qty, 1)),
      selectedExtras: extras,
      total: Number(n(lineTotal, unitPrice * qty).toFixed(2)),
      details: { ...det, weight: n(product.weight, 0.5) },
    };

    setCart(prevCart => [...prevCart, newItem]);
    setIsCartOpen(true);
     try {
     const item = {
       item_id: String(newItem.productId ?? newItem.id ?? newItem.name ?? 'custom'),
       item_name: String(newItem.name ?? 'Item'),
       price: Number(newItem.price ?? 0),
       quantity: Number(newItem.quantity ?? 1),
       item_category: newItem.details?.category || 'custom',
       item_brand: 'Printora',
       image_url: newItem.image || undefined,
     };

     gtmPush({
       event: 'add_to_cart',
       ecommerce: {
         currency: 'EUR',
         value: Number(newItem.total ?? (item.price * item.quantity) ?? 0),
         items: [item],
       },
     });
   } catch {}
  };

  /**
   * Add multiple items. Accepts an array of either:
   * - { product, name?, image?, price?, quantity, extras?, total?, details? }
   * - { product, quantity, selectedExtras?, details? } (positional-style data)
   */
  const addMultipleToCart = items => {
    setCart(prevCart => {
      const newItems = (items || []).map(item => {
        const product = item.product || {};
        const qty = Math.max(1, n(item.quantity, 1));
        const extras = item.extras || item.selectedExtras || [];
        const unitPrice = n(item.price, n(product.price, 0));
        const total = Number(n(item.total, unitPrice * qty).toFixed(2));
        const details = item.details || {};
        const name = item.name ?? product.name;
        const image = item.image ?? details.fileUrl ?? product.image;

        return {
          id: `${product.id || 'custom'}-${Date.now()}-${Math.random()}`,
          productId: product.id,
          name,
          image,
          price: unitPrice,
          quantity: qty,
          selectedExtras: extras,
          total,
          details: { ...details, weight: n(product.weight, 0.5) },
        };
      });

      return [...prevCart, ...newItems];
    });
    setIsCartOpen(true);
    try {
     (items || []).forEach((it) => {
       const product = it.product || {};
       const qty = Math.max(1, Number(it.quantity ?? 1));
       const unitPrice = Number(it.price ?? product.price ?? 0) || 0;
       const total = Number(it.total ?? unitPrice * qty) || 0;
       const name = it.name ?? product.name ?? 'Item';

       const dlItem = {
         item_id: String(product.id ?? name ?? 'custom'),
         item_name: String(name),
         price: unitPrice,
         quantity: qty,
         item_category: it?.details?.category || 'custom',
         item_brand: 'Printora',
         image_url: it.image || it.details?.fileUrl || product.image || undefined,
       };

       gtmPush({
         event: 'add_to_cart',
         ecommerce: {
         currency: 'EUR',
         value: total,
         items: [dlItem],
       },
     });
   });
   } catch {}
  };

  const updateCartItemQuantity = (itemId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id !== itemId) return item;
        const qty = Math.max(1, n(quantity, 1));
        const unit = n(item.price, 0);
        const newTotal = Number((unit * qty).toFixed(2));
        return { ...item, quantity: qty, total: newTotal };
      })
    );
  };

  const removeFromCart = itemId => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => {
      const line =
        Number.isFinite(item?.total) && !Number.isNaN(item.total)
          ? n(item.total, 0)
          : n(item.price, 0) * Math.max(1, n(item.quantity, 1));
      return sum + line;
    }, 0);
  };

  const getCartQuantity = () => {
    return cart.reduce((count, item) => count + Math.max(1, n(item.quantity, 1)), 0);
  };

  const getCartWeight = () => {
    return cart.reduce((totalWeight, item) => {
      const itemWeight = n(item.details?.weight, 0.5) * Math.max(1, n(item.quantity, 1));
      return totalWeight + itemWeight;
    }, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    toggleCart,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    getCartSubtotal,
    getCartQuantity,
    getCartWeight,
    updateCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
