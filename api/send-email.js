import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('La chiave API di Resend non è configurata nel server.');
    return res.status(500).json({ error: 'Errore di configurazione del server. Contattare il supporto.' });
  }

  const resend = new Resend(resendApiKey);
  
  const body = req.body;
  
  if (body.name && body.email && body.message) {
    const { name, email, message } = body;
    try {
      const { data, error } = await resend.emails.send({
        from: 'Printora <onboarding@resend.dev>',
        to: 'info@printora.it',
        subject: `Nuovo messaggio da ${name} - Printora Contatti`,
        reply_to: email,
        html: `<p>Hai ricevuto un nuovo messaggio dal form di contatto:</p>
               <p><strong>Nome:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Messaggio:</strong></p>
               <p>${message.replace(/\n/g, "<br>")}</p>`,
      });

      if (error) {
        console.error('Errore API Resend (Contact Form):', error);
        return res.status(500).json({ error: 'Impossibile inviare il messaggio a causa di un errore del servizio email.' });
      }
      return res.status(200).json({ success: true, data });

    } catch (exception) {
      console.error('Eccezione invio email (Contact Form):', exception);
      return res.status(500).json({ error: 'Si è verificato un errore imprevisto durante l\'invio.' });
    }
  }

  if (body.to && body.subject && body.html) {
     const { to, subject, html, reply_to } = body;
     try {
       const { data, error } = await resend.emails.send({
        from: 'Printora <onboarding@resend.dev>',
        to: to,
        subject: subject,
        reply_to: reply_to || 'info@printora.it',
        html: html,
      });

       if (error) {
        console.error('Errore API Resend (Transactional):', error);
        return res.status(500).json({ error: 'Impossibile inviare l\'email transazionale.' });
      }
      return res.status(200).json({ success: true, data });

     } catch (exception) {
        console.error('Eccezione invio email (Transactional):', exception);
        return res.status(500).json({ error: 'Si è verificato un errore imprevisto durante l\'invio transazionale.' });
     }
  }

  return res.status(400).json({ error: 'Richiesta non valida. Dati mancanti.' });
}