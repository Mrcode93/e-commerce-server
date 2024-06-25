// controllers/orderController.js

const orderModel = require("../models/orders");

const addOrder = async (req, res) => {
  const order = new orderModel({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    is_delevered: req.body.is_delevered,
    total: req.body.total,
    order_items: req.body.order_items,
  });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
