const stripe = require("../../system/config/stripe");
const boom = require("@hapi/boom");
const cardService = require("./service");
const userService = require("../User/service");

const createCheckoutSession = async (req, res) => {
  const { successUrl, cancelUrl, paymentMethodTypes } = req.body;
  const userId = req.user.id;

  const user = await cardService.findOne(userId);
  let customerId = user?.customerId;

  if (!customerId) {
    const userData = await userService.findById(userId);
    if (!userData) {
      throw boom.notFound("User not found.");
    }
    const customer = await cardService.createCustomer(userData);
    if (!customer) {
      throw boom.badRequest("Failed to create customer.");
    }
    await cardService.create({
      userId: userId,
      customerId: customer.id,
      paymentMethodTypes: paymentMethodTypes,
    });
  }
  const session = await cardService.createSession(
    user.customerId,
    successUrl,
    cancelUrl,
    paymentMethodTypes
  );

  if (!session) {
    throw boom.badImplementation("Failed to create checkout session.");
  }

  const result = {
    message: "Checkout session created successfully.",
    url: session.url,
  };
  return result;
};

const getCustomerCards = async (req, res) => {
  const userId = req.user.id;
  const user = await cardService.findOne(userId);

  if (!user || !user.customerId) {
    throw boom.notFound("User or Customer ID not found.");
  }

  const paymentMethods = await cardService.paymentMethods(
    user.customerId,
    user.paymentMethodTypes
  );

  if (!paymentMethods) {
    throw boom.notFound("Payment methods not found.");
  }

  const result = {
    message: "Payment methods retrieved successfully.",
    data: paymentMethods,
  };
  return result;
};

const editCardDetails = async (req, res) => {
  const { paymentMethodId } = req.query;
  const { customerId, ...updates } = req.body;

  if (!customerId) {
    return { error: "Customer ID is required" };
  }

  const updatedCard = await cardService.updateCardDetails(
    paymentMethodId,
    updates,
    customerId
  );
  if (!updatedCard) {
    throw boom.notFound("Payment method not found.");
  }

  const result = {
    message: "Payment method updated successfully.",
    data: updatedCard,
  };
  return result;
};

const deleteCard = async (req, res) => {
  const { paymentMethodId, customerId } = req.query;
  if (!customerId) {
    return { error: "Customer ID is required" };
  }

  const deletedCard = await cardService.deleteCard(paymentMethodId, customerId);

  if (!deletedCard) {
    throw boom.notFound("Payment method not found or already deleted.");
  }

  const result = {
    message: "Payment method deleted successfully.",
    data: deletedCard,
  };
  return result;
};

module.exports = {
  createCheckoutSession,
  getCustomerCards,
  editCardDetails,
  deleteCard,
};
