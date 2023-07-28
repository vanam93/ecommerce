const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary");
const path = require("path");

const connectDb = require("./config/database");

const prodRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute")
const { errorMiddleware } = require("./middleware/errorMiddleware");


process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})

if(process.env.NODE_ENV !== "PRODUCTION")
{
    dotenv.config({path:"backend/config/config.env"});
}

connectDb();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


const app=express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(fileUpload({useTempFiles: true}));
app.use("/api/v1",prodRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);
app.use("/api/v1",paymentRoute)

app.use(express.static(path.join(__dirname,"../frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

app.use(errorMiddleware);

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(`Error is : ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})