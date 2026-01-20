import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ExternalLink, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { galleryImages } from '@/data/galleryImages';

const THEMES = {
    banner: {
        name: 'Emerald',
        wrapper: 'from-emerald-950/50 to-slate-950',
        blob: 'bg-emerald-500/30',
        accentText: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        borderHover: 'group-hover:border-emerald-500/50',
        button: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        glow: 'shadow-emerald-900/20'
    },
    rollup: {
        name: 'Cyan',
        wrapper: 'from-cyan-950/50 to-slate-950',
        blob: 'bg-cyan-500/30',
        accentText: 'text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        borderHover: 'group-hover:border-cyan-500/50',
        button: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
        glow: 'shadow-cyan-900/20'
    },
    dtf: {
        name: 'Fuchsia',
        wrapper: 'from-fuchsia-950/50 to-slate-950',
        blob: 'bg-fuchsia-500/30',
        accentText: 'text-fuchsia-400',
        badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
        borderHover: 'group-hover:border-fuchsia-500/50',
        button: 'bg-fuchsia-500 text-white hover:bg-fuchsia-400',
        glow: 'shadow-fuchsia-900/20'
    },
    default: {
        name: 'Slate',
        wrapper: 'from-slate-900 to-slate-950',
        blob: 'bg-white/10',
        accentText: 'text-white',
        badge: 'bg-white/10 text-white border-white/20',
        borderHover: 'group-hover:border-white/50',
        button: 'bg-white text-slate-950 hover:bg-gray-200',
        glow: 'shadow-white/5'
    }
};

