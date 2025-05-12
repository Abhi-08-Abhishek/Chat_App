import mongoose from 'mongoose'

export const connectDB = async()=>{
    try {
        const mongodb = process.env.MONGO_DB ;
        const conn = await mongoose.connect(mongodb,{
            dbName:"Chat_App"
        })
        console.log(`MongoDB connected ${conn.connection.host}`);
    } catch (e) {
        console.log('Mongodb connection failed' + e.message)   
    }
}
