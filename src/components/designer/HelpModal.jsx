import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen, Image, Type, Repeat, Palette, Copy, Save, Ruler, Shirt, Grid, Eye, AlignHorizontalJustifyCenter, Layers, Lock, RotateCw, PanelBottom, Download, CaseSensitive, Pilcrow, FileText } from "lucide-react"
import { generateEditorGuidePdf } from '@/lib/pdfGenerator';

const HelpModal = ({ isOpen, onOpenChange, productType }) => {
  const isDtf = productType === 'dtf';
  const isBanner = productType === 'banner';
  const isRollup = productType === 'rollup';
  const isRigidMedia = productType === 'rigid-media';

  const handleDownload = () => {
    if (isDtf) {
      // Open the DTF guide PDF for DTF products
      window.open('/assets/template DTF.pdf', '_blank');
    } else if (isBanner) {
      // Open the Banner guide PDF for Banner products
      window.open('/assets/template Banner.pdf', '_blank');
    } else if (isRollup) {
      // Open the Roll-up guide PDF for Roll-up products
      window.open('/assets/template roll-up.pdf', '_blank');
    } else {
      // Generate PDF for other product types
      generateEditorGuidePdf(productType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-cyan-300">
            <BookOpen className="w-8 h-8" /> Guida Rapida all'Editor
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-2">
            Benvenuto! Ecco una panoramica delle potenti funzioni a tua disposizione per creare un layout di stampa perfetto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {isDtf && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-md mt-1">
                <Repeat className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Funzione Serie (DTF)</h4>
                <p className="text-sm text-slate-400">
                  La trovi nel tab "Serie". Carica uno o più loghi, imposta quante copie vuoi per ciascuno e la spaziatura. L'editor riempirà automaticamente il telo, creando nuove pagine se necessario. È lo strumento perfetto per ottimizzare lo spazio.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Image className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Aggiungi Immagine</h4>
              <p className="text-sm text-slate-400">
                Usa questo pulsante per caricare le tue grafiche (PNG, JPG, PDF, AI, PSD, EPS). Una volta caricate, puoi ridimensionarle, spostarle e duplicarle a piacimento all'interno della tela.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Type className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Gestione Testo: Grafico vs Casella</h4>
              <p className="text-sm text-slate-400">
                Hai a disposizione due potenti strumenti per il testo:
              </p>
              <ul className="list-none mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <CaseSensitive className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Testo Grafico:</strong> Ideale per titoli e scritte d'impatto. Si comporta come un'immagine: puoi allungarlo e ridimensionarlo liberamente, e la dimensione del font si adatterà di conseguenza. Usa questo per un controllo preciso sulle dimensioni della scritta.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Pilcrow className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Casella di Testo:</strong> Perfetta per paragrafi e descrizioni. Il testo andrà a capo automaticamente all'interno della casella. Puoi ridimensionare la casella e il testo si adatterà, mantenendo la dimensione del font che hai scelto.
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Grid className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Clipart e Forme</h4>
              <p className="text-sm text-slate-400">
                Nel tab "Clipart", esplora la nostra libreria di forme base, icone social e numeri sportivi. Perfetti per aggiungere dettagli o personalizzare maglie da gioco.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Shirt className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Template Pronti</h4>
              <p className="text-sm text-slate-400">
                Nel tab "Template", scegli uno dei nostri design pre-caricati. Cliccaci sopra per caricarlo sulla tela e modificalo a tuo piacimento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Scarica Template Tecnico</h4>
              <p className="text-sm text-slate-400">
                Se preferisci creare il file con un software esterno, vai nel tab "Template" e clicca su "Scarica Template Tecnico". Otterrai un PDF con tutte le istruzioni su dimensioni, abbondanze e profili colore per un file di stampa perfetto.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Palette className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Colori di Stampa</h4>
              <p className="text-sm text-slate-400">
                Per testi e clipart, usa la palette "Colore". Puoi scegliere tra colori predefiniti o specificare valori CMYK per la massima precisione di stampa.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Ruler className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Guide e Righelli</h4>
              <p className="text-sm text-slate-400">
                Usa i righelli laterali per un riferimento visivo preciso. L'editor mostra anche un'area di sicurezza per i testi, per garantire che non vengano tagliati.
              </p>
            </div>
          </div>
          {(isBanner || isRigidMedia) && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-md mt-1">
                <Eye className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Guide Occhielli e Area di Sicurezza (Banner/Supporti Rigidi)</h4>
                <p className="text-sm text-slate-400">
                  Quando progetti un banner o un supporto rigido, vedrai dei cerchi grigi che indicano la posizione degli occhielli (se selezionati) e un bordo blu tratteggiato che delimita l'area di sicurezza. Assicurati che nessun elemento grafico importante si trovi in quelle aree per evitare tagli o coperture.
                </p>
              </div>
            </div>
          )}
          {isRollup && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-md mt-1">
                <PanelBottom className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Area non Visibile (Roll-up)</h4>
                <p className="text-sm text-slate-400">
                  Per i roll-up, la parte inferiore della grafica (circa 10 cm) sarà inserita nella struttura e non sarà visibile. Assicurati di non posizionare elementi importanti in questa zona, indicata da un'area grigia.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <AlignHorizontalJustifyCenter className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Allineamento e Posizionamento</h4>
              <p className="text-sm text-slate-400">
                Seleziona un oggetto per accedere agli strumenti di allineamento (centra, allinea a bordo) e rotazione. Puoi anche bloccare le proporzioni per ridimensionare senza distorcere.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Layers className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Gestione Livelli</h4>
              <p className="text-sm text-slate-400">
                Usa i pulsanti "Avanti", "Indietro", "Primo Piano" e "Secondo Piano" per controllare l'ordine di sovrapposizione degli oggetti sulla tela.
              </p>
            </div>
          </div>
          {isDtf && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-md mt-1">
                <Copy className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Gestione Multi-Telo (DTF)</h4>
                <p className="text-sm text-slate-400">
                  Se usi la funzione "Serie" e i loghi non entrano in un solo telo, l'editor crea automaticamente nuove pagine. Usa le frecce in basso per navigare tra i vari teli.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Download className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Scarica Anteprime (PNG/PDF)</h4>
              <p className="text-sm text-slate-400">
                Usa i pulsanti di download nell'intestazione per scaricare un'anteprima in formato PNG per una revisione veloce, o un PDF ad alta risoluzione (300 DPI) per un controllo finale.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-md mt-1">
              <Save className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Salva e Aggiungi al Carrello</h4>
              <p className="text-sm text-slate-400">
                Quando sei soddisfatto, clicca qui. Potrai rivedere le anteprime finali prima di confermare. L'editor genererà i file ad alta risoluzione e li aggiungerà al carrello.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
          <Button onClick={handleDownload} variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
            <Download className="mr-2 h-4 w-4" /> Scarica Guida
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="accent">Ho capito, iniziamo!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HelpModal;