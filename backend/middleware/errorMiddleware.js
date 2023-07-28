const ErrorHandler = require("../utils/errorHandler");

exports.errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
    if(err.name === "CastError")
    {
        err= new ErrorHandler(400,`Resource not found : Invalid : ${err.path}`);
    }//to be specific not compulsory
    if(err.name === "JsonWebTokenError")
    {
        err= new ErrorHandler(400,`JsonWebToken is invalid,please try again`);
    }//to be specific not compulsory
    if(err.name === "TokenExpiredError")
    {
        err= new ErrorHandler(400,`JsonWebToken is expired,please try again`);
    }//to be specific not compulsory
    if(err.code === 11000)
    {
        err=new ErrorHandler(400,`Duplicate ${Object.keys(err.keyValue)}`);
    }//to be specific not compulsory

    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}