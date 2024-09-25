const service = require("./service");
const boom = require("@hapi/boom");
const {
  generateTokens,
  createAccessToken,
} = require("../../system/middleware/jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await service.findOne({ email });

    if (!user) {
      throw boom.badRequest("User not found.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw boom.badRequest("Incorrect credentials.");
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "local",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const result = {
      message: "Sign In Successfully",
      accessToken: token,
      refreshToken: refreshToken,
    };

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  }
};

const refreshtoken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken, "refreshToken");

  if (!refreshToken) return res.sendStatus(401);
  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    const accessToken = await createAccessToken(user.user);
    const result = {
      message: "Tokens Refreshed Successfully",
      accessToken: accessToken,
    };
    return result;
  } catch (err) {
    console.error(err);
    if (err.name === "JsonWebTokenError") {
      return res.sendStatus(403);
    }
    return res.sendStatus(500);
  }
};

const viewProfile = async (req) => {
  const user = await service.findById(req.user.id);
  const result = {
    message: "Profile Viewed Successfully",
    data: user,
  };
  return result;
};

module.exports = {
  signUp,
  login,
  viewProfile,
  refreshtoken,
};
