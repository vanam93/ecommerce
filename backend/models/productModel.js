const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please enter name"],
        trim : true
    },
    description : {
        type : String,
        required : [true,"Please enter description"]
    },
    price: {
        type : Number,
        required : [true,"Please enter price"],
        maxLength : [8,"Price can't excees 8 charaters"]
    },
    rating : {
        type : Number,
        default:0
    },
    images : [
        {
            public_id : {
                type: String,
                required : true
            },
            url : {
                type: String,
                required : true
            }
        }
    ],
    category : {
        type : String,
        required : [true,"Please enter category"]
    },
    stock : {
        type : Number,
        required : [true,"Please enter stock"],
        maxLength : [4,"Stock can't excees 4 charaters"],
        default : 1
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user:{
                type : mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name :{
                type : String,
                required : true
            },
            rating :{
                type : Number,
                required : true
            },
            comment :{
                type : String,
                required : true
            }
        }
    ],
    user:{
        type : mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);