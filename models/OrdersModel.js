import mongoose from 'mongoose';

const orderLineSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},
    tax:{type:Number,required:true,default:0}
});

const orderSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["draft", "pending", "shipped", "completed", "cancelled"],
        default:"pending"
    },
    total:{
        type:Number,
        required:true,
    },
    lines:[orderLineSchema]
},{timestamps:true});

const OrderModel = mongoose.model("Order",orderSchema);
export default OrderModel;