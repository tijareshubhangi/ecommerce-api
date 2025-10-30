import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:{
     type: String, 
     required: true
     },
  price:{
     type: Number,
     required: true 
    },
  description: String,
  availableStock:{ 
    type: Number,
    default: 0 
    },
  reservedStock:{ 
    type: Number, 
    default: 0 
    }
});

const Product= mongoose.model("Product", productSchema);
export default Product;

