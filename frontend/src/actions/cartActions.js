import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import axios from "axios"

export const addItemsToCart = (id,quantity)=>async (dispatch,getState)=>{
    const {data} = await axios.get(`/api/v1/product/${id}`);
    dispatch({
        type:ADD_TO_CART,
        payload:{
            product:data.product._id,
            quantity,
            name:data.product.name,
            image:data.product.images[0].url,
            price:data.product.price,
            stock:data.product.stock
        }
    })
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

export const removeItemsFromCart = (id)=>  (dispatch,getState)=>{
    dispatch({
        type:REMOVE_CART_ITEM,
        payload : id
    })
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo=(data)=> async (dispatch)=>{
    dispatch({
        type:SAVE_SHIPPING_INFO,
        payload:data
    })
    localStorage.setItem("shippingInfo",JSON.stringify(data));
}