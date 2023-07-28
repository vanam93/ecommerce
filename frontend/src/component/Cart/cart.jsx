import React from 'react'
import "./cart.css"
import CartItemCard from "./CartItemCard.jsx"
import {useSelector,useDispatch} from"react-redux"
import { addItemsToCart } from '../../actions/cartActions'
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart"
import Metadata from '../layout/Metadata'


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems} = useSelector(state=>state.cart)
    const navigate = useNavigate();

    const increaseQuantity = (id,quantity,stock)=>{
        const newQty = quantity+1;
        if(stock<=quantity)
        {
            return;
        }
        dispatch(addItemsToCart(id,newQty))
    }

    const decreaseQuantity = (id,quantity)=>{
        const newQty = quantity-1;
        if(quantity<=1)
        {
            return;
        }
        dispatch(addItemsToCart(id,newQty))
    }

    const checkOutBtnHandler = ()=>{
        navigate("/login?redirect=shippingInfo")
    }

  return (
    <>
    <Metadata title="Cart"></Metadata>
        {cartItems.length===0 ? (
            <div className='emptyCart'>
                <RemoveShoppingCartIcon/>
                <Typography>No Products In Cart</Typography>
                <Link to="/products">View Products</Link>
            </div>
        ):(
            <>
            <div className="cartPage">
                <div className="cartHeader">
                    <p>PRODUCT</p>
                    <p>QUANTITY</p>
                    <p>SUBTOTAL</p>
                </div>
               {cartItems && 
                 cartItems.map(item=>(
                    <div className="cartContainer">
                    <CartItemCard item={item}/>
                    <div className="cartInput">
                        <button onClick={()=>{decreaseQuantity(item.product,item.quantity)}}>-</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={()=>{increaseQuantity(item.product,item.quantity,item.stock)}}>+</button>
                    </div>
                    <p className="cartSubtotal">
                        {`Rs.${item.price*item.quantity}`}
                    </p>
                </div>
                ))
               }
                <div className="cartItemsTotal">
                    <div></div>
                    <div className="cartItemsTotalBox">
                        <p>Total</p>
                        <p>{cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)}</p>
                    </div>
                    <div></div>
                    <div className="checkOutBtn">
                        <button onClick={()=>{checkOutBtnHandler()}}>CheckOut</button>
                    </div>
                </div>
            </div>
            </>
        )}
    </>
  )
}

export default Cart