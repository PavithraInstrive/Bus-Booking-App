const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const routeSchema = new Schema(
  {
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    distance: { type: Number, required: true },
    // stops: [{ type: String }],
    boardingPoints: [{ type: String, required: true }], 
    dropPoints: [{ type: String, required: true }],
    duration: { type: String, required: true }, 
 
  },
  {
    timestamps: true,
  }
);

const Route = dbConn.model("Route", routeSchema);
module.exports = Route;


