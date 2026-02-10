export const getShippingRate = (subtotal) => {
    let price;
    let name = 'Spedizione Standard';

    if (subtotal < 0) {
        price = 0; // Should not happen
    } else if (subtotal <= 50) {
        price = 7.90;
    } else if (subtotal <= 150) {
        price = 9.90;
    } else { // subtotal > 150
        price = 12.90;
    }

    return {
        id: 'tiered_shipping',
        name: name,
        time: '3-5 giorni lavorativi',
        price: price,
    };
};