const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { setCookies } = require("../utils/setCookies");
const { sendEmail } = require("../utils/sendEmail");
const cloudinary = require("cloudinary")

exports.registerUser = catchAsyncErrors(async (req,res,next) => {
    let myCloud = {
        public_id:"sample",
        secure_url : "sample"
    }
    if(req.body.avatar !== 'undefined')
    {
        myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "avatars",
            width: 150,
            crop:"scale"
        })
    }
    const {name,email,password} = req.body;
    if(password.length<8)
    {
        return next(new ErrorHandler(400,"Password should be atleast 8 characters long"))
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        name,email,password:hashedPassword,avatar:{
            public_id:myCloud.public_id,
            url : myCloud.secure_url
        }
    })
   setCookies(user,res,201);
})

exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        return next(new ErrorHandler(400,"Please enter Email and Password"));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user)
    {
        return next(new ErrorHandler(401,"Invalid Email or Password"));
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        return next(new ErrorHandler(401,"Invalid Email or Password"));
    }
    setCookies(user,res,200);
})

exports.logout = catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    }).status(200).json({
        success:true,
        message : "logout successful"
    })
})

exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email : req.body.email});
    if(!user)
    {
        return next(new ErrorHandler(401,"Invalid Email or Password"));
    }
    const resetToken = user.generateResetPasswordToken();
    await user.save({validateBeforeSave : false});
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message= `Your password reset link is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it`

    try {
        await sendEmail({
            email : user.email,
            subject : "ECommerce Password Recovery",
            message
        })

        res.status(200).json({
            success:true,
            message : `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(500,error.message));
    }
})

exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt:Date.now()}
    })
    if(!user)
    {
        return next(new ErrorHandler(400,"Reset password token is invalid or has been expired"));
    }
    if(req.body.newPassword.length<8)
    {
        return next(new ErrorHandler(400,"Password should be atleast 8 characters long"))
    }
    if(req.body.newPassword !==req.body.confirmPassword)
    {
        return next(new ErrorHandler(400,"Password does not match"));
    }
    user.password = await bcrypt.hash(req.body.newPassword,10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:false});
    setCookies(user,res,200);
})

exports.getUserDetails = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success : true,
        user
    })
})

exports.changePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordMatch = await bcrypt.compare(req.body.oldPassword,user.password);
    if(!isPasswordMatch){
        return next(new ErrorHandler(401,"Invalid Password"));
    }
    if(req.body.newPassword.length<8)
    {
        return next(new ErrorHandler(400,"Password should be atleast 8 characters long"))
    }
    if(req.body.newPassword !==req.body.confirmPassword)
    {
        return next(new ErrorHandler(400,"Password does not match"));
    }
    user.password = await bcrypt.hash(req.body.newPassword,10);
    await user.save({validateBeforeSave:false});
    setCookies(user,res,200);
})

exports.updateUserProfile = catchAsyncErrors(async (req,res,next)=>{
    const updatedDetails = {
        name : req.body.name,
        email : req.body.email
    }
    if(req.body.avatar!=="")
    {
        const user = await User.findById(req.user._id);
        const publicId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(publicId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "avatars",
            width: 150,
            crop:"scale"
        })

        updatedDetails.avatar = {
            public_id:myCloud.public_id,
            url : myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user._id,updatedDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        message : "user updated successfully"
    })
})

exports.getAllUsers= catchAsyncErrors(async (req,res,next)=>{
    const users=await User.find();
res.status(200).json({
    success:true,
    users
})
})

exports.getSingleUserDetails= catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user)
    {
        return next(new ErrorHandler(404,"User doen't exist"));
    }
res.status(200).json({
    success:true,
    user
})
})

exports.updateSingleUserDetails= catchAsyncErrors(async (req,res,next)=>{
    let user=await User.findById(req.params.id);
    if(!user)
    {
        return next(new ErrorHandler(404,"User doen't exist"));
    }
    const updatedDetails = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }
    user = await User.findByIdAndUpdate(req.params.id,updatedDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
res.status(200).json({
    success:true,
    message : "user updated by admin successfully"
})
})

exports.deleteSingleUser= catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user)
    {
        return next(new ErrorHandler(404,"User doen't exist"));
    }
    const publicId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(publicId);
    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})