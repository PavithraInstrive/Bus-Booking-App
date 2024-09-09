const Route = require("./index");

const findOne = async (data) => {
  return await Route.findOne(data);
};

const create = async (params) => {  
   const data = await Route.create(params); 
  return data;
};

const findById = async (id) => {  
  console.log(id);
  
  const data = await Route.findById(id);
  console.log(data);
  
  return data;
};
module.exports = {
  findOne,
  create,
  findById
};
