import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import mongoose from "mongoose";
import imageRoute from "./Routes/imageRoutes.js";
import { v2 as cloudinary } from 'cloudinary'
import bodyParser from "body-parser";
 
const app = express()

app.use(bodyParser.json({limit: "50mb"}))

app.use(morgan("dev"))

dotenv.config()

app.use(cors())

mongoose.connect(process.env.DB_URL).then(()=>{
  console.log('MongoDB Succesfully Connected');
}).catch(err=>{console.log(err);
})

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

app.get('/', (req, res)=>{
  res.json('Working beautifully')
})

app.use('/api', imageRoute )

app.listen(process.env.PORT,()=>{
  console.log(`Serving on port ${process.env.PORT}`);
  
})