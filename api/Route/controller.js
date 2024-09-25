const service = require("./service");
const boom = require("@hapi/boom");

const addRouteSchema = async (req) => {
  const data = await service.create(req.body);
  const result = {
    message: "Route Added Successfully",
    data: data,
  };
  return result;
};


const routeList = async (req) => {  
  const { limit,page } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const data = await service.find(limit,skip);
  const totalCount = await service.countAll();
  console.log(totalCount);
  

  const result = {
    message: "Route List",
    data: data,
    totalCount
  };
  return result;
}
module.exports = {
  addRouteSchema,
  routeList
};
