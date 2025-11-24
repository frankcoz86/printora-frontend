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
    image: '/assets/banner1.png',
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
    image: '/assets/rollUp1.jpg',
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
          src: '/assets/dtf1.jpg',
          title: 'Stampa DTF Personalizzata',
          alt: 'T-shirt rossa con grafica colorata e testo "CREATE YOUR DESIGN", che illustra la personalizzazione con stampa DTF. Accanto, icone che rappresentano alta qualità, colori fluo, prezzi trasparenti e editor online.',
        },
        {
          id: 2,
          src: '/assets/dtf2.jpg',
          title: 'DTF Transfers',
          alt: 'Un rotolo di pellicola DTF con un transfer stampato di una testa di tigre dai colori vividi e la scritta "DTF TRANSFERS", con un taglierino e una spatola gialla accanto.',
        },
        {
          id: 3,
          src: '/assets/dtf3 (2).jpg',
          title: 'Applicazione DTF su Tessuti Diversi',
          alt: 'Una persona che applica un transfer DTF con una termopressa su una t-shirt, con altri capi personalizzati come un cappellino e una borsa sullo sfondo.',
        },
    ],
    weight: 0.1,
    extras: [
      { name: 'Colori FLUO (Giallo, Verde, Arancio, Rosa)', price: 2.00, unit: 'metro lineare' }
    ]
};

export const vinylProduct = {
    id: 'vinyl-adhesive',
    name: 'Vinile Adesivo Stampato',
    description: 'Stampa su vinile adesivo di alta qualità, perfetto per vetrine, decorazioni, automezzi e molto altro. Scegli tra diverse tipologie e finiture per un risultato impeccabile.',
    features: [
        'Stampa HD con colori brillanti e resistenti: Utilizziamo inchiostri ecosolventi di ultima generazione per garantire colori vividi e una lunga durata, anche in ambienti esterni, resistendo a UV e intemperie.',
        'Diverse finiture disponibili: Scegli tra vinile opaco per un look elegante e antiriflesso, lucido per colori più brillanti e un effetto "wet look", o microforato One-Way per vetrine che mantengono la visibilità dall\'interno.',
        'Opzione di plastificazione per una maggiore durata e protezione: Per applicazioni esterne o soggette a usura, la plastificazione (lucida o opaca) offre una protezione extra contro raggi UV, abrasioni e agenti atmosferici, prolungando la vita del tuo adesivo.',
        'Ideale per superfici piane e vetrine: I nostri vinili sono perfetti per decorare vetrine, pannelli, insegne, veicoli e qualsiasi superficie liscia. Facili da applicare e rimuovere senza lasciare residui, garantendo versatilità e praticità.'
    ],
    image: '/assets/vinile.png',
    imageAlt: 'PVC Adesivo Lucido, Opaco, One Way - Stampa con girasoli e interfaccia di design con testo "Crea i tuoi adesivi facilmente".',
    types: [
        { id: 'monomeric-matte', name: 'Vinile Adesivo Bianco Opaco Monomerico', price: 9.90, unit: 'mq', description: 'Finitura opaca, ideale per interni e superfici piane.' },
        { id: 'monomeric-gloss', name: 'Vinile Adesivo Bianco Lucido Monomerico', price: 9.90, unit: 'mq', description: 'Finitura lucida per colori più vividi. Uso interno.' },
        { id: 'one-way', name: 'Vinile Microforato One-Way', price: 14.90, unit: 'mq', description: 'Per vetrine: visibilità verso l\'esterno, grafica all\'esterno.' },
    ],
    cuttingOptions: [
        { id: 'none', name: 'Nessuno (non rifilato)', price: 0, unit: 'mq', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>' },
        { id: 'squared', name: 'Taglio Squadrato', price: 1.00, unit: 'mq', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM7 7h10v10H7z"/></svg>' },
        { id: 'contour-ext', name: 'Taglio Sagomato Esterno', price: 5.00, unit: 'mq', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>' },
        { id: 'contour-int-ext', name: 'Taglio Sagomato Esterno e Interno', price: 8.00, unit: 'mq', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/><circle cx="12" cy="12" r="3"/></svg>' }
    ],
    extras: [
        { id: 'lamination-glossy', name: 'Plastificazione Lucida', price: 4.00, unit: 'mq', description: 'Consigliata per uso esterno' },
        { id: 'lamination-matte', name: 'Plastificazione Opaca', price: 4.00, unit: 'mq', description: 'Consigliata per uso esterno' }
    ],
    formats: [
        { label: 'A6 (10.5x14.8 cm)', shortLabel: 'A6', width: 10.5, height: 14.8 },
        { label: 'A5 (14.8x21 cm)', shortLabel: 'A5', width: 14.8, height: 21 },
        { label: 'A4 (21x29.7 cm)', shortLabel: 'A4', width: 21, height: 29.7 },
        { label: 'A3 (29.7x42 cm)', shortLabel: 'A3', width: 29.7, height: 42 },
        { label: '50x50 cm', shortLabel: '50x50', width: 50, height: 50 },
        { label: '70x100 cm', shortLabel: '70x100', width: 70, height: 100 },
        { label: '100x140 cm', shortLabel: '100x140', width: 100, height: 140 },
    ],
    productionNote: 'Lavoriamo con bobine di vinile adesivo e laminazione con larghezza di 107 cm e 152 cm, con altezza massima di 50 metri. Se le dimensioni superano queste misure, la stampa verrà pannellizzata su più teli. Ad esempio, un vinile 180x300 cm può essere stampato su bobina da 107 cm, in 2 teli 90x300 con sormonto.'
};