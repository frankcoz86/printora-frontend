import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProviders from '@/AppProviders';
import WebFont from 'webfontloader';
import { FONT_FAMILIES } from '@/components/designer/utils';
import '@/index.css';

WebFont.load({
  google: {
    families: FONT_FAMILIES.filter(f => !['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact'].includes(f)).concat(['Anton', 'Oswald', 'Lobster', 'Playfair Display', 'Poppins', 'Montserrat'])
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>
);