export const bannerTemplates = [
  {
    id: 'vendesi-classic-pro',
    name: 'Vendesi Classico Pro',
    category: 'Immobiliare',
    description: 'Design pulito e ad alto impatto per la vendita.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a5c96328a6f4a86acdd62a56113b2c34.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#d90429', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'VENDESI', left: w / 2, top: h * 0.4, width: w * 0.85, fontSize: h * 0.45, fill: 'white', fontWeight: '900', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true, charSpacing: w * 0.01 },
        { type: 'rect', left: w/2, top: h * 0.75, width: w * 0.7, height: h * 0.25, fill: '#edf2f4', selectable: false, excludeFromExport: true, originX: 'center', originY: 'center' },
        { type: 'textbox', text: 'CHIAMA: 333 1234567', left: w / 2, top: h * 0.75, width: w * 0.65, fontSize: h * 0.15, fill: '#d90429', fontWeight: 'bold', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'affittasi-modern-bold',
    name: 'Affittasi Moderno Bold',
    category: 'Immobiliare',
    description: 'Stile d\'impatto per annunci di affitto.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a88372671e626156a65bb742f36f46cc.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffb703', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'AFFITTASI', left: w / 2, top: h * 0.45, width: w * 0.9, fontSize: h * 0.6, fill: '#023047', fontWeight: '900', fontFamily: 'Impact', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'INFO E APPUNTAMENTI: 321 9876543', left: w / 2, top: h * 0.8, width: w * 0.8, fontSize: h * 0.15, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', backgroundColor: 'rgba(2, 48, 71, 0.8)', padding: 10, selectable: true },
      ];
    },
  },
   {
    id: 'vendita-appartamento-elegante',
    name: 'Vendita Appartamento',
    category: 'Immobiliare',
    description: 'Template elegante per la vendita di appartamenti.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/142918bb1b6939b70b58e7f827918a58.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#14213d', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'IN VENDITA', left: w * 0.1, top: h * 0.2, width: w * 0.8, fontSize: h * 0.3, fill: '#fca311', fontWeight: 'bold', fontFamily: 'Playfair Display', textAlign: 'left', originX: 'left', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Prestigioso appartamento\nCentro città', left: w * 0.1, top: h * 0.55, width: w * 0.8, fontSize: h * 0.2, fill: 'white', fontFamily: 'Montserrat', textAlign: 'left', originX: 'left', originY: 'center', lineHeight: 1.2, selectable: true },
        { type: 'textbox', text: 'Agenzia Immobiliare | Tel. 012 3456789', left: w * 0.1, top: h * 0.85, width: w * 0.8, fontSize: h * 0.1, fill: '#fca311', fontFamily: 'Montserrat', textAlign: 'left', originX: 'left', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'promo-flash-sale',
    name: 'Promo Flash Sale',
    category: 'Saldi e Promozioni',
    description: 'Design energico per vendite lampo.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a5948332a67a030d95015b6028a6f30d.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#000000', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'FLASH SALE', left: w / 2, top: h * 0.35, width: w * 0.8, fontSize: h * 0.4, fill: '#ffff00', fontWeight: '900', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'SCONTI FINO AL 70% ORA!', left: w / 2, top: h * 0.7, width: w * 0.9, fontSize: h * 0.25, fill: 'white', fontWeight: 'bold', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', backgroundColor: '#d90429', padding: 15, selectable: true },
      ];
    },
  },
   {
    id: 'black-friday-minimal',
    name: 'Black Friday Minimal',
    category: 'Saldi e Promozioni',
    description: 'Un design d\'impatto e minimale per il Black Friday.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/e69c849c71c1b3f5240c0f803c6130de.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffffff', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'BLACK\nFRIDAY', left: w / 2, top: h * 0.5, width: w * 0.85, fontSize: h * 0.45, fill: '#000000', fontWeight: '900', fontFamily: 'Anton', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 0.85, selectable: true },
        { type: 'textbox', text: 'OFFERTE IMPERDIBILI', left: w / 2, top: h * 0.85, width: w * 0.7, fontSize: h * 0.1, fill: '#000000', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', charSpacing: w*0.01, selectable: true },
      ];
    },
  },
  {
    id: 'apertura-nuova-moderna',
    name: 'Nuova Apertura Moderna',
    category: 'Eventi',
    description: 'Annuncia l\'apertura di una nuova attività con stile.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a3c9a896d194c2598a3e792c3a521fde.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#4a4e69', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'GRANDE APERTURA', left: w / 2, top: h * 0.4, width: w * 0.9, fontSize: h * 0.35, fill: '#f2e9e4', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Ti aspettiamo il [Data] in [Indirizzo]', left: w / 2, top: h * 0.75, width: w * 0.8, fontSize: h * 0.18, fill: '#f2e9e4', fontFamily: 'Poppins', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'menu-giorno-minimal',
    name: 'Menu del Giorno Minimal',
    category: 'Ristorazione',
    description: 'Presenta il menu del giorno in modo chiaro e pulito.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/6a70716c0220c3a886f4a86072b0c534.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#fefae0', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'IL MENU DI OGGI', left: w / 2, top: h * 0.15, width: w * 0.8, fontSize: h * 0.2, fill: '#606c38', fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'PRIMO\nSecondo\nDOLCE', left: w / 2, top: h * 0.55, width: w * 0.8, fontSize: h * 0.18, fill: '#283618', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1.5, selectable: true },
        { type: 'textbox', text: 'Prezzo fisso €15', left: w / 2, top: h * 0.85, width: w * 0.8, fontSize: h * 0.12, fill: '#606c38', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'pizza-promo-vintage',
    name: 'Offerta Pizza Vintage',
    category: 'Ristorazione',
    description: 'Promuovi le tue pizze con un design retrò.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/65c84d7286a63200b22a07c33f282490.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#faedcd', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'PIZZA NIGHT', left: w / 2, top: h * 0.3, width: w * 0.7, fontSize: h * 0.35, fill: '#d4a373', fontWeight: 'bold', fontFamily: 'Lobster', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: '2 Pizze + 2 Bibite = 15€', left: w / 2, top: h * 0.65, width: w * 0.8, fontSize: h * 0.25, fill: '#e63946', fontWeight: 'bold', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Tutti i martedì sera', left: w / 2, top: h * 0.85, width: w * 0.6, fontSize: h * 0.1, fill: '#d4a373', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'palestra-iscrizioni-pro',
    name: 'Iscrizioni Palestra Pro',
    category: 'Eventi',
    description: 'Banner energico per promuovere iscrizioni in palestra.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/be824c30c8aa115e347e3074094a973a.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#000000', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'NO PAIN\nNO GAIN', left: w / 2, top: h * 0.4, width: w * 0.9, fontSize: h * 0.4, fill: '#ffc300', fontWeight: '900', fontFamily: 'Anton', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 0.9, selectable: true },
        { type: 'textbox', text: 'ISCRIZIONE ANNUALE IN PROMO', left: w / 2, top: h * 0.8, width: w * 0.8, fontSize: h * 0.18, fill: '#ffffff', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'concerto-live-rock',
    name: 'Concerto Rock',
    category: 'Eventi',
    description: 'Promuovi un concerto rock con uno stile grintoso.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a59a72124566d8601831c9444141d019.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#1b1a17', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'ROCK NIGHT', left: w / 2, top: h * 0.3, width: w * 0.8, fontSize: h * 0.35, fill: '#f02d3a', fontFamily: 'Impact', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'NOME BAND\n+ SPECIAL GUEST\nVENERDÌ ORE 21', left: w / 2, top: h * 0.7, width: w * 0.8, fontSize: h * 0.2, fill: 'white', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1.3, selectable: true },
      ];
    },
  },
];