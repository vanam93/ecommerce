const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated =catchAsyncErrors(async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token)
    {
        return next(new ErrorHandler(401,"Login to access this resource"));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
})

exports.authorizedRoles = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler(403,`Role : ${req.user.role} is not allowed to access this resource`))
        }
        next();
    }
}