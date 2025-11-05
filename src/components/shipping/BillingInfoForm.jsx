import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const BillingInfoForm = ({ wantsInvoice, setWantsInvoice, billingInfo, setBillingInfo }) => {
  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex items-center space-x-2 pt-6">
        <Checkbox id="invoice" checked={wantsInvoice} onCheckedChange={setWantsInvoice} />
        <Label htmlFor="invoice" className="text-lg font-semibold text-white cursor-pointer">
          Richiedi fattura per la tua azienda
        </Label>
      </div>

      <AnimatePresence>
        {wantsInvoice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-4 mt-4 flex items-center gap-3">
              <FileText className="text-primary" />
              Dati di Fatturazione
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="companyName"
                placeholder="Ragione Sociale"
                value={billingInfo.companyName}
                onChange={handleChange}
                className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12"
              />

              <Input
                name="vatId"
                placeholder="Partita IVA"
                value={billingInfo.vatId}
                onChange={handleChange}
                className="bg-slate-700/50 border-slate-600 h-12"
              />

              {/* NEW: Codice Fiscale */}
              <Input
                name="codiceFiscale"
                placeholder="Codice Fiscale"
                value={billingInfo.codiceFiscale || ''}
                onChange={handleChange}
                className="bg-slate-700/50 border-slate-600 h-12"
              />

              <Input
                name="sdiCode"
                placeholder="Codice Destinatario (SDI)"
                value={billingInfo.sdiCode}
                onChange={handleChange}
                className="bg-slate-700/50 border-slate-600 h-12"
              />

              <Input
                name="pec"
                placeholder="PEC (in alternativa a SDI)"
                value={billingInfo.pec}
                onChange={handleChange}
                className="bg-slate-700/50 border-slate-600 h-12"
              />

              <Input
                name="billingEmail"
                type="email"
                placeholder="Email per fatturazione"
                value={billingInfo.billingEmail}
                onChange={handleChange}
                className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillingInfoForm;
