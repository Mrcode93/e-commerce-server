// controllers/orderController.js

const orderModel = require("../models/orders");

const addOrder = async (req, res) => {
  //  Check if you receive the correct data
  const { name, phone, address, city, total, orderItems } = req.body;

  const newOrder = new orderModel({
    name,
    phone,
    address,
    city,
    total,
    order_items: orderItems, // Ensure the field name matches your schema ('order_items')
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addOrder };

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// is_deleverd controller

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { is_delevered } = req.body;
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(id, {
      is_delevered: !is_delevered,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrder,
  getOrders,
  updateOrder,
};
