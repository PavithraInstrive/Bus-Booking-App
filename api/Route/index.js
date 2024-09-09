const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const routeSchema = new Schema(
  {
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    distance: { type: Number, required: true },
    stops: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Route = dbConn.model("route", routeSchema);
module.exports = Route;
