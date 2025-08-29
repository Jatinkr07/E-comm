import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);

export default router;
