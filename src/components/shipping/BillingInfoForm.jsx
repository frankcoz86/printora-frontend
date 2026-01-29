import React from 'react';
import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BillingInfoForm = ({ billingInfo, setBillingInfo }) => {
  // Format Partita IVA: pad with leading zeros and add IT prefix
  const formatPartitaIVA = (value) => {
    if (!value) return '';

    // Remove any non-digit characters and IT prefix
    let digits = value.replace(/[^\d]/g, '');

    // If empty, return empty
    if (digits.length === 0) return '';

    // Pad with leading zeros to make it 11 digits
    if (digits.length < 11) {
      digits = digits.padStart(11, '0');
    }

    // Limit to 11 digits
    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    // Add IT prefix
    return `IT${digits}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'vatId') {
      // For vatId, just store the raw input (will format on blur)
      setBillingInfo({ ...billingInfo, [name]: value });
    } else {
      setBillingInfo({ ...billingInfo, [name]: value });
    }
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

        <div className="relative">
          <Input
            name="vatId"
            placeholder="Partita IVA (es: 1234567890)"
            value={billingInfo.vatId}
            onChange={handleChange}
            onBlur={(e) => {
              // Format on blur (when user leaves field)
              const formatted = formatPartitaIVA(e.target.value);
              if (formatted) {
                setBillingInfo({ ...billingInfo, vatId: formatted });
              }
            }}
            className="bg-slate-700/50 border-slate-600 h-12"
            maxLength={13}
          />
          {billingInfo.vatId && billingInfo.vatId.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              {billingInfo.vatId.startsWith('IT') && billingInfo.vatId.length === 13
                ? '✓ Formato corretto (IT + 11 cifre)'
                : 'Verrà formattato automaticamente quando completi il campo'}
            </p>
          )}
        </div>

        {/* NEW: Codice Fiscale */}
        <Input
          name="codiceFiscale"
          placeholder="Codice Fiscale *"
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
          placeholder="Email per fatturazione *"
          value={billingInfo.billingEmail}
          onChange={handleChange}
          className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12"
        />
      </div>
    </div>
  );
};

export default BillingInfoForm;
