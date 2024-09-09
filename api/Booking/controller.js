const service = require("./service");
const boom = require("@hapi/boom");
const busService = require("../Bus/service");
const routeService = require("../Route/service");

const bookSeatsByLocation = async (req) => {
  const { busId,routeId, seatIds, price, from, to,status } = req.body;
  const userId = req.user.id;


  if (!price || price <= 0) {
    throw boom.badRequest("Valid price is required.");
  }
  const seatIdsArray = Array.isArray(seatIds) ? seatIds : [seatIds];

  const busDetails = await busService.findById(busId);  
  console.log(busDetails);
  
  if (!busDetails) {
    throw boom.notFound("Bus not found.");
  }
  const validSeatIds = busDetails.seats.map(seat => seat.seatId);
  const invalidSeats = seatIdsArray.filter(seatId => !validSeatIds.includes(seatId));
  
  if (invalidSeats.length > 0) {
    throw boom.badRequest(`Invalid seat IDs: ${invalidSeats.join(", ")}.`);
  }

  const route = await routeService.findById(routeId);
  if (!route) {
    throw boom.notFound('Route not found.');
  }

  const fromIndex = route.stops.indexOf(from);
  const toIndex = route.stops.indexOf(to);

  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
    throw boom.badRequest(`Invalid 'from' and 'to' locations.`);
  }


  try {
    const bookingResult = await service.bookSeatsByLocation(req.body, userId);

    return {
      message: "Seats booked successfully.",
      data: {...bookingResult,
        "name":"userName",
        "startLocation":route.startLocation,
        "startLocation":route.startLocation,
        "endLocation":route.endLocation,
        "busName":busDetails.busNumber,
      },
    };
  } catch (error) {
    if (error.isBoom) {
      throw error;
    }
    throw boom.internal(error.message || "An error occurred while booking the seats.");
  }
};

module.exports = {
  bookSeatsByLocation,
};
