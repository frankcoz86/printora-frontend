import { products as mainProducts } from '@/data/products';

export const vinylProduct = {
  id: 'vinile-adesivo',
  name: 'Vinile Adesivo',
  type: 'vinyl',
  description: 'Stampa su vinile adesivo monomerico di alta qualità, ideale per vetrine, automezzi, pannelli e decorazioni interne ed esterne. Personalizzabile in ogni dettaglio.',
  features: [
    'Materiale: PVC adesivo monomerico.',
    'Stampa: Digitale UV ad alta risoluzione per colori vividi e duraturi.',
    'Durata: Fino a 3 anni in esterno (aumentabile con laminazione).',
    'Applicazione: Facile da applicare su superfici lisce e pulite.',
    'Versatilità: Adatto per uso interno ed esterno, resistente all\'acqua e ai raggi UV.'
  ],
  unit: 'mq',
  basePrice: 0, // Price is now determined by finish
  minArea: 0.5,
  image: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/5c66142a5e907ecd13d341ca2879b7b9.png',
  imageAlt: 'Rotolo di PVC adesivo con icone per editor personalizzato, finitura lucida/opaca e laminazione su richiesta.',
  secondImage: 'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/0e65648da470ab23be3ad442f7aa7803.png',
  secondImageAlt: 'Esempi di finiture per vinile adesivo: Lucido, Opaco, One Way, applicati su un paesaggio montano.',
  finishOptions: [
    { value: 'lucido', label: 'Lucido', pricePerSqm: 8, rollWidth: 152, description: 'Finitura brillante, colori vivaci.' },
    { value: 'opaco', label: 'Opaco', pricePerSqm: 8, rollWidth: 152, description: 'Finitura antiriflesso, elegante.' },
    { value: 'calpestabile', label: 'Calpestabile', pricePerSqm: 16.90, rollWidth: 107, description: 'Con laminazione, per pavimenti.' },
    { value: 'trasparente', label: 'Trasparente', pricePerSqm: 10, rollWidth: 152, description: 'Per vetrine, effetto vedo-non-vedo.' },
    { value: 'one-way', label: 'One Way', pricePerSqm: 18.90, rollWidth: 152, description: 'Microforato, visibilità solo da un lato.' },
    { value: 'bubble-free', label: 'Bubble Free', pricePerSqm: 15, rollWidth: 152, description: 'Facile applicazione senza bolle.' },
  ],
  laminationOptions: {
    pricePerSqm: 5,
    types: [
      { value: 'none', label: 'Nessuna' },
      { value: 'lucida', label: 'Lucida' },
      { value: 'opaca', label: 'Opaca' },
    ]
  },
  cutOptions: [
    { value: 'Squadrato', label: 'Squadrato', priceMultiplier: 1, description: 'Taglio dritto.' },
    { value: 'Sagomato', label: 'Sagomato', priceMultiplier: 1.2, description: 'Taglio personalizzato, anche con angoli a 90°, seguendo il tracciato.' },
  ],
  predefinedFormats: [
    { label: 'A4 (21x29.7)', width: 21, height: 29.7 },
    { label: 'A3 (29.7x42)', width: 29.7, height: 42 },
    { label: 'A2 (42x59.4)', width: 42, height: 59.4 },
    { label: 'A1 (59.4x84.1)', width: 59.4, height: 84.1 },
    { label: 'A0 (84.1x118.9)', width: 84.1, height: 118.9 },
    { label: '50x50 cm', width: 50, height: 50 },
    { label: '70x100 cm', width: 70, height: 100 },
    { label: '100x140 cm', width: 100, height: 140 },
  ],
  productionNote: 'Le bobine di vinile e laminazione hanno larghezza 107 cm o 152 cm e altezza fino a 50 metri. Le stampe verranno divise in più teli di larghezza solo se superano la larghezza della bobina. Esempio: un file di 190x300 cm, stampato su bobina da 107 cm, verrà diviso in 2 teli da 90x300 cm.',
};