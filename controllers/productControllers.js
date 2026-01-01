import CounterModel from "../models/CounterModel.js";
import ProductModel from "../models/ProductModel.js";

export const createProduct = async (req, res) => {
  try {
    const counter = await CounterModel.findOneAndUpdate(
      { name: "product_sku" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const sku = `SKU-${counter.seq}`;
    const product = await ProductModel.create({
      ...req.body,
      sku,
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }
    res.status(400).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const query = {};

    if (req.query.lowStock === "true") {
      query.stock = { $lt: 10 };
    }
    const products = await ProductModel.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const bulkProductDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }

    const result = await ProductModel.deleteMany({
      _id: { $in: ids },
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No products found to delete" });
    }
    res.status(200).json({
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
