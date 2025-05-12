import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);

// accept http server
const io = new Server(server,{
    cors:{ // alow user to connect
        origin:["http://localhost:5173" , "http://localhost:5174" ],
        methods:["GET" , "POST" , "PUT" , "DELETE"],
        credentials:true,
    }
});

// give socket id for receiver
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

 const userSocketMap = {}; //{userId : socketId}

// start connection when connection in built run console and pass socket.io
io.on('connection' , (socket)=>{  // connection is a event
    console.log("User connected" , socket.id);
    
    // get user id by handshare method for sender
    const userId = socket.handshake.query.userId;
   
    //if userId is equal to socket.id    // if it is string then access by square bracket
    if(userId){
         userSocketMap[userId] = socket.id
   // io.emit() is used to send event to all the connected  client; not for disconnected
                    // get Online user
    io.emit('getOnlineUsers' , Object.keys(userSocketMap))
    }
   
    // when disconnect connection then run console and pass socket.id
    socket.on('disconnect' ,(socket)=>{ // events
        console.log('User disconnected' , socket.id);
        if(userId){
    // when disconnect then delete user
        delete userSocketMap[userId];
        // update after deleted
        io.emit('getOnlineUsers' , Object.keys(userSocketMap));
        }
    })
})

export {app , server , io};