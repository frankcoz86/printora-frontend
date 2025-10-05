import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const drawLayout = (doc, { width, height, bleed, safeMargin, bottomBleed = 0 }) => {
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const availableHeight = 150; // Max height for the diagram
    const scale = Math.min(1, availableHeight / (height + bleed + bottomBleed));

    const drawWidth = width * scale;
    const drawHeight = height * scale;
    const drawBleed = bleed * scale;
    const drawSafeMargin = safeMargin * scale;
    const drawBottomBleed = bottomBleed * scale;
    
    const startX = centerX - drawWidth / 2;
    const startY = 50;

    // Bleed area (red)
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.1);
    doc.rect(startX - drawBleed, startY - drawBleed, drawWidth + (2 * drawBleed), drawHeight + (2 * drawBleed) + drawBottomBleed, 'S');

    // Trimbox (black)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(startX, startY, drawWidth, drawHeight + drawBottomBleed, 'S');
    
    // Safe area (blue)
    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(0.1);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(startX + drawSafeMargin, startY + drawSafeMargin, drawWidth - (2 * drawSafeMargin), drawHeight - (2 * drawSafeMargin), 'S');
    doc.setLineDashPattern([], 0);

    // Legend
    const legendY = startY + drawHeight + drawBottomBleed + 15;
    const legendX = startX - 10 > 20 ? startX - 10 : 20;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(legendX, legendY, legendX + 5, legendY);
    doc.text('Area di abbondanza (verrà tagliata)', legendX + 7, legendY + 1);

    doc.setDrawColor(0, 0, 0);
    doc.line(legendX, legendY + 5, legendX + 5, legendY + 5);
    doc.text('Bordo di taglio finale', legendX + 7, legendY + 6);
    
    doc.setDrawColor(0, 0, 255);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(legendX, legendY + 10, legendX + 5, legendY + 10);
    doc.setLineDashPattern([], 0);
    doc.text('Area di sicurezza (testi e loghi)', legendX + 7, legendY + 11);
};


