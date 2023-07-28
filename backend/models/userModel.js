const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please enter name"],
        maxLength : [30,"UserName can't exceed 30 characters"],
        minLength : [5,"UserName should be atleast 5 characters long"]
    },
    email : {
        type : String,
        required : [true,"Please enter Email"],
        unique : true,
        validate : [validator.isEmail,"Please enter valid Email"]
    },
    password : {
        type : String,
        required : [true,"Please enter Password"],
        select : false,
        minLength : [8,"Password should be atleast 8 characters long"]
    },
    avatar : {
        public_id : {
            type: String,
            required : true
        },
        url : {
            type: String,
            required : true
        }
    },
    role : {
        type : String,
        default : "User"
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
})

userSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model("User",userSchema);