import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookie_parser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import auctionItemRouter from "./routes/auctionItem.routes.js";
import bidRouter from "./routes/bid.routes.js";
import commissionRouter from "./routes/commission.routes.js";
import adminRouter from "./routes/platformAdmin.routes.js";
import { auctionEnded } from "./auto/auctionEndedCron.js";
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

//defining all the routes
app.use("/api/v1/user",userRouter);
app.use("/api/v1/auctionItem",auctionItemRouter);
app.use("/api/v1/bid",bidRouter);
app.use("/api/v1/commission",commissionRouter);
app.use("/api/v1/platformadmin",adminRouter);

auctionEnded();
connectDB();
app.use(errorMiddleware)


export {app};