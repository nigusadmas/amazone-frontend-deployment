const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = process.env.STRIPE_KEY
  ? require("stripe")(process.env.STRIPE_KEY)
  : null;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "sucess!",
  });
});

app.post("/payments/create", async (req, res) => {
  const amount = Number(req.body?.amount);

  if (!stripe) {
    return res.status(500).json({
      message: "Stripe is not configured. Set STRIPE_KEY in the Functions environment.",
    });
  }

  if (!Number.isSafeInteger(amount) || amount < 50) {
    return res.status(400).json({
      message: "Order amount must be at least $0.50 and use whole cents.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.error("Unable to create Stripe PaymentIntent", {
      type: error.type,
      code: error.code,
    });
    res.status(500).json({
      message: "Stripe could not start the payment. Check the Functions Stripe key and try again.",
    });
  }
});

exports.api = onRequest(app);
