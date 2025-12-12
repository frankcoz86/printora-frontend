import React from 'react';

const reviews = [
  { name: 'Giovanni Rossi', comment: 'Avevo dubbi sulla qualità, ma il risultato è stato eccezionale! Consigliato.' },
  { name: 'Francesca Bianchi', comment: 'Servizio clienti rapido e professionale. Mi hanno aiutata in ogni fase.' },
  { name: 'Luca Moretti', comment: 'Temevo tempi di consegna lunghi, invece tutto è arrivato puntuale.' },
  { name: 'Martina Romano', comment: 'La stampa è resistente e i colori sono vivaci. Ottimo lavoro!' },
  { name: 'Alessandro Greco', comment: 'Prezzi trasparenti e nessuna sorpresa al pagamento. Affidabili.' },
  { name: 'Chiara Esposito', comment: 'Avevo paura che la grafica non fosse perfetta, invece è precisa.' },
  { name: 'Paolo Conti', comment: 'Facile ordinare online, sito intuitivo e veloce.' },
  { name: 'Giulia Ricci', comment: 'Mi hanno seguito passo passo, consigliando le scelte migliori.' },
  { name: 'Marco De Luca', comment: 'Ottima comunicazione e aggiornamenti costanti sul mio ordine.' },
  { name: 'Elena Gallo', comment: 'Temevo che la spedizione fosse lenta, invece è stata velocissima.' },
  { name: 'Davide Ferrara', comment: 'Il supporto WhatsApp è stato fondamentale per risolvere i miei dubbi.' },
  { name: 'Sara Marchetti', comment: 'Materiali di qualità superiore rispetto ad altri servizi provati.' },
  { name: 'Simone Barbieri', comment: 'Mi hanno rassicurato sulla sicurezza del pagamento. Tutto ok.' },
  { name: 'Valentina Fontana', comment: 'Avevo bisogno di una stampa urgente, sono stati rapidissimi.' },
  { name: 'Matteo Sanna', comment: 'Molto soddisfatto della resa finale, superano le aspettative.' },
  { name: 'Alessia Rizzo', comment: 'Temevo che il colore non fosse fedele, invece è perfetto.' },
  { name: 'Giorgio Serra', comment: 'Ottimo rapporto qualità/prezzo, consigliato a tutti.' },
  { name: 'Ilaria Basile', comment: 'Risposte veloci e precise ad ogni domanda.' },
  { name: 'Federico Grassi', comment: 'Avevo paura di errori, ma il controllo file è stato accurato.' },
  { name: 'Laura Mancini', comment: 'Il risultato finale è stato superiore alle mie aspettative.' },
];

const galleryImages = [
  '/gallery/1.jpg',
  '/gallery/2.jpg',
  '/gallery/3.jpg',
  '/gallery/4.jpg',
  '/gallery/5.jpg',
  '/gallery/6.jpg',
  '/gallery/7.jpg',
  '/gallery/8.jpg',
  '/gallery/9.jpg',
  '/gallery/10.jpg',
];

const ReviewsGalleryPage = () => {
  return (
    <div className="bg-slate-950 py-16">
      <div className="container mx-auto px-4 space-y-16">
        <section className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Cosa dicono i nostri clienti</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col gap-2">
                <span className="font-semibold text-cyan-300">{review.name}</span>
                <p className="text-gray-200">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>
        <section className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Alcuni dei nostri lavori</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                <img src={src} alt={`Lavoro ${idx + 1}`} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReviewsGalleryPage;
