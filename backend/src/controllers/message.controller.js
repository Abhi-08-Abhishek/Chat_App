import {User} from '../models/user.model.js';
import { Message } from '../models/message.model.js';

import cloudinary from '../lib/cloudinary.js'
import {io , getReceiverSocketId} from '../lib/socket.js'

export const getUsersForSidebar = async(req,res)=>{
    try {
        // coming from middleware 
        const LoggedInUserId = req.user._id;
        // $en not equal to login user all user find only login user not find  //not get password
        const filteredUsers = await User.find({_id:{$ne:LoggedInUserId}}).select('-password');
        
        res.status(200).json(filteredUsers);

    } catch (e) {
        console.log("Error in getUserForSidebar: ", e.message);
        res.status(500).json({e:"Internal server Error"});
    }
}

export const getMessages = async(req,res)=>{
    try {   // id of user to chat  pamams help to get id from url
            const {id:userToChatId} = req.params;
            // my id from req.user
            const myId = req.user._id;
            // get data from condition which is true 
            const messages = await Message.find({
                $or:[ // or operaters for condition 1 is true or 2 is true get data
                    {senderId:myId , receiverId:userToChatId}, // 1 condition
                    {senderId:userToChatId , receiverId:myId} // 2 condition
                ]
            })
            // send data to res
            res.status(200).json(messages);
    } catch (e) {
         console.log("Error in getMessages: ", e.message);
        res.status(500).json({e:"Internal server Error"});
    }
}

export const sendMessage = async(req,res)=>{
    try{
        // get data from req.body
        const {text , image} = req.body;
        // params is using to get data from url 
        const {id:receiverId} = req.params;
        // login user from middleware
        const senderId = req.user._id;

        let imageUrl;
        // if user send image then upload it to cloudinary
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
           // console.log(uploadResponse)
            imageUrl = uploadResponse.secure_url;
        }
        // save data in database
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        // save user activity
        await newMessage.save();

        // TODO: IMPLEMENT SOCKET IO TO SEND MESSAGE TO RECEIVER FOR REALTIME CHAT
        // get receiver id from get Receiver Socket Id
        const receiverSocketId = getReceiverSocketId(receiverId);
        // id received then
        if(receiverSocketId){
            // io.to is pipeline to send perticular user  // send message to receiverSocketId match user
            io.to(receiverSocketId).emit('newMessage', newMessage);  // Correct
        }

        res.status(200).json(newMessage);
    } 
    catch(e){
        console.log("Error in sendMessage: ", e.message);
        res.status(500).json({e:"Internal server Error"});  
    }  
}