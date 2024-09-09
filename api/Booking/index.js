const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const bookingSchema = new Schema(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatIds: [
      {
        type: Number,
        required: true,
      },
    ],
    pricePerSeat: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = dbConn.model("booking", bookingSchema);
module.exports = Booking;
