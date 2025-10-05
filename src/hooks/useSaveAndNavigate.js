import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useSaveAndNavigate = (fabricRef, designState, onAddToCart) => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const calculateBannerPrice = useCallback((state) => {
        const { width, height, product, extras, sleeveSides } = state;
        if (!width || !height || !product) return 0;

        const areaMq = (width / 100) * (height / 100);
        const perimeterM = ((width / 100) + (height / 100)) * 2;
        const basePricePerMq = 8.90;
        
        let singleBannerPrice = areaMq * basePricePerMq;

        const hasReinforcement = extras?.some(e => e.name.includes('Rinforzo'));
        if (hasReinforcement) {
            const reinforcementExtra = product.extras.find(e => e.name.includes('Rinforzo'));
            if (reinforcementExtra) {
                singleBannerPrice += perimeterM * reinforcementExtra.price;
            }
        }
        
        const hasSleeve = extras?.some(e => e.name.includes('Asola'));
        if (hasSleeve && sleeveSides) {
            const sleeveExtra = product.extras.find(e => e.name.includes('Asola'));
            let sleeveLengthM = 0;
            if (sleeveExtra) {
                if(sleeveSides.top) { sleeveLengthM += width / 100; }
                if(sleeveSides.bottom) { sleeveLengthM += width / 100; }
                if(sleeveSides.left) { sleeveLengthM += height / 100; }
                if(sleeveSides.right) { sleeveLengthM += height / 100; }

                if(sleeveLengthM > 0){
                    singleBannerPrice += sleeveLengthM * sleeveExtra.price;
                }
            }
        }
        
        return singleBannerPrice;
    }, []);

    const getProductWeight = useCallback(() => {
        if (!designState || !designState.product) return 1;

        const { product, width, height, selectedThickness } = designState;
        const areaMq = (width / 100) * (height / 100);

        if ((product.type === 'rigid-media' || product.type === 'forex') && product.weightPerSqmPerMm && selectedThickness) {
            return areaMq * product.weightPerSqmPerMm * selectedThickness.value;
        }
        
        if (product.weight) { 
            return product.type === 'banner' ? areaMq * product.weight : product.weight;
        }
        
        if (product.type === 'vinyl') {
            return areaMq * 0.15; // Approximate weight for vinyl
        }

        return 1; 
    }, [designState]);

    const saveAndAddToCart = useCallback(async (dataUrl) => {
        if (!fabricRef.current || !designState || !dataUrl) {
            toast({ title: "Errore", description: "Impossibile salvare il design. Dati mancanti.", variant: "destructive" });
            return;
        }
        
        try {
            const { product, width, height, quantity, extras, sleeveSides } = designState;
            
            let price = 0;
            if (product.type === 'banner') {
                price = calculateBannerPrice({ width, height, product, extras, sleeveSides });
            } else {
                price = designState.price || product.price || 0;
            }

            const weight = getProductWeight();

            const productForCart = {
                id: `${product.id}-${width}x${height}`,
                name: product.name,
                image: product.images?.[0]?.src || product.image || '',
                price: price,
                type: product.type,
                weight: weight,
            };

            const itemDetails = {
                dimensions: `${width}cm x ${height}cm`,
                fileUrl: dataUrl,
                fileName: `design_${Date.now()}.png`,
                options: extras?.map(e => e.name).join(', ') || 'Nessuna',
                area: (width / 100) * (height / 100),
            };

            if (product.type === 'rigid-media' || product.type === 'forex') {
                itemDetails.material = product.name;
                itemDetails.thickness = designState.selectedThickness?.label || '';
            }
            if (product.type === 'vinyl') {
                itemDetails.material = product.name;
                itemDetails.lamination = extras?.some(e => e.id === 'lamination') ? 'Sì' : 'No';
            }
            if (product.type === 'banner') {
                itemDetails.eyelets = extras?.some(e => e.name.includes('Occhielli'));
                itemDetails.reinforcement = extras?.some(e => e.name.includes('Rinforzo'));
                itemDetails.sleeveSides = sleeveSides;
            }

            onAddToCart(productForCart, quantity, extras, itemDetails);

            toast({
                title: "Design salvato e aggiunto al carrello!",
                description: "Il tuo capolavoro è pronto per essere stampato.",
            });
            
            navigate('/carrello');

        } catch (error) {
            console.error("Error saving design to cart:", error);
            toast({
                title: "Errore nel salvataggio",
                description: "Non è stato possibile salvare il design. Riprova.",
                variant: "destructive",
            });
            throw error;
        }
    }, [fabricRef, designState, onAddToCart, toast, getProductWeight, navigate, calculateBannerPrice]);

    return { saveAndAddToCart };
};