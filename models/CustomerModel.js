import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    company:String,
    email:String,
    phone:String,
    address:String,
    notes:String,

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});
const CustomerModel = mongoose.model("Customer",customerSchema);
export default CustomerModel;