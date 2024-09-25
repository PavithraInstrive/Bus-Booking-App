const schedule = require("./index");
const Route = require("../Route/index");

const findOne = async (busId, routeId, arrivalTime, departureTime) => {
  const result = await schedule.findOne({
    busId,
    routeId,
    $or: [
      {
        departureTime: { $lte: departureTime },
        arrivalTime: { $gte: departureTime },
      },
      {
        departureTime: { $lte: arrivalTime },
        arrivalTime: { $gte: arrivalTime },
      },
      {
        departureTime: { $gte: departureTime },
        arrivalTime: { $lte: arrivalTime },
      },
      {
        departureTime: { $lte: departureTime },
        arrivalTime: { $gte: arrivalTime },
      },
    ],
  });
  return result;
};

const create = async (params) => {
  const data = await schedule.create(params);
  return data;
};

const getAllSchedules = async (limit, skip) => {
  const now = new Date();

  const schedules = await schedule
    .find({ departureTime: { $gte: now } })
    .populate({
      path: "busId",
      select: "busNumber busType capacity features",
    })
    .populate({
      path: "routeId",
      select: "startLocation endLocation distance",
    })
    .skip(skip)
    .limit(parseInt(limit));

  const formattedSchedules = schedules.map((schedule) => ({
    scheduleId: schedule._id,
    departureTime: schedule.departureTime,
    arrivalTime: schedule.arrivalTime,
    price: schedule.price,
    busNumber: schedule.busId.busNumber,
    busType: schedule.busId.busType,
    capacity: schedule.busId.capacity,
    features: schedule.busId.features,
    startLocation: schedule.routeId.startLocation,
    endLocation: schedule.routeId.endLocation,
    distance: schedule.routeId.distance,
  }));
  console.log(formattedSchedules);

  return formattedSchedules;
};

const countAll = async () => {
  const now = new Date();
  const totalBuses = await schedule.countDocuments({ departureTime: { $gte: now } });
  return totalBuses;
};


const getScheduledBuses  = async (from, to, date, limit, skip) => {
  const dateObj = new Date(date);

  const result = await Route.aggregate([
    {
      $match: {
        $or: [
          { startLocation: from, endLocation: to },
          { stops: { $all: [from, to] } },
          { startLocation: from, stops: to },
          { endLocation: to, stops: from },
        ],
      },
    },
    {
      $lookup: {
        from: "schedules",
        localField: "_id",
        foreignField: "routeId",
        as: "schedules",
      },
    },
    {
      $unwind: "$schedules",
    },
    {
      $match: {
        "schedules.departureTime": {
          $gte: dateObj,
        },
      },
    },
    {
      $lookup: {
        from: "buses",
        localField: "schedules.busId",
        foreignField: "_id",
        as: "busDetails",
      },
    },
    {
      $unwind: "$busDetails",
    },
    {
      $facet: {
        data: [
          {
            $project: {
              _id: 0,
              routeId: "$_id",
              startLocation: 1,
              endLocation: 1,
              distance: 1,
              scheduleId: "$schedules._id",
              departureTime: "$schedules.departureTime",
              arrivalTime: "$schedules.arrivalTime",
              price: "$schedules.price",
              busNumber: "$busDetails.busNumber",
              busType: "$busDetails.busType",
              capacity: "$busDetails.capacity",
              features: "$busDetails.features",
            },
          },
          { $sort: { "schedules.departureTime": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ],
        totalCount: [{ $count: "total" }], 
      },
    },
  ]);

  const scheduledBuses = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.total || 0;

  return { scheduledBuses, totalCount };
};


module.exports = {
  create,
  findOne,
  getScheduledBuses,
  getAllSchedules,
  countAll,
};
