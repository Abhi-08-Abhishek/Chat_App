import bcrypt from 'bcryptjs'
import {User} from '../models/user.model.js'
import { generateToken } from '../utils/utils.js'
import cloudinary from '../lib/cloudinary.js'


// singup 
export const signup = async(req,res)=>{
    const {email , fullName , password} = req.body
    try {
        // all field are required
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All fields are required"});
        }
        // if password is less then 8 then error
        if(password.length < 8){
            return res.status(400).json({message:"Password must be atlest 8 character long"})
        }
        // find user in exists or not
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User Already exists with this email",success:false});
        }
        // hash password    // use Intparse to convert string into number
        const saltRounds = parseInt(process.env.SALT_ROUND)
        const salt = await bcrypt.genSalt(saltRounds);
    
        const hashpassword = await bcrypt.hash(password , salt);

        // new user created
         const newUser = new User({
            fullName,
            email,
            password:hashpassword
         })
         // if user created generate token 
         if(newUser){
            // pass newUser id to generate token
           generateToken(newUser._id , res);
           await newUser.save();
            // send data in response
           res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
            message:"User registered successfully",success:true});
         }
         else{
            res.status(400).json({message:"Invalid user data"});
         }
    } catch (e) {
        console.log("Error in register controller: ", e.message);
        res.status(500).json({message:"Error in signup controller" + e.message})
    }
}

// login
export const login = async(req,res)=>{
    const {email , password} = req.body
    try {
        if(!email || !password){
            return res.status(400).json({message:"All fiels are required"});
        }
        // check password is greater then 8 character
        if(password < 8){
            return res.status(400).json({message:"Password must be atlest 8 character long"})
        }
        // check user exit or not
        const existUser = await User.findOne({email});

        if(!existUser){
            return res.status(400).json({message:"Invalid credentials or user not exists",success:false});
        }
        // compare hashpassword from database and password from req.body
        const isPasswordCorrect = await bcrypt.compare(password , existUser.password);
        
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials or wrong password",success:false})
        }
        // generate token when user is logging
     await generateToken(existUser._id , res);

     return res.status(200).json({
            _id:existUser._id,
            fullName:existUser.fullName,
            email:existUser.email,
            profilePic:existUser.profilePic,
            message:"login successfully",success:true
        })
    } catch (e) {
        console.log("Error in register controller: ", e.message);
        return res.status(500).json({message:"Error in signup controller" + e.message}) 
    }
}

// logout
export const logout = async(req,res)=>{
    try{
        // remove token from cookie
        res.clearCookie('jwt'," ",{maxAge: 0});
        res.status(200).json({message:"logged out successfully",success:true});
    }catch(e){
        console.log("Error in logout controller: ", e.message);
        res.status(500).json({message:"Error in logout controller" + e.message}) 
    }
}

// updatePic 
export const updateProfile = async(req,res)=>{
    try {
        // get pic from req.body
        const {profilePic} = req.body;
        // get user id from global veriable from middleware
        const userId = req.user._id;
        // if pic not find
        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"});
        }
        // upload pic to the cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // to find user and update or add pic to the user
        const updatedUser = await User.findByIdAndUpdate(userId,
            // get data from cloudinary
            {profilePic:uploadResponse.secure_url},
            {new:true} // allow to add different data
        )
        res.status(200).json(updatedUser);
    } catch (e) {
        console.log("Error in updateProfile controller: ", e.message);
        res.status(500).json({message:"Error in logout controller" + e.message}) 
  
    }
}

// check auth user is login or not
export const checkAuth = async(req,res)=>{
    try{
        res.status(200).json(req.user);  // req.user from middleware
    }
    catch(e){
        console.log("Error in authCheck controller: ", e.message);
        res.status(500).json({message:"Internal server error"});
    }
}
