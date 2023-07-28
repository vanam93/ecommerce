import React,{ useEffect, useState } from 'react'
import {useDispatch,useSelector} from "react-redux"
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import Carousel from "react-material-ui-carousel"
import "./productDetails.css"
import ReactStars from "react-rating-stars-component"
import ReviewCard from "./ReviewCard.jsx"
import Loader from "../layout/loader/Loader"
import {useAlert} from "react-alert"
import Metadata from '../layout/Metadata';
import { addItemsToCart } from '../../actions/cartActions';
import {Button, Dialog,DialogActions,DialogContent,DialogTitle} from "@material-ui/core"
import {Rating} from "@material-ui/lab"
import { NEW_REVIEW_RESET } from '../../constants/productConstants';

const ProductDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const {loading,error,product} = useSelector(state => state.productDetails)
    const options = {
      edit : false,
      color : "rgba(20,20,20,0.1)",
      activeColor : "tomato",
      value : product.rating,
      isHalf : true,
      size:window.innerWidth<600?20:25
  }

  const [quantity,setQuantity] = useState(1);
  const [open,setOpen] = useState(false);
  const [rating,setRating] = useState(0);
  const [comment,setComment]= useState("");

  const submitReviewToggle = ()=>{
    open ? setOpen(false) : setOpen(true)
  }

  const reviewSubmitHandler = ()=>{
    const myForm = new FormData();

    myForm.set("rating",rating);
    myForm.set("comment",comment);
    myForm.set("productId",params.id);
    dispatch(newReview(myForm))
    setOpen(false)
  }

  const {success,error:reviewError} = useSelector(state=>state.newReview)


  const increaseQuantity = (e)=>{
    if(product.stock<=quantity)
    {
      return 
    }
    const qty = quantity+1;
    setQuantity(qty)
  }
  const decreaseQuantity = (e)=>{
    if(quantity<=1)
    {
      return;
    }
    const qty = quantity-1;
    setQuantity(qty)
  }

  const addToCartHandler = ()=>{
    if(product.stock<quantity)
    {
      alert.error("INSUFFICIENT STOCK");
      return;
    }
    dispatch(addItemsToCart(params.id,quantity));
    alert.success("Item added to cart")
  }

    useEffect(() => {
      if(error)
      {
        alert.error(error);
        dispatch(clearErrors())
      }
      if(reviewError)
      {
        alert.error(reviewError);
        dispatch(clearErrors())
      }
      if(success)
      {
        alert.success("Review Submitted Successfully!")
        dispatch({type : NEW_REVIEW_RESET})
      }
      dispatch(getProductDetails(params.id))
    }, [dispatch,params.id,error,alert,reviewError,success])


    const carouselOptions = {
      autoPlay : false,
      navButtonsAlwaysInvisible : true
    }
  return (
   <>
   {loading?<Loader/> : (
     <>
     <Metadata title={`${product.name}--ECOMMERCE`}/>
     <div className="ProductDetails">
       <div>
         <Carousel {...carouselOptions}>
           {product.images && product.images.map((item,i)=>(
             <img src={item.url} alt={`${i+1}slide`} key={item.url} className="carouselImage" />
           ))}
         </Carousel>
       </div>
       <div>
         <div className="detailsBlock1">
           <h2>{product.name}</h2>
           <p>Product #{product._id}</p>
         </div>
         <div className="displayBlock2">
           <ReactStars {...options}/>
           <span>{`(${product.numOfReviews} reviews)`}</span>
         </div>
         <div className="displayBlock-3">
           <h1>{`Rs.${product.price}`}</h1>
           <div className="displayBlock3-1">
             <div className="displayBlock3-1-1">
               <button onClick={decreaseQuantity}>-</button>
               <input readOnly type="number" value={quantity}/>
               <button onClick={increaseQuantity}>+</button>
             </div>{" "}
             <button onClick={addToCartHandler}>Add To Cart</button>
           </div>
           <p>
             Status : 
             <b className={product.stock<1?"redColor" : "greenColor"}>
               {product.stock<1?"Out of Stock":"In Stock"}
             </b>
           </p>
         </div>
         <div className="displayBlock4">
           <p>Description : {product.description}</p>
         </div>
         <button className="submitReview" onClick={submitReviewToggle}>Submit Review</button>
       </div>
     </div>
     <h3 className='reviewsHeading'>Reviews</h3>
     <Dialog aria-labelledby='simple-dialog-title' open={open} onClose={submitReviewToggle}>
      <DialogTitle>Submit Review</DialogTitle>
      <DialogContent className="submitDialog">
        <Rating onChange={(e)=>setRating(e.target.value)} value={rating} size="large" precision={0.5}/>
        <textarea className="submitDialogTextArea" cols="30" rows="5" value={comment} onChange={(e)=>{setComment(e.target.value)}}></textarea>
        <DialogActions>
          <Button color='secondary' onClick={submitReviewToggle}>Cancel</Button>
          <Button color="primary" onClick={reviewSubmitHandler}>Submit</Button>
        </DialogActions>
      </DialogContent>

     </Dialog>
     {
       (product.reviews && product.reviews[0])?(
         <div className="reviews">
           {product.reviews && product.reviews.map((r,i)=>(
             <ReviewCard review={r}/>
           ))}
         </div>
       ):(
         <p className='noReviews'>No reviews yet</p>
       )  
     }
     </>
   )}
   </>
  )
}

export default ProductDetails