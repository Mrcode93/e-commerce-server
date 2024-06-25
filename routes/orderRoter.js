// orders router

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/orders", orderController.addOrder);
router.get("/orders", orderController.getOrders);

router.put("/orders/:id", orderController.updateOrder);

module.exports = router;
