export const getShippingRate = (subtotal) => {
    let price;
    let name = 'Spedizione Standard';

    if (subtotal < 0) {
        price = 0; // Should not happen
    } else if (subtotal <= 40) {
        price = 7.90;
    } else if (subtotal <= 100) {
        price = 12.90;
    } else if (subtotal < 250) {
        price = 14.90;
    } else { // subtotal >= 250
        price = 0;
        name = 'Spedizione Gratuita';
    }

    return {
        id: 'tiered_shipping',
        name: name,
        time: '3-5 giorni lavorativi',
        price: price,
    };
};