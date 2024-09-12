const Payment = require("./index");
const boom = require("@hapi/boom");

const savePaymentDetails = async (paymentIntent) => {
  const paymentDetails = {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    customer: paymentIntent.customer,
    payment_method: paymentIntent.payment_method,
    created_at: new Date(paymentIntent.created * 1000),
  };

  try {
    const newPayment = new Payment(paymentDetails);
    await newPayment.save();
  } catch (err) {
    console.error("Error saving payment details to the database:", err);
    throw boom.internal("Failed to save payment details", err);
  }
};

module.exports = {
  savePaymentDetails,
};
