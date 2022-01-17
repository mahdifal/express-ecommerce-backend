const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

exports.Order = mongoose.model("Order", orderSchema);
