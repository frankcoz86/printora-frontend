"use server"

import { Resend } from 'resend';

export async function sendEmail(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('La chiave API di Resend non è configurata.');
    return { error: 'La chiave API di Resend non è configurata.' };
  }
  
  const resend = new Resend(resendApiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Printora <onboarding@resend.dev>',
      to: ['info@printora.it'],
      reply_to: email,
      subject: `Nuovo messaggio da ${name} - Printora Contatti`,
      html: `<p>Hai ricevuto un nuovo messaggio dal form di contatto:</p>
             <p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Messaggio:</strong></p>
             <p>${message}</p>`,
    });

    if (error) {
      console.error('Errore API Resend:', error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error('Errore invio email:', error);
    return { error: error.message };
  }
}