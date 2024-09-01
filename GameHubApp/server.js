require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51N7gd7IB2R5TmgiioGQN6rwHxBFW4P22XgvmE5X9ilmmulnfMAoXZDUpuXuvEZKCWswMCfo85pL2qLEEsSBt1o0m00wyolSf7M');
const admin = require('firebase-admin');

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gamehub3-25198.firebaseio.com'
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  const { items, userId } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: [item.background_image],
      },
      unit_amount: Math.round(item.price * 100), // Convert price to cents
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:8100/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:8100/cancel',
    });

    // Save order to Firestore
    const order = {
      userId,
      items,
      amount: session.amount_total,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      sessionId: session.id,
    };

    await db.collection('orders').add(order);

    res.send({
      id: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error); // Log the error details
    res.status(500).send({ error: error.message });
  }
});

// Webhook to handle Stripe events, like session completion
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update the order in Firestore
    const orderRef = db.collection('orders').doc(session.id);
    orderRef.update({
      status: 'completed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  response.json({ received: true });
});

app.listen(4242, () => console.log('Server is running on port 4242'));
