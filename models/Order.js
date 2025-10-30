import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  userId:{
     type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      priceAtPurchase: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["PENDING_PAYMENT", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING_PAYMENT"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

