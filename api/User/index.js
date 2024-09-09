const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = dbConn.model("user", userSchema);
module.exports = User;
