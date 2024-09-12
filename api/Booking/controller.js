const service = require("./service");
const boom = require("@hapi/boom");
const busService = require("../Bus/service");
const routeService = require("../Route/service");
const stripe = require("../../system/config/stripe");
const userService = require("../User/service");
const cardService = require("../Card/service");

const bookSeatsByLocation = async (req) => {
  const {
    busId,
    routeId,
    seatIds,
    price,
    from,
    to,
    currency,
    paymentMethodId,
  } = req.body;
  const userId = req.user.id;

  if (!price || price <= 0) {
    throw boom.badRequest("Valid price is required.");
  }

  const seatIdsArray = Array.isArray(seatIds) ? seatIds : [seatIds];

  const busDetails = await busService.findById(busId);
  if (!busDetails) {
    throw boom.notFound("Bus not found.");
  }
  const validSeatIds = busDetails.seats.map((seat) => seat.seatId);
  const invalidSeats = seatIdsArray.filter(
    (seatId) => !validSeatIds.includes(seatId)
  );

  if (invalidSeats.length > 0) {
    throw boom.badRequest(`Invalid seat IDs: ${invalidSeats.join(", ")}.`);
  }

  const route = await routeService.findById(routeId);
  if (!route) {
    throw boom.notFound("Route not found.");
  }

  const fromIndex = route.stops.indexOf(from);
  const toIndex = route.stops.indexOf(to);

  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
    throw boom.badRequest(`Invalid 'from' and 'to' locations.`);
  }

  try {
    const user = await cardService.findOne(userId);
    if (!user) {
      throw boom.notFound("User not found.");
    }

    const totalPrice = seatIdsArray.length * price;
    const bookingResult = await service.bookSeatsByLocation(req.body, userId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: currency,
      customer: user.customerId,
      payment_method: paymentMethodId,
      confirm: true,
      off_session: true,
    });

    if (paymentIntent.status !== "succeeded") {
      throw boom.paymentRequired("Payment could not be completed.");}

      const result ={
        message: "Seats booked successfully.",
        data: {
          ...bookingResult,
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          name: user.name,
          startLocation: route.startLocation,
          endLocation: route.endLocation,
          busName: busDetails.busNumber,
        },
      }

   return result
  } catch (error) {
    if (error.isBoom) {
      throw error;
    }
    console.error("Error during booking process:", error);
    throw boom.internal(
      error.message || "An error occurred while booking the seats."
    );
  }
};

module.exports = {
  bookSeatsByLocation,
};

