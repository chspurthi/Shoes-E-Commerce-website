import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/orders (logged-in users only)
router.post("/", protect, (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Recalculate prices server-side and check stock, never trust client totals
    let itemsPrice = 0;
    for (const item of orderItems) {
      const product = Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      itemsPrice += product.price * item.qty;
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const totalPrice = itemsPrice + shippingPrice;

    const order = Order.create({
      userId: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Decrement stock
    for (const item of orderItems) {
      Product.decrementStock(item.product, item.qty);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
router.get("/myorders", protect, (req, res) => {
  try {
    const orders = Order.findByUser(req.user._id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders (admin only)
router.get("/", protect, admin, (req, res) => {
  try {
    const orders = Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
router.get("/:id", protect, (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user._id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status (admin only)
router.put("/:id/status", protect, admin, (req, res) => {
  try {
    const { status } = req.body;
    const order = Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const updated = Order.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
