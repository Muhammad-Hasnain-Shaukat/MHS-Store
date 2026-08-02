import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const collectDescendantIds = (categories, rootId) => {
  const ids = [String(rootId)];
  const walk = (parentId) => {
    categories
      .filter((c) => String(c.parent || "") === String(parentId))
      .forEach((c) => {
        ids.push(String(c._id));
        walk(c._id);
      });
  };
  walk(rootId);
  return ids;
};

// @route  GET /api/products  (public - browse without login)
// Supports ?category=<id> which also matches all subcategories of that category.
router.get("/", async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    if (category) {
      const categories = await Category.find();
      const ids = collectDescendantIds(categories, category);
      filter.category = { $in: ids };
    }

    const products = await Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/products/:id  (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/products  (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  PUT /api/products/:id  (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  DELETE /api/products/:id  (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
