const Bus = require("./index");

const findOne = async (data) => {
  console.log(data,"data");
  
  return await Bus.findOne(data);
};

const create = async (params) => {  
   const data = await Bus.create(params); 
  return data;
};

module.exports = {
  create,
  findOne
};
