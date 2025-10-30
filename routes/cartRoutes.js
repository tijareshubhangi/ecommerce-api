import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import Joi from "joi";
import { getCart, addOrUpdateItem, removeItem } from "../controllers/cartController.js";

const router = express.Router();

const addSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

router.get("/", protect, getCart);
router.post("/items", protect, validateBody(addSchema), addOrUpdateItem);
router.delete("/items/:productId", protect, removeItem);

export default router;

