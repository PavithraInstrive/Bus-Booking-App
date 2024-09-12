const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const cardSchema = new Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  customer: { type: String },
  payment_method: { type: String },
  created_at: { type: Date, required: true },
}, { timestamps: true });


const Card = dbConn.model("Payment", cardSchema);
module.exports = Card;
