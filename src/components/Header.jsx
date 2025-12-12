import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Sparkles, Layers, RectangleVertical, Sticker, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useCart } from '@/context/CartContext';

const NavItem = ({ to, children, className }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
            } ${className}`
        }
    >
        {({ isActive }) => (
            <>
                {children}
                {isActive && (
                    <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-300"
                        layoutId="underline"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </>
        )}
    </NavLink>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleCart, cart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link to="/">
                        <Logo className="h-12 w-auto" />
                    </Link>

                    <nav className="hidden md:flex items-center space-x-4">
                        <Button asChild variant="banner" size="sm">
                            <Link to="/banner" className="flex items-center">
                                <Layers className="w-4 h-4 mr-2" />
                                Banner
                            </Link>
                        </Button>
                        <Button asChild variant="rollup" size="sm">
                            <Link to="/rollup" className="flex items-center">
                                <RectangleVertical className="w-4 h-4 mr-2" />
                                Roll-up
                            </Link>
                        </Button>
                        {/*
<Button asChild variant="vinile" size="sm">
    <Link to="/vinile-adesivo" className="flex items-center">
        <Sticker className="w-4 h-4 mr-2" />
        Vinile
    </Link>
</Button>
*/}
                        {/*
<Button asChild variant="forex" size="sm">
    <Link to="/forex-pvc" className="flex items-center">
        <Square className="w-4 h-4 mr-2" />
        Forex
    </Link>
</Button>
*/}
                        
                        <Button asChild variant="dtf" size="sm">
                            <Link to="/dtf" className="flex items-center">
                                <Sparkles className="w-4 h-4 mr-2" />
                                DTF
                            </Link>
                        </Button>

                        <NavItem to="/recensioni-lavori">Recensioni</NavItem>
                        <NavItem to="/contatti">Contatti</NavItem>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={toggleCart} className="relative text-gray-300 hover:text-white">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-t border-slate-800"
                    >
                        <nav className="flex flex-col items-center space-y-4 p-4">
                            <Link to="/banner" className="flex items-center text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                                <Layers className="w-4 h-4 mr-2" />Banner
                            </Link>
                            <Link to="/rollup" className="flex items-center text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                                <RectangleVertical className="w-4 h-4 mr-2" />Roll-up
                            </Link>
                            {/*
<Link to="/vinile-adesivo" className="flex items-center text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
    <Sticker className="w-4 h-4 mr-2" />Vinile
</Link>
*/}
                            {/*
<Link to="/forex-pvc" className="flex items-center text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
    <Square className="w-4 h-4 mr-2" />Forex
</Link>
*/}
                            <Link to="/dtf" className="flex items-center text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                                <Sparkles className="w-4 h-4 mr-2" />DTF
                            </Link>
                            <Link to="/recensioni-lavori" className="text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Recensioni</Link>
                            <Link to="/contatti" className="text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Contatti</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;