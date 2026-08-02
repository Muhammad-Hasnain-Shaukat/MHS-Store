import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route  POST /api/orders  (login required)
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  GET /api/orders/my  (login required - order tracking for the logged in user)
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/orders  (admin only - view all orders)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  PUT /api/orders/:id/status  (admin only)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
