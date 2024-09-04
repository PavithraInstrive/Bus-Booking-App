const service = require("./service");
const boom = require("@hapi/boom");

const addBus = async (req) => {
  try {
    const data = await service.create(req.body);
    const result = {
      message: "Bus Added Successfully",
      data: data
    };
    return result;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.busNumber) {
      throw boom.conflict("Bus number must be unique. This bus number already exists.");
    }
    throw boom.internal("An unexpected error occurred while adding the bus.");
  }
};


module.exports = {
  addBus,
};
