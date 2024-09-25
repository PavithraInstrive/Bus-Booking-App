const Route = require("./index");

const findOne = async (data) => {
  return await Route.findOne(data);
};

const find = async (limit, skip) => {
  const routes = await Route.find().skip(skip).limit(parseInt(limit));
  return routes;
};

const countAll = async () => {
  const totalBuses = await Route.countDocuments();
  return totalBuses;
};

const create = async (params) => {
  const data = await Route.create(params);
  return data;
};

const findById = async (id) => {
  const data = await Route.findById(id);
  return data;
};
module.exports = {
  findOne,
  create,
  findById,
  find,
  countAll,
};
