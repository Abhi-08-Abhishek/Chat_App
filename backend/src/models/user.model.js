import mongoose, { Types } from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"min legth of password is 8"],
    },
    profilePic:{
        type:String,
        default:"",
    },
    /*createdAt:{
        type:Date,
        default:Date.now(),

    }*/
// when we use timestamps by default createdAt or updatedAt is added in document
},{timestamps:true});

export const User = mongoose.model('User',userSchema);

