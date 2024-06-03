import mongoose from "mongoose";

const connectDB = async(req,res)=>{
    try {
        const connectionInstance= await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to mongoDB: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;