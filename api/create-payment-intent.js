import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // L'importo deve essere in centesimi
        currency: 'eur',
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_configuration: process.env.STRIPE_PMC_ID,
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}