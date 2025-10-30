import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId:{
     type: mongoose.Schema.Types.ObjectId, ref: "Order" 
    },
  transactionId: String,
  amount: Number,
  status:{
     type: String, enum: ["SUCCESS", "FAILED"] 
    }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