export const generatePdf = (order) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Printora", pageWidth / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Riepilogo Ordine", pageWidth / 2, y, { align: "center" });
  y += 15;
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 15;

  // Order Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Dettagli Ordine", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`ID Ordine: ${order.id}`, 20, y);
  y += 7;
  doc.text(`Data: ${new Date(order.created_at).toLocaleDateString("it-IT")}`, 20, y);
  y += 15;

  // Shipping Address
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Indirizzo di Spedizione", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const sa = order.shipping_address;
  doc.text(`${sa.name} ${sa.surname}`, 20, y);
  y += 5;
  if (sa.company) {
    doc.text(sa.company, 20, y);
    y += 5;
  }
  doc.text(sa.address, 20, y);
  y += 5;
  doc.text(`${sa.zip} ${sa.city} (${sa.province})`, 20, y);
  y += 15;

  // Items
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Articoli", 20, y);
  y += 7;
  
  doc.setLineWidth(0.2);
  doc.line(20, y, pageWidth - 20, y);
  y += 5;
  
  order.cart_items.forEach(item => {
    doc.setFont("helvetica", "bold");
    doc.text(item.name, 20, y);
    doc.text(`€${(item.total).toFixed(2)}`, pageWidth - 20, y, { align: 'right' });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Quantità: ${item.quantity}`, 20, y);
    y += 5;
    if(item.details?.width && item.details?.height) {
        doc.text(`Dimensioni: ${item.details.width} x ${item.details.height} cm`, 20, y);
        y += 5;
    }
    if(item.details?.file?.name) {
        doc.text(`File: ${item.details.file.name}`, 20, y);
        y += 5;
    }
    if(item.details?.eyelets) {
        doc.text(`Occhielli: Sì`, 20, y);
        y+= 5;
    }
     if(item.details?.windproof) {
        doc.text(`Antivento: Sì`, 20, y);
        y+= 5;
    }
    if(item.details?.pleat) {
        doc.text(`Piegatura: Sì`, 20, y);
        y+= 5;
    }
    y += 5;
  });

   doc.line(20, y, pageWidth - 20, y);
   y += 10;

  // Totals
  doc.setFontSize(12);
  doc.text("Subtotale:", 130, y);
  doc.text(`€${order.subtotal.toFixed(2)}`, pageWidth - 20, y, { align: "right" });
  y += 7;
  doc.text("Spedizione:", 130, y);
  doc.text(`€${order.shipping_cost.toFixed(2)}`, pageWidth - 20, y, { align: "right" });
  y += 7;
  doc.text("IVA (22%):", 130, y);
  doc.text(`€${order.vat_amount.toFixed(2)}`, pageWidth - 20, y, { align: "right" });
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Totale:", 130, y);
  doc.text(`€${order.total_amount.toFixed(2)}`, pageWidth - 20, y, { align: "right" });

  // Footer
  y = pageHeight - 30;
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;
  doc.setFontSize(10);
  doc.text("Grazie per il tuo ordine! Per qualsiasi domanda, contatta il nostro supporto.", pageWidth / 2, y, { align: 'center' });
  
  doc.save(`Riepilogo-Ordine-${order.id.substring(0,8)}.pdf`);
};

export const generateLayoutPdf = ({ type, width, height, productName }) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let config = {};
    const pageHeight = doc.internal.pageSize.getHeight();

    switch (type) {
        case 'banner':
        case 'rigid-media':
            config = {
                productName: productName,
                bleed: 10, // 1 mm
                safeMargin: 30, // 3 mm
                instructions: [
                    { title: 'Dimensioni File', text: `Il file deve essere fornito con le dimensioni di ${width + 0.2} cm x ${height + 0.2} cm.` },
                    { title: 'Abbondanza', text: 'Prevedere 1 mm di abbondanza per lato. Questa area verrà rifilata.' },
                    { title: 'Area di Sicurezza', text: 'Mantenere testi e loghi ad almeno 3 mm dal bordo di taglio per evitare tagli accidentali.' },
                    { title: 'Risoluzione', text: 'Si consiglia una risoluzione di 150 DPI in scala 1:1.' },
                    { title: 'Colori', text: 'Utilizzare il profilo colore CMYK (es. FOGRA39). Non usare colori RGB o Pantone.' },
                    { title: 'File', text: 'Salvare il file in formato PDF, JPG o TIFF. Non includere crocini di taglio.' }
                ]
            };
            break;
        case 'rollup':
             config = {
                productName: `Roll-up ${width}x${height} cm`,
                bleed: 10, // 10 mm on top/left/right
                safeMargin: 30, // 30 mm
                bottomBleed: 100, // 100 mm on bottom
                instructions: [
                    { title: 'Dimensioni File', text: `Il file deve essere fornito con le dimensioni di ${width} cm x ${height + 10} cm.` },
                    { title: 'Abbondanza', text: 'Prevedere 10 cm di abbondanza solo sul lato inferiore. Questa parte verrà nascosta nella struttura. Non serve abbondanza sugli altri lati.' },
                    { title: 'Area di Sicurezza', text: 'Mantenere testi e loghi ad almeno 3 cm dai bordi (superiore, destro e sinistro).' },
                    { title: 'Risoluzione', text: 'Si consiglia una risoluzione di 150 DPI in scala 1:1.' },
                    { title: 'Colori', text: 'Utilizzare il profilo colore CMYK (es. FOGRA39).' },
                    { title: 'File', text: 'Salvare il file in formato PDF, JPG o TIFF.' }
                ]
            };
            break;
        case 'dtf':
             config = {
                productName: `Stampa DTF (Telo ${width}x${height} cm)`,
                bleed: 0,
                safeMargin: 5, // 5 mm
                instructions: [
                    { title: 'Dimensioni File', text: `L'area di lavoro è esattamente ${width}x${height} cm.` },
                    { title: 'Usa il nostro Editor!', text: 'Per risultati ottimali e zero errori, ti consigliamo di usare il nostro editor DTF gratuito. Puoi caricare i tuoi loghi, disporli automaticamente o manualmente e aggiungere testi con colori di stampa professionali.' },
                    { title: 'Se non usi l\'editor:', text: 'Se preferisci caricare un file pronto, assicurati che sia in formato PNG con sfondo trasparente, a 300 DPI e con il profilo colore CMYK. Ricorda di specchiare il file prima di caricarlo.'},
                    { title: 'Spessori Minimi', text: 'Lo spessore minimo per linee e dettagli è di 0.5 mm per garantire una corretta adesione.'}
                ]
            };
            break;
        default:
            return;
    }
    
    // Convert cm to mm for drawing
    const mmWidth = width * 10;
    const mmHeight = height * 10;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Printora', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Template e Istruzioni - ${config.productName}`, 105, 28, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    if (type !== 'dtf') {
        drawLayout(doc, { width: mmWidth, height: mmHeight, ...config });
    }

    // Instructions
    const legendY = pageHeight - 65;
    const instructionStartX = type === 'dtf' ? 20 : (type === 'rollup' ? 20 : 115);
    const textWidth = type === 'dtf' ? 170 : (type === 'rollup' ? 170 : 80);
    const instructionStartY = type === 'dtf' ? 50 : (type === 'rollup' ? legendY - 25 : legendY - 25);


    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Istruzioni Tecniche', instructionStartX, instructionStartY);
    
    doc.setFontSize(9);
    let currentY = instructionStartY + 10;

    config.instructions.forEach((instruction) => {
        if(currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(instruction.title, instructionStartX, currentY);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(instruction.text, textWidth);
        doc.text(splitText, instructionStartX, currentY + 4);
        currentY += (splitText.length * 4) + 6;
    });


    // Footer
    doc.setLineWidth(0.2);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    doc.setFontSize(8);
    doc.text('Per qualsiasi dubbio, il nostro team di supporto è a tua disposizione. Visita www.printora.it', 105, pageHeight - 15, { align: 'center' });

    doc.save(`Template-Printora-${type.replace('-','')}-${width}x${height}cm.pdf`);
};

