import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller_id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
