import Product from "../models/Product.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { seller_id, name, price, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      seller_id,
      name,
      price,
      quantity,
      description,
      image,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = { name, price, quantity, description };
    if (image) {
      updateData.image = image;
      const product = await Product.findById(id);
      if (product.image) {
        fs.unlinkSync(path.join(process.cwd(), product.image));
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
