import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer_id: { type: Number, required: true },
    seller_id: { type: Number, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
