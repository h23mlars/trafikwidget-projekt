const stripe = require('stripe')('YOUR_SECRET_KEY');

// Skapa en betalningssession
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'sek',
        product_data: {
          name: 'Trafikuppdatering',
        },
        unit_amount: 1000,
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${YOUR_DOMAIN}/success`,
  cancel_url: `${YOUR_DOMAIN}/cancel`,
});

console.log(session.url);
