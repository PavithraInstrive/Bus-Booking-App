const service = require("./service");
const boom = require("@hapi/boom");
const { generateTokens } = require("../../system/middleware/jwt");
const bcrypt = require("bcryptjs");

const addRouteSchema = async (req) => {

  const data = await service.create(req.body);
  const result ={
    message: "Route Added Successfully",
    data: data
  }
  return result;
};


module.exports = {
  addRouteSchema,
};
