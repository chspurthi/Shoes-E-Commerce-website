import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/products
// Query params: keyword, category, sort (price_asc | price_desc | newest), featured
router.get("/", (req, res) => {
  try {
    const { keyword, category, sort, featured } = req.query;
    const products = Product.findAll({
      keyword,
      category,
      sort,
      featured: featured === "true",
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
router.get("/:id", (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products (admin only)
router.post("/", protect, admin, (req, res) => {
  try {
    const product = Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id (admin only)
router.put("/:id", protect, admin, (req, res) => {
  try {
    const product = Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id (admin only)
router.delete("/:id", protect, admin, (req, res) => {
  try {
    const deleted = Product.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
