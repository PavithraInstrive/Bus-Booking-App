// models/cardSchema.js
const { Schema } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const cardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethodId: {
    type: String,
  },
  last4: {
    type: String,
  },
  customerId: {
    type: String,
    required: true,
  },
  paymentMethodTypes: {
    type: String,
  },
});

const Card = dbConn.model("Card", cardSchema);
module.exports = Card;