const addGuideSection = (doc, title, text, yPos) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (yPos.y > pageHeight - 50) {
        doc.addPage();
        yPos.y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text(title, 20, yPos.y);
    yPos.y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59); // slate-800
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, yPos.y);
    yPos.y += (splitText.length * 5) + 10;
};

export const generateEditorGuidePdf = (productType) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const yPos = { y: 20 };
    const isDtf = productType === 'dtf';
    const isBanner = productType === 'banner';
    const isRollup = productType === 'rollup';
    const isRigidMedia = productType === 'rigid-media';

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Printora - Guida all\'Editor Online', 105, yPos.y, { align: 'center' });
    yPos.y += 15;

    const guideContent = [
        ...(isDtf ? [{ title: 'Funzione Serie (DTF)', text: 'La trovi nel tab "Serie". Carica uno o più loghi, imposta quante copie vuoi per ciascuno e la spaziatura. L\'editor riempirà automaticamente il telo, creando nuove pagine se necessario. È lo strumento perfetto per ottimizzare lo spazio.' }] : []),
        { title: 'Aggiungi Immagine', text: 'Usa questo pulsante per caricare le tue grafiche (PNG, JPG, PDF, AI, PSD, EPS). Una volta caricate, puoi ridimensionarle, spostarle e duplicarle a piacimento all\'interno della tela.' },
        { title: 'Aggiungi Testo', text: 'Inserisci scritte personalizzate. Puoi modificare font, dimensione e colore.' },
        { title: 'Clipart e Forme', text: 'Nel tab "Clipart", esplora la nostra libreria di forme base, icone social e numeri sportivi. Perfetti per aggiungere dettagli o personalizzare maglie da gioco.' },
        { title: 'Template Pronti', text: 'Nel tab "Template", scegli uno dei nostri design pre-caricati. Cliccaci sopra per caricarlo sulla tela e modificalo a tuo piacimento.' },
        { title: 'Colori di Stampa', text: 'Per testi e clipart, usa la palette "Colore". Puoi scegliere tra colori predefiniti o specificare valori CMYK per la massima precisione di stampa.' },
        { title: 'Guide e Righelli', text: 'Usa i righelli laterali per un riferimento visivo preciso. L\'editor mostra anche un\'area di sicurezza per i testi, per garantire che non vengano tagliati.' },
        ...((isBanner || isRigidMedia) ? [{ title: 'Guide Occhielli e Area di Sicurezza (Banner/Supporti Rigidi)', text: 'Quando progetti un banner o un supporto rigido, vedrai dei cerchi grigi che indicano la posizione degli occhielli (se selezionati) e un bordo blu tratteggiato che delimita l\'area di sicurezza. Assicurati che nessun elemento grafico importante si trovi in quelle aree per evitare tagli o coperture.' }] : []),
        ...(isRollup ? [{ title: 'Area non Visibile (Roll-up)', text: 'Per i roll-up, la parte inferiore della grafica (circa 10 cm) sarà inserita nella struttura e non sarà visibile. Assicurati di non posizionare elementi importanti in questa zona, indicata da un\'area grigia.' }] : []),
        { title: 'Allineamento e Posizionamento', text: 'Seleziona un oggetto per accedere agli strumenti di allineamento (centra, allinea a bordo) e rotazione. Puoi anche bloccare le proporzioni per ridimensionare senza distorcere.' },
        { title: 'Gestione Livelli', text: 'Usa i pulsanti "Avanti", "Indietro", "Primo Piano" e "Secondo Piano" per controllare l\'ordine di sovrapposizione degli oggetti sulla tela.' },
        ...(isDtf ? [{ title: 'Gestione Multi-Telo (DTF)', text: 'Se usi la funzione "Serie" e i loghi non entrano in un solo telo, l\'editor crea automaticamente nuove pagine. Usa le frecce in basso per navigare tra i vari teli.' }] : []),
        { title: 'Scarica Anteprima PDF (300 DPI)', text: 'Usa il pulsante di download PDF nell\'intestazione per scaricare un\'anteprima in formato PDF ad alta risoluzione del telo corrente. Utile per una revisione finale.' },
        { title: 'Salva e Aggiungi al Carrello', text: 'Quando sei soddisfatto, clicca qui. Potrai rivedere le anteprime finali prima di confermare. L\'editor genererà i file ad alta risoluzione e li aggiungerà al carrello.' },
    ];
    
    guideContent.forEach(section => {
        addGuideSection(doc, section.title, section.text, yPos);
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setLineWidth(0.2);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20);
        doc.setFontSize(8);
        doc.text(`Pagina ${i} di ${totalPages}`, 190, pageHeight - 15, { align: 'right' });
        doc.text('Per qualsiasi dubbio, il nostro team di supporto è a tua disposizione. Visita www.printora.it', 20, pageHeight - 15);
    }

    doc.save('Guida-Editor-Printora.pdf');
};