import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";

import { sendConfirmationEmail } from '../utils/emailQueue.js';

export const checkout = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId').session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cart empty' });
    }

    const orderItems = [];
    let total = 0;

    for (const it of cart.items) {
      const prod = await Product.findById(it.productId._id).session(session);
      if (!prod) {
        await session.abortTransaction();
        return res.status(404).json({ message: `Product ${it.productId._id} not found` });
      }
      if (prod.availableStock < it.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Insufficient stock for product ${prod.name}` });
      }
      prod.availableStock -= it.quantity;
      prod.reservedStock += it.quantity;
      await prod.save({ session });

      orderItems.push({
        productId: prod._id,
        quantity: it.quantity,
        priceAtPurchase: prod.price
      });
      total += prod.price * it.quantity;
    }

    const [orderDoc] = await Order.create([{
      userId: req.user._id,
      items: orderItems,
      totalAmount: total,
      status: 'PENDING_PAYMENT'
    }], { session });

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    // schedule auto-cancel in 15 minutes
    setTimeout(async () => {
      try {
        const freshOrder = await Order.findById(orderDoc._id);
        if (freshOrder && freshOrder.status === 'PENDING_PAYMENT') {
          const s = await mongoose.startSession();
          s.startTransaction();
          for (const it of freshOrder.items) {
            const p = await Product.findById(it.productId).session(s);
            if (p) {
              p.reservedStock -= it.quantity;
              p.availableStock += it.quantity;
              await p.save({ session: s });
            }
          }
          freshOrder.status = 'CANCELLED';
          await freshOrder.save({ session: s });
          await s.commitTransaction();
          s.endSession();
          console.log(`Order ${freshOrder._id} auto-cancelled due to non-payment`);
        }
      } catch (err) {
        console.error('Auto-cancel error', err);
      }
    }, 15 * 60 * 1000);

res.status(201).json({
  _id: orderDoc._id,
  userId: orderDoc.userId,
  status: orderDoc.status,
  totalAmount: orderDoc.totalAmount
});

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const payOrder = async (req, res, next) => {
  const orderId = req.params.id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!order.userId.equals(req.user._id) && req.user.role !== 'ADMIN') {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not allowed' });
    }
    if (order.status !== 'PENDING_PAYMENT') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Order not pending payment' });
    }

    const [payment] = await Payment.create([{
      orderId: order._id,
      transactionId: `txn_${Date.now()}`,
      amount: order.totalAmount,
      status: 'SUCCESS'
    }], { session });

    for (const it of order.items) {
      const p = await Product.findById(it.productId).session(session);
      if (!p) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Product not found during payment' });
      }
      p.reservedStock -= it.quantity;
      if (p.reservedStock < 0) p.reservedStock = 0;
      await p.save({ session });
    }

    order.status = 'PAID';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    sendConfirmationEmail(order);

    res.json({ message: 'Payment successful, order PAID', payment });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const count = await Order.countDocuments({ userId: req.user._id });
    res.json({ total: count, page, limit, orders });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.userId.equals(req.user._id) && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Not allowed' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};