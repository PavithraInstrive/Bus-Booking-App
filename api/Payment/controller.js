const service = require("./service");
const boom = require("@hapi/boom");
const stripe = require("../../system/config/stripe");

const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Error processing webhook:", err);
    const error = boom.badRequest(`Webhook Error: ${err.message}`);
    res.status(error.output.statusCode).send(error.output.payload);
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await service.savePaymentDetails(paymentIntent);
        console.log("PaymentIntent was successful!", paymentIntent);
        break;

      case "payment_intent.payment_failed":
        const paymentFailedIntent = event.data.object;
        console.log("Payment failed:", paymentFailedIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).end();
  } catch (err) {
    console.error("Error handling the webhook event:", err);
    const error = boom.internal("Internal Server Error", err);
    res.status(error.output.statusCode).send(error.output.payload);
  }
};

module.exports = {
  webhook,
};
