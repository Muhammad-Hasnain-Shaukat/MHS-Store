import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Build a nested tree from the flat list of categories
const buildTree = (categories, parentId = null) =>
  categories
    .filter((c) => String(c.parent || "") === String(parentId || ""))
    .map((c) => ({
      _id: c._id,
      name: c.name,
      slug: c.slug,
      children: buildTree(categories, c._id),
    }));

// Collect this category's id plus every descendant id (for filtering products)
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

// @route  GET /api/categories  (public - full nested tree)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(buildTree(categories));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/categories/:id/descendants  (public - used for product filtering)
router.get("/:id/descendants", async (req, res) => {
  try {
    const categories = await Category.find();
    const ids = collectDescendantIds(categories, req.params.id);
    res.json(ids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/categories  (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, parent } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const category = await Category.create({
      name,
      slug: slugify(name),
      parent: parent || null,
    });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A category with this name already exists at this level" });
    }
    res.status(400).json({ message: err.message });
  }
});

// @route  DELETE /api/categories/:id  (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const categories = await Category.find();
    const idsToDelete = collectDescendantIds(categories, req.params.id);

    const productsUsingCategory = await Product.countDocuments({ category: { $in: idsToDelete } });
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${productsUsingCategory} product(s) still use this category or its subcategories. Reassign or delete them first.`,
      });
    }

    await Category.deleteMany({ _id: { $in: idsToDelete } });
    res.json({ message: "Category and subcategories removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
