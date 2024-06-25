// model for orders that

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  is_delevered: {
    type: Boolean,
    default: false,
  },

  total: {
    type: Number,
    required: true,
  },
  order_items: {
    type: Array,
    required: true,
  },
});

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
