import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-gray-400 hover:text-white transition-colors duration-300"
  >
    <Icon size={24} />
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="mb-4">
              <Logo />
            </Link>
            <div className="flex space-x-4 mt-6">
              <SocialLink href="https://facebook.com" icon={FaFacebook} label="Facebook" />
              <SocialLink href="https://instagram.com" icon={FaInstagram} label="Instagram" />
              <SocialLink href="https://tiktok.com" icon={FaTiktok} label="TikTok" />
            </div>
          </div>
          <div>
            <p className="font-bold text-white mb-4">Prodotti</p>
            <ul className="space-y-2">
              <li><Link to="/dtf" className="text-gray-400 hover:text-primary transition">Stampa DTF</Link></li>
              <li><Link to="/banner" className="text-gray-400 hover:text-primary transition">Stampa Banner</Link></li>
              <li><Link to="/rollup" className="text-gray-400 hover:text-primary transition">Stampa Roll-up</Link></li>
              {/* <li><Link to="/vinile-adesivo" className="text-gray-400 hover:text-primary transition">Stampa Vinile</Link></li> */}
              {/* <li><Link to="/forex-pvc" className="text-gray-400 hover:text-primary transition">Stampa Forex</Link></li> */}
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-4">Informazioni</p>
            <ul className="space-y-2">
              <li><Link to="/contatti" className="text-gray-400 hover:text-primary transition">Contatti</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/termini-e-condizioni" className="text-gray-400 hover:text-primary transition">Termini e Condizioni</Link></li>
              <li>
                <a href="https://wa.me/393792775116" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-green-400 transition">
                  <FaWhatsapp className="text-green-500" />
                  Assistenza WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-4">Sede Legale</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Isla Produzione e Distribuzione S.r.l.s.</li>
              <li>P.IVA: IT13037220962</li>
              <li>Ripa di Porta Ticinese 39</li>
              <li>20143 - Milano (MI) - IT</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-300 bg-amber-900/30 p-3 rounded-lg max-w-md mx-auto border border-amber-800">
            <AlertTriangle size={16} />
            <p className="text-xs font-medium">I prodotti personalizzati non sono soggetti a reso.</p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <ShieldCheck size={16} />
            <p className="text-xs font-medium">Pagamenti sicuri e protetti con PayPal</p>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Printora®️ è un marchio registrato, brand di proprietà di Isla Produzione e Distribuzione S.r.l.s.
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Printora | Tutti i diritti riservati. Prezzi IVA esclusa.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;