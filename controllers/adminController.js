import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const listOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const count = await Order.countDocuments(filter);
    res.json({ total: count, page: Number(page), limit: Number(limit), orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const allowed = ['SHIPPED','DELIVERED','CANCELLED'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'CANCELLED' && order.status === 'PENDING_PAYMENT') {
      for (const it of order.items) {
        const p = await Product.findById(it.productId).session(session);
        if (p) {
          p.reservedStock -= it.quantity;
          p.availableStock += it.quantity;
          await p.save({ session });
        }
      }
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};