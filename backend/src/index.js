import express from 'express'
import dotenv from  'dotenv'
import cookieparser from 'cookie-parser'
import cors from 'cors'

import path from 'path';

import {connectDB} from './lib/db.js'

import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.route.js'
import {app , server } from './lib/socket.js';


//dotenv.config();

// path set of env
dotenv.config({ path: 'src/.env'});


// to increase size when we upload image
app.use(express.json({ limit: '50mb' }));  // 50mb



app.use(express.json());
// using cookieparser to store jwt token 
app.use(cookieparser());

// secure url path by providing url
app.use(
   cors({ // only allow this url to access only other are block
        origin:["https://chat-app-frontend-exw3.onrender.com/" ],
        methods:["POST","GET","PUT","DELETE"],
        credentials:true,
    })
);
// Auth routes for user
app.use('/api/auth', authRoutes);

// message send
app.use('/api/messages', messageRoutes);


const port = process.env.PORT

server.listen(port, ()=>{
            // latest date
    console.log(`${new Date()} Server is running on port : ${port}`)});
    // call connectDB
    connectDB();

