const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const busSchema = new Schema(
  {
    
    busNumber: { type: String, required: true, unique: true },
    busType: {
      type: String,
      enum: ["AC/Sleeper", "Non-AC/Sleeper", "AC/Seater", "Non-AC/Seater"],
      required: true,
    },

    capacity: { type: Number, required: true },
    features: [{ type: String }],
    seats: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

const Bus = dbConn.model("Bus", busSchema);
module.exports = Bus;