const ProductGallery = ({
    productType,
    title = 'Progetti Realizzati',
    subtitle = 'La qualità Printora nei lavori reali dei nostri clienti'
}) => {
    // 1. Determine theme
    const theme = THEMES[productType] || THEMES.default;

    // 2. Filter images
    const filteredImages = galleryImages.filter(img => img.productType === productType);

    if (filteredImages.length === 0) return null;

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Lightbox handlers
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const goToPrevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    const goToNextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goToPrevImage();
            if (e.key === 'ArrowRight') goToNextImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    // 3. Separate images for Rollup split layout
    const portraitImages = filteredImages.filter(img => img.orientation === 'portrait');
    const landscapeImages = filteredImages.filter(img => img.orientation !== 'portrait');

    return (
        <section className={`relative py-20 overflow-hidden bg-slate-950`}>
            {/* Background Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${theme.blob}`} />
                <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 bg-slate-700`} />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 backdrop-blur-md text-xs font-medium tracking-wide ${theme.accentText}`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>GALLERIA CLIENTI</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Gallery Layout */}
                {productType === 'rollup' ? (
                    /* SPLIT LAYOUT FOR ROLLUPS (Portrait Row + Landscape Row) */
                    <div className="space-y-12">
                        {/* Row 1: Portrait Images (9:16) */}
                        {portraitImages.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center md:justify-items-stretch">
                                {portraitImages.map((item, idx) => (
                                    <div key={`p-${idx}`} className="w-full max-w-[320px] md:max-w-none mx-auto md:mx-0">
                                        <GalleryCard item={item} theme={theme} index={idx} aspect="portrait" onClick={() => openLightbox(idx)} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Row 2: Landscape Images (16:9) */}
                        {landscapeImages.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {landscapeImages.map((item, idx) => {
                                    // Logic: Center last item if odd count on tablet
                                    const isLast = idx === landscapeImages.length - 1;
                                    const isOddCount = landscapeImages.length % 2 !== 0;
                                    const isRemainder1 = landscapeImages.length % 3 === 1;

                                    let centerClass = '';
                                    // Tablet centering (if odd)
                                    if (isLast && isOddCount) {
                                        centerClass += 'md:col-span-2 md:mx-auto md:w-[calc(50%-16px)] ';
                                    }
                                    // Desktop centering (if remainder 1)
                                    if (isLast && isRemainder1) {
                                        centerClass += 'lg:col-span-1 lg:col-start-2 lg:w-full lg:mx-0 ';
                                    } else if (isLast && isOddCount) {
                                        // Reset overrides on desktop if not remainder 1
                                        centerClass += 'lg:col-span-1 lg:col-start-auto lg:w-full lg:mx-0 ';
                                    }

                                    return (
                                        <GalleryCard
                                            key={`l-${idx}`}
                                            item={item}
                                            theme={theme}
                                            index={idx + portraitImages.length}
                                            aspect="landscape"
                                            className={centerClass}
                                            onClick={() => openLightbox(portraitImages.length + idx)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* UNIFORM GRID FOR LANDSCAPE IMAGES (Banner, DTF) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredImages.map((item, idx) => {
                            const isLast = idx === filteredImages.length - 1;
                            const isOddCount = filteredImages.length % 2 !== 0;
                            const isRemainder1 = filteredImages.length % 3 === 1;

                            let centerClass = ''; // Default grid classes
                            // Tablet centering (if odd count)
                            if (isLast && isOddCount) {
                                centerClass += 'md:col-span-2 md:mx-auto md:w-[calc(50%-16px)] ';
                            }
                            // Desktop centering (if count % 3 == 1)
                            if (isLast && isRemainder1) {
                                centerClass += 'lg:col-span-1 lg:col-start-2 lg:w-full lg:mx-0';
                            } else if (isLast && isOddCount) {
                                centerClass += 'lg:col-span-1 lg:col-start-auto lg:w-full lg:mx-0';
                            }

                            return (
                                <GalleryCard
                                    key={idx}
                                    item={item}
                                    theme={theme}
                                    index={idx}
                                    aspect="landscape"
                                    className={centerClass}
                                    onClick={() => openLightbox(idx)}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <div className={`w-2 h-2 rounded-full ${theme.blob.replace('/30', '')} animate-pulse`} />
                        <span>Immagini reali da ordini completati recentemente</span>
                    </div>
                </motion.div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-cyan-400 transition-all duration-200 group"
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/80 border border-slate-700 px-4 py-2 text-sm text-white backdrop-blur-sm">
                            <span className={`font-semibold ${theme.accentText}`}>{lightboxIndex + 1}</span>
                            <span className="text-slate-400"> / {filteredImages.length}</span>
                        </div>

                        {/* Previous button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevImage();
                            }}
                            className={`absolute left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-${theme.accentText.replace('text-', '')} transition-all duration-200 group`}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className={`w-6 h-6 group-hover:${theme.accentText} transition-colors`} />
                        </button>

                        {/* Next button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNextImage();
                            }}
                            className={`absolute right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-${theme.accentText.replace('text-', '')} transition-all duration-200 group`}
                            aria-label="Next image"
                        >
                            <ChevronRight className={`w-6 h-6 group-hover:${theme.accentText} transition-colors`} />
                        </button>

                        {/* Image container */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-w-7xl max-h-[90vh] mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={filteredImages[lightboxIndex].src}
                                alt={filteredImages[lightboxIndex].title}
                                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                            />

                            {/* Image info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent rounded-b-2xl p-6">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold text-white">
                                        {filteredImages[lightboxIndex].title}
                                    </h3>
                                    <span className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm border ${theme.badge}`}>
                                        {filteredImages[lightboxIndex].tag}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Keyboard hints */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">←</kbd>
                                <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">→</kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">ESC</kbd>
                                <span>Close</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const GalleryCard = ({ item, theme, index, aspect = 'landscape', className = '', onClick }) => {
    // Determine aspect ratio class
    const aspectRatioClass = aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';

    return (
        <motion.div
            // Add tabIndex for mobile focus/tap interaction
            tabIndex={0}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={onClick}
            // Added group-focus and group-active states for mobile touch feedback
            className={`group relative rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 ${theme.borderHover} transition-colors duration-500 shadow-2xl ${theme.glow} outline-none cursor-pointer ${className}`}
        >
            {/* Image Container */}
            <div className={`${aspectRatioClass} w-full relative overflow-hidden`}>
                {/* Main Image */}
                <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    // Added group-focus and group-active to trigger color reveal on tap
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus:scale-110 group-active:scale-110 filter grayscale group-hover:grayscale-0 group-focus:grayscale-0 group-active:grayscale-0"
                />

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-40 group-focus:opacity-40 transition-opacity duration-500" />

                {/* Hover Reveal Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-500">

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-lg leading-tight">
                        {item.title}
                    </h3>

                    {/* Divider line */}
                    <div className={`h-1 w-12 rounded-full mt-3 mb-4 transition-all duration-500 group-hover:w-24 group-focus:w-24 ${theme.blob.replace('/30', '')}`} />

                    {/* Moved Tag to Bottom (Replaces Visualizza dettaglio) */}
                    <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 delay-200`}>
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md border ${theme.badge}`}>
                            {item.tag}
                        </span>
                    </div>
                </div>
            </div>

            {/* Top Right "Zoom" Badge */}
            <div className="absolute top-4 right-4 z-20">
                <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-full p-2 group-hover:bg-slate-950/80 transition-colors">
                    <ZoomIn className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </div>
            </div>
        </motion.div>
    );
};

export default ProductGallery;
