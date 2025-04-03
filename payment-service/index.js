const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

// Skapa en betalningssession
async function createPaymentSession(amount, currency = 'sek') {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Trafikuppdatering',
            },
            unit_amount: amount, // Beloppet i öre (ex: 1000 = 10 SEK)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SUCCESS_URL}`,
      cancel_url: `${process.env.CANCEL_URL}`,
    });
    
    return session.url; // Skicka tillbaka URL:en för att slutföra betalningen
  } catch (error) {
    console.error('Fel vid betalningssession skapande:', error);
    throw new Error('Kan inte skapa betalningssession.');
  }
}

// Exportera funktionerna
module.exports = {
  createPaymentSession
};
