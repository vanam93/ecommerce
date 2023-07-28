const jwt = require("jsonwebtoken");

exports.setCookies = (user,res,statusCode)=>{
    const token =jwt.sign({id : user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    });
    res.status(statusCode).cookie("token",token,{
        httpOnly : true,
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES*24*60*60*1000)
    }).json({
        success:true,
        user,
        token
    })
}