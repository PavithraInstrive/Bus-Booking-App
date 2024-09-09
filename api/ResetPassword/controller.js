const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Password = require("./index");
const service = require("./service");
const userService = require("../User/service");
const { sendMail } = require("../../system/sendMail");

const forgotPasswordLink = async (req) => {
  const { email } = req.body;
  const user = await userService.findOne({ email });

  if (!user) {
    const result = {
      message: "User Not Found",
    };
    return result;
  }

  const secretKey = uuidv4();
  const resetPass = new Password({
    userId: user?._id,
    secretKey,
  });

  const add = await service.create(resetPass);
  if (!add._id) {
    throw boom.badRequest("Something went wrong. Please try again.");
  }
  const mailSent = await sendMail(email, user, secretKey);

  if (mailSent) {
    const result = {
      message: "To Reset Password Link Sended Successfully",
    };
    return result;
  }
  return false;
};

const updatePassword = async (req) => {
  const secretKey = req?.params.key;
  let password = req?.body?.password;

  const findPass = await service.find({ secretKey });

  if (!findPass) {
    throw boom.badRequest("Reset Password Link Is Expired");
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let body = { password: hashedPassword };
    const data = await userService.update(findPass?.userId, body);

    const result = {
      message: "Password Updated Successfully",
      detail: data,
    };
    await service.deletePass(findPass?._id);
    return result;
  } else {
    throw boom.notFound("Something went wrong.");
  }
};

const resetPassword = async (req) => {
  const { existingPassword, newPassword, confirmNewPassword } = req.body;

  const userId = req.user.id;
  const user = await userService.findById(userId);
  if (!user) {
    throw boom.notFound("User not found or invalid token.");
  }

  if (existingPassword) {
    const isPasswordValid = await bcrypt.compare(
      existingPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw boom.unauthorized("Existing password is incorrect.");
    }
  }
  if (newPassword !== confirmNewPassword) {
    throw boom.badRequest("New password and confirmation do not match.");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(newPassword, salt);
  let body = { password: hashedPassword };

  const data = await userService.update(user?._id, body);

  const result = {
    message: "User Password Reset Successfully",
  };
  return result;
};

module.exports = {
  forgotPasswordLink,
  updatePassword,
  resetPassword,
};
