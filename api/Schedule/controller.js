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
  const { from, to, date, page, limit } = req?.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let scheduledBuses;
  let totalCount;

  if (!from || !to || !date) {
    scheduledBuses = await service.getAllSchedules(limit, skip);
    totalCount = await service.countAll();
  } else {
    buses = await service.getScheduledBuses(from, to, date, limit, skip);
    scheduledBuses =buses.scheduledBuses
    totalCount = buses.totalCount
  }
  if (!scheduledBuses.length) {
    throw boom.notFound("No scheduled buses found for the specified route.");
  }

  return {
    message: "Scheduled buses retrieved successfully.",
    data: scheduledBuses,
    totalCount,
  };
};


const getAllSchedules = async (req) => {
  const { limit,page } = req.query;
  console.log(limit,page);
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const scheduledBuses = await service.getAllSchedules(limit,skip);
  const totalCount = await service.countAll();
  const result = {
    message: "All buses retrieved successfully.",
    data: scheduledBuses,
    totalCount
  };
  return result;
};



module.exports = {
  scheduleBus,
  getSchedule,
  getAllSchedules
};
