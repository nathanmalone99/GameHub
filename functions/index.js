const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51N7gd7IB2R5TmgiioGQN6rwHxBFW4P22XgvmE5X9ilmmulnfMAoXZDUpuXuvEZKCWswMCfo85pL2qLEEsSBt1o0m00wyolSf7M');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.createPaymentIntent = functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { amount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // convert to cents
        currency: 'eur',
      });
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(400).send({
        error: {
          message: error.message,
        },
      });
    }
  });
});

exports.createCheckoutSession = functions.region('europe-west1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { lineItems } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:8100/success',
        cancel_url: 'http://localhost:8100/cancel',
      });

      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).send({
        id: session.id,
      });
    } catch (error) {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(400).send({
        error: {
          message: error.message,
        },
      });
    }
  });
});
