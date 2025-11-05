import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BillingInfoForm from './BillingInfoForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const provinces = [
  'AG','AL','AN','AO','AR','AP','AT','AV','BA','BT','BL','BN','BG','BI','BO','BZ','BS','BR','CA','CL','CB','CI','CE','CT','CZ','CH','CO','CS','CR','KR','CN','EN','FM','FE','FI','FG','FC','FR','GE','GO','GR','IM','IS','SP','AQ','LT','LE','LC','LI','LO','LU','MC','MN','MS','MT','VS','ME','MI','MO','MB','NA','NO','NU','OG','OT','OR','PD','PA','PR','PV','PG','PU','PE','PC','PI','PT','PN','PZ','PO','RG','RA','RC','RE','RI','RN','RM','RO','SA','SM','SS','SV','SI','SR','SO','SU','TA','TE','TR','TO','TP','TN','TV','TS','UD','VA','VE','VB','VC','VR','VV','VI','VT'
];

const ShippingAddressForm = ({ address, setAddress, billingInfo, setBillingInfo }) => {
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (value) => {
    setAddress((currentAddress) => ({ ...currentAddress, province: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-xl space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Package className="text-primary" />
          1. Indirizzo e Fatturazione
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Nome" value={address.name} onChange={handleChange} className="bg-slate-700/50 border-slate-600 h-12" />
          <Input name="surname" placeholder="Cognome" value={address.surname} onChange={handleChange} className="bg-slate-700/50 border-slate-600 h-12" />

          <Input name="email" type="email" placeholder="Email" value={address.email} onChange={handleChange} className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12" />

          {/* NEW: Mobile */}
          <Input
            name="phone"
            type="tel"
            placeholder="Mobile"
            value={address.phone || ''}
            onChange={handleChange}
            className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12"
          />

          <Input name="company" placeholder="Azienda (Opzionale)" value={address.company} onChange={handleChange} className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12" />
          <Input name="address" placeholder="Indirizzo" value={address.address} onChange={handleChange} className="md:col-span-2 bg-slate-700/50 border-slate-600 h-12" />

          <Input name="city" placeholder="Città" value={address.city} onChange={handleChange} className="bg-slate-700/50 border-slate-600 h-12" />
          <Input name="zip" placeholder="CAP" value={address.zip} onChange={handleChange} className="bg-slate-700/50 border-slate-600 h-12" />

          <div className="flex flex-col space-y-2">
            <Label htmlFor="province" className="text-gray-400 sr-only">Provincia</Label>
            <Select onValueChange={handleProvinceChange} value={address.province} name="province">
              <SelectTrigger className="bg-slate-700/50 border-slate-600 h-12">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-600 max-h-60">
                {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Input placeholder="Nazione" value="Italia" disabled className="bg-slate-700/80 border-slate-600 h-12 text-gray-400" />

          {/* NEW: Notes */}
          <div className="md:col-span-2">
            <Label htmlFor="notes" className="text-gray-200 mb-2 block">Note (Opzionale)</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={address.notes || ''}
              onChange={handleChange}
              placeholder="Istruzioni per il corriere, dettagli sulla stampa, ecc."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Le tariffe di spedizione verranno calcolate automaticamente non appena inserirai un indirizzo valido.
        </p>
      </div>

      <div className="border-t border-slate-700"></div>

      <BillingInfoForm
        billingInfo={billingInfo}
        setBillingInfo={setBillingInfo}
      />
    </motion.div>
  );
};

export default ShippingAddressForm;
