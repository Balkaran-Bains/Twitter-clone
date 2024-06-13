import express from "express";
import dotenv from "dotenv"
import connectDB from "./db/connectMongosb.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary';

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js"
import postRoutes from "./routes/post.routes.js";
import notificationtRoutes from "./routes/notification.routes.js";
//import cors from 'cors'

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const app = express();
// app.use(cors({
//   // origin: process.env.CORS_ORIGIN,
//   origin:'http://localhost:3000',
//   credentials: true,
// }))
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notification", notificationtRoutes)






connectDB();
app.listen(process.env.PORT || 8000, ()=>{
console.log(`Surver is running at port: ${process.env.PORT}`);
})