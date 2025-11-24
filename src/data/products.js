import React from 'react';

export const products = [
  {
    id: 1,
    type: 'banner',
    name: 'Striscione PVC Occhiellato',
    price: 8.90,
    list_price: 15.90,
    unit: 'mq',
    description: 'I nostri striscioni pubblicitari in PVC da 510gr sono la soluzione perfetta per una comunicazione visiva d\'impatto e duratura. Stampati con colori vividi e resistenti, sono ideali per farti notare. Il prezzo promo include già gli occhielli metallici ogni 50cm!',
    features: [
      'Materiale PVC 510gr/mq, ultra-resistente',
      'Occhielli metallici inclusi ogni 50 cm per un fissaggio facile e sicuro',
      'Perfetto per uso interno ed esterno (resiste a pioggia, vento, UV)',
      'Qualità di stampa fotografica ad alta risoluzione con inchiostri Ecosolvent',
      'Termosaldatura per formati extra large'
    ],
    image: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/8b824a4794218f72e8c5b7dadac748c9.png',
    imageAlt: 'Striscione promozionale in PVC con prezzo di 8,90 euro al metro quadro e occhiellatura inclusa.',
    weight: 0.51,
    extras: [
      { name: 'Rinforzo perimetrale', price: 2.00, unit: 'ml' },
      { name: 'Occhielli metallici', price: 0, unit: 'inclusi' },
      { name: 'Asola perimetrale', price: 2.50, unit: 'ml' }
    ]
  },
  {
    id: 2,
    type: 'rollup',
    name: 'Roll-up Alluminio',
    price: 49.90,
    list_price: 89.90,
    unit: 'pz',
    description: 'L\'espositore roll-up è lo strumento di marketing definitivo per fiere, eventi e punti vendita. Struttura in alluminio, stampa su PVC 510gr e montaggio istantaneo. Comunica il tuo brand ovunque, con stile e professionalità.',
    features: [
      'Stampa HD su telo PVC 510gr/mq (non il comune PET, più robusto!)',
      'Struttura in alluminio leggera e riutilizzabile con riavvolgitore',
      'Montaggio e smontaggio in meno di 30 secondi',
      'Comoda borsa per il trasporto inclusa nel prezzo'
    ],
    image: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/017eefa149a15c8d93ed48f3d22f8b19.jpg',
    imageAlt: 'Espositore roll-up 85x200cm con telo personalizzato e borsa da trasporto nera',
    weight: 3.5,
    formats: [
      { label: '85x200 cm', promo_price: 49.90, list_price: 89.90, available: true },
      { label: '100x200 cm', promo_price: 64.90, list_price: 99.90, available: false }
    ],
    extras: []
  },
];

export const dtfProduct = {
    id: 3,
    type: 'dtf',
    name: 'Stampa DTF a Telo',
    price: 7.90,
    list_price: 12.90,
    unit: '56x100cm',
    description: 'Rivoluziona le tue personalizzazioni con la nostra stampa DTF (Direct-to-Film). Stampa fino a 9 colori (CMYK, Bianco e 4 colori FLUO) per una resa eccezionale. Ideale per abbigliamento e tessuti, per un risultato che lascia il segno.',
    features: [
        'Stampa su film con larghezza fissa di 56cm',
        'Tecnologia a 9 colori: CMYK + Bianco coprente + 4 canali FLUO (Giallo, Verde, Arancio, Rosa)',
        'Massima elasticità e resistenza ai lavaggi (non si crepa!)',
        'Pronto per l\'applicazione con termopressa su cotone, poliestere e misti'
    ],
    images: [
        {
          id: 1,
          src: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/23b8816b6a0fd8ef10e079d9ca1cee13.jpg',
          title: 'Stampa DTF Personalizzata',
          alt: 'T-shirt rossa con grafica colorata e testo "CREATE YOUR DESIGN", che illustra la personalizzazione con stampa DTF. Accanto, icone che rappresentano alta qualità, colori fluo, prezzi trasparenti e editor online.',
        },
        {
          id: 2,
          src: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/9948b4611fb63285ece4830414b55e4d.jpg',
          title: 'DTF Transfers',
          alt: 'Un rotolo di pellicola DTF con un transfer stampato di una testa di tigre dai colori vividi e la scritta "DTF TRANSFERS", con un taglierino e una spatola gialla accanto.',
        },
        {
          id: 3,
          src: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/80d55532926dad977fae05845cd191bb.jpg',
          title: 'Applicazione DTF su Tessuti Diversi',
          alt: 'Una persona che applica un transfer DTF con una termopressa su una t-shirt, con altri capi personalizzati come un cappellino e una borsa sullo sfondo.',
        },
    ],
    weight: 0.1,
    extras: [
      { name: 'Colori FLUO (Giallo, Verde, Arancio, Rosa)', price: 2.00, unit: 'metro lineare' }
    ]
};