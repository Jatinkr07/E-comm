import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { buyer_id, seller_id, product_id, quantity, price } = req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Not enough quantity available" });
    }

    const order = new Order({
      buyer_id,
      seller_id,
      product_id,
      quantity,
      price,
    });
    await order.save();

    product.quantity -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    let orders;

    if (userId) {
      orders = await Order.find({
        $or: [{ buyer_id: parseInt(userId) }, { seller_id: parseInt(userId) }],
      }).populate("product_id");
    } else {
      orders = await Order.find().populate("product_id");
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
