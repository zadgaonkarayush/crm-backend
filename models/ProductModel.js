import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    description:String,
    price:{type:Number,required:true,min:0},
    stock:{type:Number,required:true,min:0},
},{timestamps:true});

const ProductModel = mongoose.model("Product",productSchema);
export default ProductModel;