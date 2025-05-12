import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js'

export const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"})
        }
        const jwt_secret = process.env.JWT_SECRET;
        
        const decoded = await jwt.verify(token ,jwt_secret);

        if(!decoded){
            return res.status(401).json({message:"Unautherized - Invalid token"});
        }
        const id = decoded.userId
        const user = await User.findById(id).select('-password'); // all data receive of user only password is not receive because of select

        if(!user){
            return res.status(401).json({message:"Unautherized - user not found"});
        }
        // global veriable 
        req.user = user;
        next(); // call next function after this function
    }
    catch(e){
        console.log("Error in protectRoute middleware: ", e.message);
        res.status(500).json({message:"Internal server error: " + e.message}) 
    }
}
