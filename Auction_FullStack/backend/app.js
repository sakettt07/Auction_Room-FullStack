import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookie_parser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/db.js";

const app=express();
config({
    path:"./config/config.env"
})

// connecting the frontend to backend
app.use(cors(
    {origin:[process.env.FRONTEND_URL],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,}
))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));



connectDB();


export {app};