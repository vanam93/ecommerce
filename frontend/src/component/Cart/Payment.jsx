import React,{useEffect,useRef,useState} from 'react'
import "./Payment.css"
import axios from "axios"
import CheckoutSteps from './CheckoutSteps'
import { useDispatch,useSelector } from 'react-redux'
import Metadata from "../layout/Metadata"
import { Typography } from '@material-ui/core'
import { useAlert } from 'react-alert'
import {CardNumberElement,CardExpiryElement,useStripe,useElements,CardCvcElement} from "@stripe/react-stripe-js"
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey"
import { useNavigate } from 'react-router-dom'
import {clearErrors, createOrder} from "../../actions/orderActions"

const Payment = () => {
    const alert=useAlert()
    const dispatch = useDispatch();
    // const stripe = useStripe();
    // const elements = useElements();
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const paymentData = {
        amount : Math.round(orderInfo.totalPrice*100)
    }

    const {cartItems,shippingInfo} = useSelector(state=>state.cart)
    const {user} = useSelector(state=>state.user)
    const {error} = useSelector(state=>state.newOrder)

    useEffect(()=>{
        if(error)
      {
        alert.error(error)
        dispatch(clearErrors())
      }
    },[error,dispatch,alert])
    const paymentInfo = {
        id:"dummy",
        status:"succeeded"
    }
    const order = {
        shippingInfo,
        orderItems:cartItems,
        itemsPrice : orderInfo.subTotal,
        taxPrice : orderInfo.gst,
        shippingPrice : orderInfo.shippingCharges,
        totalPrice : orderInfo.total,
        paymentInfo
    }


    const paymentSubmitHandler=async (e)=>{
        // e.preventDefault();
        // payBtn.current.disabled = true;
        // try {
           
        //     const config = {
        //         headers:{
        //         "Content-type":"application/json"
        //         }
        //     }
        //     const {data} = await axios.post("/api/v1/process/payment",paymentData,config);
        //     const client_secret = data.client_secret;

        //     if(!stripe || !elements)
        //     {
        //         return
        //     }

        //     const result = await stripe.confirmCardPayment(client_secret,{
        //         payment_method:{
        //             card:elements.getElement(CardNumberElement),
        //             billing_details:{
        //                 name : user.name,
        //                 email:user.email,
        //                 address:{
        //                     line1:shippingInfo.address,
        //                     city:shippingInfo.city,
        //                     state:shippingInfo.state,
        //                     country:shippingInfo.country,
        //                     postal_code:shippingInfo.pinCode
        //                 }
        //             }
        //         }
        //     })
        //     if(result.error)
        //     {
        //         payBtn.current.disabled = false;
        //         alert.error(result.error.message);
        //     }else{
        //         if(result.paymentIntent.status === "succeeded")
        //         {
        //             navigate("/success")
        //         }
        //         else{
        //             alert.error("There has been some issue in the payment")
        //         }
        //     }
        // } catch (error) {
        //     console.log(error.response.data.message)
        //     payBtn.current.disabled = false;
        //     alert.error(error.response.data.message);
        // }
        dispatch(createOrder(order))
        navigate("/success")
    }

    const payBtn = useRef(null)

  return (
        <>
        <Metadata title="Payment"/>
    <CheckoutSteps activeStep={2}/>
    <div className="paymentContainer">
        <form onSubmit={(e)=>paymentSubmitHandler(e)} className="paymentForm">
            {/* <Typography>Card Info</Typography>
            <div>
                <CreditCardIcon/>
                <CardNumberElement className="paymentInput"/>
            </div>
            <div>
                <EventIcon/>
                <CardExpiryElement className="paymentInput"/>
            </div>
            <div>
                <VpnKeyIcon/>
                <CardCvcElement className="paymentInput"/>
            </div> */}

            <input type="submit" ref={payBtn} value={`Pay - Rs.${orderInfo && orderInfo.total}`} className="paymentFornBtn"/>

        </form>
    </div>
        </>
  )
}

export default Payment