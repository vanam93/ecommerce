import React from 'react'
import Metadata from '../layout/Metadata'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import "./ConfirmOrder.css"
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core'


const ConfirmOrder = () => {

  const {shippingInfo,cartItems} = useSelector(state=>state.cart)
  const {user} = useSelector(state=>state.user)
  const navigate=useNavigate()

  const subTotal = cartItems.reduce((acc,i)=>acc+i.quantity*i.price,0);
  const shippingCharges = subTotal>1000 ? 0:200;
  const gst = subTotal*0.18;
  const total = subTotal+gst+shippingCharges;

  const address = `${shippingInfo.address},${shippingInfo.state},${shippingInfo.country},${shippingInfo.pinCode}`


  const proeedToPayment=()=>{
    const data={subTotal,shippingCharges,total,gst}
    sessionStorage.setItem("orderInfo",JSON.stringify(data));
    navigate("/process/payment")
  }
  return (
   <>
    <Metadata title="Confirm Order"/>
    <CheckoutSteps activeStep={1}/>
    <div className="confirmOrderPage">
      <div>
        <div className="confirmShippingArea">
          <Typography>Shipping Info:</Typography>
          <div className="confirmShippingAreaBox">
          <div>
            <p>Name:</p>
            <span>{user.name}</span>
          </div>
          <div>
            <p>PhoneNo:</p>
            <span>{shippingInfo.phnNo}</span>
          </div>
          <div>
            <p>Address:</p>
            <span>{address}</span>
          </div> 
          </div>
        </div>
        <div className="confirmCartItems">
          <Typography>Your Cart Items Are:</Typography>
          <div className="confirmCartItemsContainer">
            {cartItems && cartItems.map(i=>(
              <div key={i.product}>
                <img src={i.image} alt="Product" />
                <Link to={`/product/${i.product}`}>{i.name}</Link>
                <span>{i.quantity}  x {i.price} = <b>Rs.{i.quantity*i.price}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*  */}
      <div>
        <div className="orderSummary">
          <Typography>Order Summary</Typography>
          <div>
          <div>
            <div>Subtotal:</div>
            <span>Rs.{subTotal}</span>
          </div>
          <div>
            <div>Shipping Charges:</div>
            <span>Rs.{shippingCharges}</span>
          </div>
          <div>
            <div>GST:</div>
            <span>Rs.{gst}</span>
          </div>
          </div>
          <div className="orderTotal">
          <div>
            <div><b>Total:</b></div>
            <span>Rs.{total}</span>
          </div>
          </div>
          <button onClick = {()=>{proeedToPayment()}}>Proceed To Payment</button>
        </div>
      </div>
    </div>
   </>
  )
}

export default ConfirmOrder