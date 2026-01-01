import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:["admin","sales","manager"],
        default:"sales"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    managerId:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export default mongoose.model("User",userSchema);