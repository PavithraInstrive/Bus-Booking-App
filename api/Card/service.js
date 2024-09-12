const Card = require("./index");
const stripe = require("../../system/config/stripe");

const create = async (cardDetails) => {
  const newCard = await Card.create(cardDetails);
  return newCard;
};

const findOne = async (userId) => {
  return await Card.findOne({ userId: userId });
};

const updateUserById = async (userId, updateData) => {
  return await Card.findByIdAndUpdate(userId, updateData, { new: true });
};

const createCustomer = async (user) => {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });
  return customer;
};

const createSession = async (
  customerId,
  successUrl,
  cancelUrl,
  paymentMethodTypes
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [paymentMethodTypes],
    customer: customerId,
    mode: "setup",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session;
};

const paymentMethods = async (customerId, paymentMethodTypes) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: paymentMethodTypes,
  });
  return paymentMethods;
};

const updateCardDetails = async (paymentMethodId, updates, customerId) => {
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
  const updatedCard = await stripe.paymentMethods.update(
    paymentMethodId,
    updates
  );

  return updatedCard;
};

const deleteCard = async (paymentMethodId, customerId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (!paymentMethod.customer) {
    return { message: "Payment method was already detached" };
  }

  if (paymentMethod.customer !== customerId) {
    throw new Error("Payment method is attached to a different customer");
  }

  const deletedCard = await stripe.paymentMethods.detach(paymentMethodId);

  return deletedCard;
};

module.exports = {
  create,
  findOne,
  updateUserById,
  createCustomer,
  createSession,
  paymentMethods,
  updateCardDetails,
  deleteCard,
};
