const service = require("./service");
const boom = require("@hapi/boom");

const webhook = async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!", paymentIntent);
      
      break;
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log(paymentFailedIntent);
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).end();
}

module.exports = {
  webhook,
};
