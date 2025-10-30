import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { listOrders, updateOrderStatus } from "../controllers/adminController.js";
import Joi from "joi";
import { validateBody } from "../middlewares/validate.js";

const router = express.Router();

const statusSchema = Joi.object({
  status: Joi.string().valid("SHIPPED", "DELIVERED", "CANCELLED").required(),
});

router.get("/orders", protect, authorizeRoles("ADMIN"), listOrders);
router.patch(
  "/orders/:id/status",
  protect,
  authorizeRoles("ADMIN"),
  validateBody(statusSchema),
  updateOrderStatus
);

export default router;


