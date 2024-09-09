const Bus = require("./index");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const findOne = async (data) => {
  return await Bus.findOne(data);
};

const create = async (params) => {
  const data = await Bus.create(params);
  return data;
};

const findById = async (busId) => {
  const bus = await Bus.findById(busId);

  return bus;
};

const getBusDetailsWithBookings = async (busId) => {
  const busDetails = await Bus.aggregate([
    {
      $match: { _id: new ObjectId(busId) },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "busId",
        as: "bookings",
      },
    },
    {
      $addFields: {
        seats: {
          $map: {
            input: "$seats",
            as: "seat",
            in: {
              $mergeObjects: [
                "$$seat",
                {
                  status: {
                    $cond: {
                      if: {
                        $in: [
                          "$$seat.seatId",
                          {
                            $reduce: {
                              input: "$bookings.seatIds",
                              initialValue: [],
                              in: { $concatArrays: ["$$value", "$$this"] },
                            },
                          },
                        ],
                      },
                      then: "booked",
                      else: "available",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        busNumber: 1,
        busType: 1,
        capacity: 1,
        features: 1,
        seats: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return busDetails[0] || null;
};

module.exports = {
  create,
  findOne,
  findById,
  getBusDetailsWithBookings,
};
