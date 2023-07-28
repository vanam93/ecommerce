const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.createNewProduct = catchAsyncErrors(async (req,res,next)=>{
    let images = [];
    if(typeof req.body.images === "string")
    {
        images.push(req.body.images)
    }
    else{
        images = req.body.images
    }

    const imagesLink = [];

    for(let i=0;i<images.length;i++)
    {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder : "products"
        })

        imagesLink.push({
            public_id : result.public_id,
            url : result.secure_url
        })
    }
    req.body.images = imagesLink;
    req.body.user=req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});

exports.getAllProducts = catchAsyncErrors(async (req,res,next)=>{
    const resultPerPage= 4;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter();

    let products = await apiFeatures.query;
    const filteredProductsLength = products.length;
    apiFeatures.pagination(resultPerPage);
    products = await apiFeatures.query.clone();
    res.status(200).json({
        success : true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsLength
    })
});

exports.getAllProductsAdmin = catchAsyncErrors(async (req,res,next)=>{
    const products =await Product.find()
    res.status(200).json({
        success : true,
        products,
    })
});

exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }
    res.status(200).json({
        success : true,
        product
    })
});

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }

    let images = [];
    if(typeof req.body.images === "string")
    {
        images.push(req.body.images)
    }
    else{
        images = req.body.images
    }

    if(images !== undefined)
    {
        for(let i=0;i<product.images.length;i++)
    {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    const imagesLink = [];

    for(let i=0;i<images.length;i++)
    {
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder : "products"
        })

        imagesLink.push({
            public_id : result.public_id,
            url : result.secure_url
        })
    }
    req.body.images = imagesLink;
    }


    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({
        success : true,
        product
    })
});

exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }

    for(let i=0;i<product.images.length;i++)
    {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    
    await product.deleteOne();
    res.status(200).json({
        success : true,
        message : "product deleted"
    })
});

exports.productReview = catchAsyncErrors(async (req,res,next)=>{
    const {rating,comment,productId} = req.body;

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }
    const product= await Product.findById(productId);

    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }

    const isReviewed = product.reviews.find(rev => rev.user.toString()===req.user._id.toString());

    if(isReviewed)
    {
        product.reviews.forEach(rev => {
            if(rev.user.toString()===req.user._id.toString())
            {
                rev.rating = rating,
                rev.comment = comment
            }
        })
    }
    else
    {
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let avg=0;
    product.reviews.forEach(rev => {
        avg=avg+rev.rating
    })
    product.rating = avg/product.numOfReviews;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        message :"review added successfully"
    })
})

exports.getAllReviews = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.query.prodId);
    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

exports.deleteReview = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.query.prodId);
    if(!product)
    {
        return next(new ErrorHandler(404,"Product Not Found"));
    }
    const reviews = product.reviews.filter(rev  => rev._id.toString()!=req.query.id.toString());
    const numOfReviews = reviews.length;
    let avg=0;
    reviews.forEach(rev => {
        avg=avg+rev.rating
    })
    const rating = avg/numOfReviews;
    await Product.findByIdAndUpdate(req.query.prodId,{
        reviews,rating,numOfReviews
    },{
        new : true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        message:"deleted review successfully"
    })
})