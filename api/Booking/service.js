const Booking = require("./index");
const boom = require("@hapi/boom");

const bookSeatsByLocation = async (req,userId) => {
  
  const { busId,routeId, seatIds, price, from, to,status } = req;
  
  const seatIdsArray = Array.isArray(seatIds) ? seatIds : [seatIds];

  const existingBookings = await Booking.find({
    busId,
    routeId,
    seatIds: { $in: seatIdsArray },
    $or: [
      { from: { $lte: from }, to: { $gt: from } },
      { from: { $lt: to }, to: { $gte: to } },
      { from: { $gte: from }, to: { $lte: to } },
    ],
    status
  });
  
  if (existingBookings.length > 0) {
    throw boom.conflict(`One or more seats are already booked for the selected 'from' and 'to' locations.`);
  }

  const totalPrice = seatIdsArray.length * price;

  const booking = await Booking.create({
    busId,
    routeId,
    userId,
    seatIds: seatIdsArray,
    pricePerSeat: price,
    totalPrice,
    from,
    to,
    status
  });



  return {
    booking,
    totalPrice,
  };
};


module.exports = {
  bookSeatsByLocation,
};