import React from 'react';
import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BillingInfoForm = ({ billingInfo, setBillingInfo }) => {
  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div>
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
    </div>
  );
};

export default BillingInfoForm;
