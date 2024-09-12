const User = require("./index");
const bcrypt = require("bcryptjs");

const findOne = async (email) => {
  return await User.findOne(email);
};

const findById = async (id) => {
  return await User.findById(id);
};

const checkPhoneExists = async (phoneNumber) => {
  return await User.findOne({ phoneNumber });
};

const createUser = async (params) => {
  const user = await User.create(params);

  return { message: "New User Created Successfully" };
};

const update = async (userId, body) => {
  const update = await User.findOneAndUpdate(
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

const findUserById = async (userId) => {
  return await User.findById(userId).populate('cards');
};
const updateUserById = async (userId, updateData) => {
  console.log(updateData);
  
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

module.exports = {
  createUser,
  findOne,
  checkPhoneExists,
  findById,
  update,
  findUserById,
  updateUserById
};
