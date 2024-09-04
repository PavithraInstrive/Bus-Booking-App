const schedule = require("./index");
const Route = require("../Route/index");

const findOne = async (busId,routeId,arrivalTime,departureTime) => {  
  const result =await schedule.findOne({busId,
    routeId, 
    $or: [
      { departureTime:{ $gte: arrivalTime, $lte: departureTime }},
      { arrivalTime:{ $gte: arrivalTime, $lte: departureTime }},
    ],});
  return result
  
};

const create = async (params) => {  
   const data = await schedule.create(params); 
  return data;
};


const getScheduledBuses = async (from, to, date) => {
  const dateObj = new Date(date);
  console.log(dateObj, "dateObj"); 

  const scheduledBuses = await Route.aggregate([
    {
      $match: {
        $or: [
          { startLocation: from, endLocation: to },
          { 
            stops: { $all: [from, to] },
          },
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
  ]);

  return scheduledBuses;
};

module.exports = {
  create,
  findOne,
  getScheduledBuses
};
