const service = require("./service");
const boom = require("@hapi/boom");
const { generateTokens } = require("../../system/middleware/jwt");
const bcrypt = require("bcryptjs");

const signUp = async (req) => {
  const { email, phone, password } = req.body;

  const userExistsEmail = await service.findOne({ email });
  const userExistsPhoneNumber = await service.findOne({ phone });

  if (userExistsEmail) {
    throw boom.conflict("Email is Already Registered.");
  } else if (userExistsPhoneNumber) {
    throw boom.conflict("Phone number is Already Registered.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = { ...req.body, password: hashedPassword };

  const result = await service.createUser(userData);
  return { message: result.message };
};

const login = async (req) => {
  const { email, password } = req.body;

  const user = await service.findOne({ email });

  if (!user) {
    throw boom.badRequest("User not found.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw boom.badRequest("Incorrect credential");
  }

  const payload = {
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  };

  const { token, refreshToken } = await generateTokens(payload);

  return {
    message: "Sign In Successfully",
    accessToken: token,
    refreshToken: refreshToken,
  };
};

const viewProfile = async (req) => {
  const user = await service.findById(req.user.id);
  const result = {
    message: "Profile Viewed Successfully",
    data: user,
  }
  return result;
};






module.exports = {
  signUp,
  login,
  viewProfile,
};
