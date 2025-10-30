import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  checkout,
  payOrder,
  getOrders,
  getOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/checkout", protect, checkout);
router.post("/:id/pay", protect, payOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);

export default router;

