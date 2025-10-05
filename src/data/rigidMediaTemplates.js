export const rigidMediaTemplates = [
  {
    id: 'targa-ufficio-moderna',
    name: 'Targa Ufficio Moderna',
    category: 'Targhe',
    description: 'Design pulito e professionale per uffici.',
    preview: 'Targa bianca moderna per un ufficio aziendale',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffffff', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'NOME AZIENDA', left: w / 2, top: h * 0.3, width: w * 0.8, fontSize: h * 0.15, fill: '#1e293b', fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Ufficio Amministrazione', left: w / 2, top: h * 0.6, width: w * 0.7, fontSize: h * 0.08, fill: '#64748b', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'insegna-negozio-vintage',
    name: 'Insegna Negozio Vintage',
    category: 'Insegne',
    description: 'Stile retrò per un\'insegna che non passa inosservata.',
    preview: 'Insegna scura con testo dorato in stile vintage',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#334155', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'NOME NEGOZIO', left: w / 2, top: h * 0.35, width: w * 0.8, fontSize: h * 0.2, fill: '#fde047', fontFamily: 'Georgia', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'DAL 1980', left: w / 2, top: h * 0.65, width: w * 0.7, fontSize: h * 0.1, fill: '#f8fafc', fontFamily: 'Georgia', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'fotoquadro-paesaggio',
    name: 'Fotoquadro Paesaggio',
    category: 'Fotoquadri',
    description: 'Template minimalista per valorizzare le tue foto.',
    preview: 'Template bianco per un fotoquadro minimalista',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffffff', selectable: true, excludeFromExport: true },
        { type: 'textbox', text: 'Inserisci qui la tua foto', left: w/2, top: h/2, width: w * 0.6, fontSize: h * 0.08, fill: '#94a3b8', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center', selectable: false },
      ];
    },
  },
  {
    id: 'targa-avvocato',
    name: 'Targa Avvocato',
    category: 'Targhe',
    description: 'Classica ed elegante, ideale per studi legali.',
    preview: 'Targa bianca classica per studio legale',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#ffffff', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'Dott. Mario Rossi', left: w / 2, top: h * 0.3, width: w * 0.8, fontSize: h * 0.12, fill: '#1e3a8a', fontFamily: 'Times New Roman', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'AVVOCATO', left: w / 2, top: h * 0.5, width: w * 0.7, fontSize: h * 0.09, fill: '#1e3a8a', fontFamily: 'Times New Roman', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Riceve su appuntamento', left: w / 2, top: h * 0.7, width: w * 0.7, fontSize: h * 0.07, fill: '#6b7280', fontFamily: 'Times New Roman', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
  {
    id: 'insegna-bar',
    name: 'Insegna Bar Moderno',
    category: 'Insegne',
    description: 'Stile contemporaneo per bar e caffetterie.',
    preview: 'Insegna nera per bar con testo verde neon',
    objects: (canvas) => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { type: 'rect', left: 0, top: 0, width: w, height: h, fill: '#18181b', selectable: false, excludeFromExport: true },
        { type: 'textbox', text: 'COFFEE & MORE', left: w / 2, top: h * 0.45, width: w * 0.9, fontSize: h * 0.25, fill: '#a3e635', fontFamily: 'Impact', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
        { type: 'textbox', text: 'Breakfast - Lunch - Aperitivo', left: w / 2, top: h * 0.7, width: w * 0.8, fontSize: h * 0.08, fill: '#e4e4e7', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center', selectable: true },
      ];
    },
  },
];