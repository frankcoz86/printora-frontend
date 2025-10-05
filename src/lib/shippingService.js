import React from 'react';

const shippingRates = [
  { id: 'BRT-std', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: 5, price: 10.00 },
  { id: 'BRT-med', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: 10, price: 15.00 },
  { id: 'BRT-lrg', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: 20, price: 20.00 },
  { id: 'BRT-xl', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: 30, price: 25.00 },
  { id: 'BRT-xxl', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: 50, price: 35.00 },
  { id: 'BRT-heavy', name: 'BRT Standard', time: 'Consegna in 2-3 giorni', maxWeight: Infinity, price: 50.00 },
];

export const calculateShippingRates = ({ weight }) => {
  if (typeof weight !== 'number' || weight < 0) {
    return [];
  }
  
  const rate = shippingRates.find(r => weight <= r.maxWeight);
  
  if (rate) {
    return [{...rate}];
  }

  return [];
};