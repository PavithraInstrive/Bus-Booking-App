const service = require("./service");
const boom = require("@hapi/boom");
const { generateSeatNames } = require("../../system/utils/seats");

const addBus = async (req) => {
  const { busNumber, busType, capacity, features } = req.body;

  const existingBus = await service.findOne({ busNumber });
  if (existingBus) {
    throw boom.conflict("Bus number is already registered.");
  }
  console.log(existingBus, "existingBus");

  const seatNames = generateSeatNames(capacity);

  const data = await service.create({
    busNumber,
    busType,
    capacity,
    features,
    seats: seatNames.map((seatName, index) => ({
      seatId: index + 1,
      seatName,
    })),
  });

  const result = {
    message: "Bus Added Successfully",
    data: data,
  };
  return result;
};
const getBusDetailsById = async (req) => {
  const { busId } = req.query;

  if (!busId) {
    throw boom.badRequest("Bus ID is required.");
  }

  const busDetails = await service.getBusDetailsWithBookings(busId);

  if (!busDetails) {
    throw boom.notFound("Bus not found.");
  }
  return {
    message: "Bus details retrieved successfully.",
    data: busDetails,
  };
};

const changeStatus = async (req, res, next) => {
  const { busId } = req.query;
  const { status, seatId } = req.body;

  const updatedBus = await service.findOneAndUpdate(busId, status, seatId);

  if (!updatedBus) {
    throw boom.notFound("Bus or Seat not found");
  }
  const result = {
    message: "Seat status updated successfully",
    data: updatedBus,
  };
  return result;
};

const getAllBuses = async (req) => {
  const { limit,page } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const buses = await service.find(limit,skip);
  const totalCount = await service.countAll();

  const result = {
    message: "All buses retrieved successfully.",
    data: buses,
    totalCount
  };

  return result;
};
const fetchAvailableBuses = async (req) => {
  const { departureTime, arrivalTime } = req.query;
  const buses = await service.findbuses(departureTime,arrivalTime);

const result = {
  message: "Available buses retrieved successfully.",
  data: buses,
};
return result;
};


module.exports = {
  addBus,
  getBusDetailsById,
  changeStatus,
  getAllBuses,
  fetchAvailableBuses
};
