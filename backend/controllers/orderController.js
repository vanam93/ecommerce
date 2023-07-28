const Order = require("../models/ordereModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder= catchAsyncErrors(async (req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,shippingPrice,taxPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,shippingPrice,taxPrice,totalPrice,paidAt:Date.now(),user:req.user._id
    })

    res.status(201).json({
        success:true,
        order
    })
})

exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{
    const order =await Order.findById(req.params.id).populate("user","name   email");
    if(!order)
    {
        return next(new ErrorHandler(404,"OrderNot Found"))
    }
    res.status(200).json({
        success:true,
        order
    })
})

exports.getmyOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user : req.user._id})
    res.status(200).json({
        success:true,
        orders
    })
})

exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{
    let totalAmount =0;
    const orders = await Order.find();
    orders.forEach(order => {
        totalAmount+=order.totalPrice;
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler(404,"OrderNot Found"))
    }
    if(order.orderStatus === "Delivered")
    {
        return next(new ErrorHandler(400,"Order is already delivered"))
    }
    if(req.body.status === "shipped"){
        order.orderItems.forEach(async o=>{
            await updateStock(o.product,o.quantity);
        })
    }
    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        message : "order updated successfully"
    })
})

async function updateStock(id,q){
    const product = await Product.findById(id);
    product.stock-=q;
    await product.save({validateBeforeSave:false});
}

exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler(404,"OrderNot Found"))
    }
    await order.deleteOne();
    res.status(200).json({
        success:true,
        message : "order deleted successfully"
    })
})