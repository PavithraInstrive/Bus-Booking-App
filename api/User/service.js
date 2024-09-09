const User = require("./index");
const bcrypt = require("bcryptjs");

const findOne = async (email) => {
  return await User.findOne(email );
};

const create = async (params) => {
  const newResetPass = await Password.create(params);
  return newResetPass;
};

const findById = async (id) => {
  return await User.findById(id);
};

const checkPhoneExists = async (phoneNumber) => {
  return await User.findOne({ phoneNumber });
};

const createUser = async (params) => {
  console.log(params,"params");
  
   const user = await User.create(params);
   console.log(user,"user");
   
  return { message: "New User Created Successfully" };
};

const update = async (userId, body) => {
  console.log("userId", userId,body);
  
  const update= await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      ...body,
    },
    {
      new: true,
    }
  );
  
  return update;
};

const find = async (params) => {
  const { role, limit, page } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const pipeline = [
    {
      $match: { role: role },
    },
    {
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
          { $project: { password: 0 } },
        ],
      },
    },
  ];

  const result = await User.aggregate(pipeline);
  const totalCount = result[0]?.metadata[0]?.totalCount;
  const users = result[0]?.data;

  return {
    totalCount,
    limit: parseInt(limit),
    data: users,
    page: parseInt(page),
    totalPages: Math.ceil(totalCount / limit),
  };
};

module.exports = {
  createUser,
  find,
  findOne,
  checkPhoneExists,
  findById,
  update
};
