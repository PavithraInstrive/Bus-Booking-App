const Route = require("./index");

const findOne = async (data) => {
  return await Route.findOne(data);
};

const create = async (params) => {  
   const data = await Route.create(params); 
  return data;
};

module.exports = {
  findOne,
  create
};
