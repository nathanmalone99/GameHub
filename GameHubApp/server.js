const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51N7gd7IB2R5TmgiioGQN6rwHxBFW4P22XgvmE5X9ilmmulnfMAoXZDUpuXuvEZKCWswMCfo85pL2qLEEsSBt1o0m00wyolSf7M');
const admin = require('firebase-admin');

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gamehub-e4466-default-rtdb.europe-west1.firebasedatabase.app'
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
    res.status(500).send({ error: error.message });
  }
});

app.listen(4242, () => console.log('Server is running on port 4242'));
