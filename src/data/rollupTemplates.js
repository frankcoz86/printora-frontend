export const rollupTemplates = [
  {
    id: 'rollup-promo-modern-pro',
    name: 'Promo Moderna Pro',
    category: 'Saldi e Promozioni',
    description: 'Un design energico per la tua offerta speciale.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/4c7ff591e92da39ffc485293297a7cc2.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffffff', selectable: false, excludeFromExport: true },
        { type: 'rect', left: 0, top: 0, width: w, height: h * 0.3, fill: '#e63946', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'PROMOZIONE\nESCLUSIVA', left: w / 2, top: h * 0.15, width: w * 0.8, fontSize: h * 0.08, fill: 'white', fontWeight: '900', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1, selectable: true },
        { type: 'textbox', text: '-30%', left: w / 2, top: h * 0.45, width: w * 0.7, fontSize: h * 0.2, fill: '#1d3557', fontWeight: '900', fontFamily: 'Anton', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Su tutti i prodotti selezionati\nOfferta valida fino al [Data]', left: w / 2, top: h * 0.7, width: w * 0.8, fontSize: h * 0.05, fill: '#457b9d', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'www.iltuosito.com', left: w / 2, top: h * 0.9, width: w * 0.8, fontSize: h * 0.04, fill: '#1d3557', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'rollup-evento-corporate-clean',
    name: 'Evento Corporate Clean',
    category: 'Eventi e Fiere',
    description: 'Grafica minimale e professionale per conferenze.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/f7c00e163d7e59b2075a331a9cd288eb.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#f8f9fa', selectable: false, excludeFromExport: true },
        { type: 'rect', left: 0, top: h*0.85, width: w, height: h * 0.15, fill: '#0077b6', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'INNOVAZIONE E FUTURO', left: w * 0.1, top: h * 0.2, width: w * 0.8, fontSize: h * 0.1, fill: '#0077b6', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: 'left', originX: 'left', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Il nostro evento annuale per esplorare le nuove frontiere della tecnologia.', left: w * 0.1, top: h * 0.4, width: w * 0.8, fontSize: h * 0.05, fill: '#495057', fontFamily: 'Poppins', textAlign: 'left', originX: 'left', originY: 'center', lineHeight: 1.4, selectable: true },
        { type: 'textbox', text: '[DATA] | [LOCATION]', left: w * 0.1, top: h * 0.6, width: w * 0.8, fontSize: h * 0.06, fill: '#0077b6', fontWeight: 'bold', fontFamily: 'Poppins', textAlign: 'left', originX: 'left', originY: 'center', selectable: true },
        { type: 'textbox', text: 'IL TUO LOGO QUI', left: w / 2, top: h * 0.92, width: w * 0.8, fontSize: h * 0.04, fill: 'white', fontFamily: 'Poppins', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'rollup-ristorante-gourmet',
    name: 'Ristorante Gourmet',
    category: 'Ristorazione',
    description: 'Presenta il tuo menu gourmet con classe.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/d9d20c38865f142273e9611b8b2cf2e6.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#1b1b1b', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'ESPERIENZA GOURMET', left: w / 2, top: h * 0.2, width: w * 0.8, fontSize: h * 0.09, fill: '#c2995e', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Un viaggio nel gusto\ncreato dal nostro chef', left: w / 2, top: h * 0.4, width: w * 0.7, fontSize: h * 0.06, fill: 'white', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1.3, selectable: true },
        { type: 'textbox', text: 'Menu Degustazione', left: w / 2, top: h * 0.65, width: w * 0.8, fontSize: h * 0.07, fill: '#c2995e', fontWeight: 'bold', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'PRENOTA IL TUO TAVOLO\n012 3456789', left: w / 2, top: h * 0.85, width: w * 0.8, fontSize: h * 0.05, fill: 'white', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'rollup-prodotto-cosmetico',
    name: 'Lancio Prodotto Cosmetico',
    category: 'Eventi e Fiere',
    description: 'Un design delicato per prodotti di bellezza.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/cc9644f12f9bce4e1d5e62ccb2b2b1bc.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#fcefee', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'Bellezza Naturale', left: w / 2, top: h * 0.25, width: w * 0.8, fontSize: h * 0.1, fill: '#d58c8c', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Scopri la nostra nuova linea di prodotti biologici', left: w / 2, top: h * 0.4, width: w * 0.7, fontSize: h * 0.05, fill: '#5e5e5e', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'rect', left: w/2, top: h * 0.6, width: w * 0.4, height: w * 0.5, fill: '#f6d5d5', selectable: true, originX: 'center', originY: 'center' },
        { type: 'textbox', text: 'Immagine\nprodotto', left: w / 2, top: h * 0.6, width: w * 0.3, fontSize: h * 0.03, fill: '#8c8c8c', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'IL TUO BRAND', left: w / 2, top: h * 0.85, width: w * 0.8, fontSize: h * 0.06, fill: '#d58c8c', fontWeight: 'bold', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'rollup-fitness-center',
    name: 'Centro Fitness',
    category: 'Eventi e Fiere',
    description: 'Promuovi la tua palestra o centro sportivo.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a5905d2146e294ce8b975d0b4311804e.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#111111', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'RAGGIUNGI\nI TUOI\nOBIETTIVI', left: w / 2, top: h * 0.35, width: w * 0.8, fontSize: h * 0.13, fill: '#fef200', fontWeight: '900', fontFamily: 'Anton', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 0.9, selectable: true },
        { type: 'textbox', text: 'Iscriviti oggi e ottieni un mese gratuito', left: w / 2, top: h * 0.7, width: w * 0.8, fontSize: h * 0.06, fill: 'white', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'FITNESS CLUB | Via Roma 1', left: w / 2, top: h * 0.85, width: w * 0.8, fontSize: h * 0.04, fill: '#fef200', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
   {
    id: 'rollup-saldi-fashion',
    name: 'Saldi Fashion',
    category: 'Saldi e Promozioni',
    description: 'Annuncia i saldi con un design alla moda.',
    preview: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/a73954605e54d682490ab8d8a7c29367.png',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#e9ecef', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'SALDI', left: w / 2, top: h * 0.25, width: w * 0.8, fontSize: h * 0.2, fill: '#000000', fontWeight: '900', fontFamily: 'Anton', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'FINO A\n-70%', left: w / 2, top: h * 0.55, width: w * 0.7, fontSize: h * 0.15, fill: '#e63946', fontWeight: 'bold', fontFamily: 'Oswald', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1, selectable: true },
        { type: 'textbox', text: 'Sulla collezione estiva', left: w / 2, top: h * 0.8, width: w * 0.8, fontSize: h * 0.05, fill: '#495057', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
];