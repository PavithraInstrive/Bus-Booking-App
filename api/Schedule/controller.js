const service = require("./service");
const boom = require("@hapi/boom");
const busService = require("../Bus/service");
const routeService = require("../Route/service");

const scheduleBus = async (req) => {
  const { busId, routeId, departureTime, arrivalTime } = req.body;

  const checkBus = await busService.findOne({ _id: busId });

  const checkRoute = await routeService.findOne({ _id: routeId });

  if (!checkBus) {
    throw boom.notFound("Bus not found");
  } else if (!checkRoute) {
    throw boom.notFound("Route not found");
  }

  const existingSchedule = await service.findOne(
    busId,
    routeId,
    departureTime,
    arrivalTime
  );

  if (existingSchedule) {
    throw boom.conflict(
      "The bus is already scheduled on this route during the specified time."
    );
  }

  const data = await service.create(req.body);
  const result = {
    message: "Bus Scheduled Successfully",
    data: data,
  };
  return result;
};

const getSchedule = async (req) => {
  const { from, to, date } = req.query;

  const scheduledBuses = await service.getScheduledBuses(from, to, date);

  if (!scheduledBuses.length) {
    throw boom.notFound("No scheduled buses found for the specified route.");
  }

  return {
    message: "Scheduled buses retrieved successfully.",
    data: scheduledBuses,
  };
};

module.exports = {
  scheduleBus,
  getSchedule,
};
