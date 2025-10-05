import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity, min = 1, showLabel = true }) => {
  const handleDecrement = () => {
    setQuantity(Math.max(min, quantity - 1));
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex items-center space-x-2">
      {showLabel && <label className="text-sm font-medium">Quantità</label>}
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        className="h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <div className="text-white font-semibold w-10 text-center bg-slate-700 h-8 flex items-center justify-center rounded-md">
        {quantity}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        className="h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;