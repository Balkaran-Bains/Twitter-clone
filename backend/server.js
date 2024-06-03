import express from "express";
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv"
import connectDB from "./db/connectMongosb.js";

dotenv.config();


 const app = express();

 app.use("/api/auth", authRoutes)
 
 connectDB();
 app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Surver is running at port: ${process.env.PORT}`);
    
 })