import React from 'react'
import "./cartItemCard.css"
import { Link } from 'react-router-dom'
import { removeItemsFromCart } from '../../actions/cartActions'
import {useAlert} from "react-alert"
import {useDispatch} from "react-redux"

const CartItemCard = ({item}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  
  const removeBtnHandler =(id)=>{
    dispatch(removeItemsFromCart(id));
    alert.success("ITEM REMOVED FROM CART")
  }
  return (
    <div className="cartItemCard">
        <img src={item.image} alt={item.name} />
        <div>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <span>{`Price : Rs.${item.price}`}</span>
            <p onClick={()=>{removeBtnHandler(item.product)}}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCard