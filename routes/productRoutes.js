import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  getProduct
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import Joi from "joi";

const router = express.Router();

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().allow(""),
  availableStock: Joi.number().integer().min(0).required(),
});

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post("/", protect, authorizeRoles("ADMIN"), validateBody(productSchema), createProduct);
router.put("/:id", protect, authorizeRoles("ADMIN"), validateBody(productSchema), updateProduct);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteProduct);

export default router;

