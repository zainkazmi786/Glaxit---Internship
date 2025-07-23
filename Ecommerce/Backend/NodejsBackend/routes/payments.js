const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Set this in .env

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'; // Default to local if not set

router.post('/create-checkout-session', async (req, res) => {
  const { orderId, orderItems, total } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${CLIENT_URL}/checkout/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cart`,
      metadata: {
        orderId
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/session-status/:session_id', async (req, res) => {
  const sessionId = req.params.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({ status: session.status, customer_email: session.customer_details.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
