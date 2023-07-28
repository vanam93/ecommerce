import axios from "axios"

import { CREATE_ORDER_FAIL,CREATE_ORDER_REQUEST,CREATE_ORDER_SUCCESS,CLEAR_ERRORS,MY_ORDERS_FAIL,MY_ORDERS_REQUEST,MY_ORDERS_SUCCESS,ORDER_DETAILS_FAIL,ORDER_DETAILS_REQUEST,ORDER_DETAILS_SUCCESS,ALL_ORDER_REQUEST,ALL_ORDER_SUCCESS,ALL_ORDER_FAIL,UPDATE_ORDER_FAIL,UPDATE_ORDER_REQUEST,UPDATE_ORDER_SUCCESS, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELETE_ORDER_FAIL} from "../constants/orderConstants"

export const createOrder = (order) => async(dispatch)=>{
    try {
        dispatch({type : CREATE_ORDER_REQUEST});

        const config = {headers:{"Content-Type":"application/json"}}

        const {data}= await axios.post("/api/v1/order/new",order,config)

        dispatch({
            type : CREATE_ORDER_SUCCESS,
            payload : data
        })
    } catch (error) {
        dispatch({
            type : CREATE_ORDER_FAIL,
            payload : error.response.data.message
        })
    }
}

export const clearErrors = ()=> async(dispatch)=>{
    dispatch({
        type : CLEAR_ERRORS
    })
}

export const myOrders = () => async (dispatch)=>{
    try {
        dispatch({type : MY_ORDERS_REQUEST});

        const {data}= await axios.get("/api/v1/orders/me")

        dispatch({
            type : MY_ORDERS_SUCCESS,
            payload : data.orders
        })
    } catch (error) {
        dispatch({
            type : MY_ORDERS_FAIL,
            payload : error.response.data.message
        })
    }
}

export const orderDetails = (id) => async (dispatch)=>{
    try {
        dispatch({type : ORDER_DETAILS_REQUEST});
        console.log(id)
        const {data}= await axios.get(`/api/v1/order/${id}`)

        dispatch({
            type : ORDER_DETAILS_SUCCESS,
            payload : data.order
        })
    } catch (error) {
        dispatch({
            type : ORDER_DETAILS_FAIL,
            payload : error.response.data.message
        })
    }
}

export const allOrders = () => async (dispatch)=>{
    try {
        dispatch({type : ALL_ORDER_REQUEST});

        const {data}= await axios.get("/api/v1/admin/orders/all")

        dispatch({
            type : ALL_ORDER_SUCCESS,
            payload : data.orders
        })
    } catch (error) {
        dispatch({
            type : ALL_ORDER_FAIL,
            payload : error.response.data.message
        })
    }
}

export const updateOrder = (id,order) => async(dispatch)=>{
    try {
        dispatch({type : UPDATE_ORDER_REQUEST});

        const config = {headers:{"Content-Type":"application/json"}}

        const {data}= await axios.put(`/api/v1/order/${id}`,order,config)

        dispatch({
            type : UPDATE_ORDER_SUCCESS,
            payload : data.success
        })
    } catch (error) {
        dispatch({
            type : UPDATE_ORDER_FAIL,
            payload : error.response.data.message
        })
    }
}

export const deleteOrder = (id) => async(dispatch)=>{
    try {
        dispatch({type : DELETE_ORDER_REQUEST});

        const {data}= await axios.delete(`/api/v1/admin/order/${id}`)

        dispatch({
            type : DELETE_ORDER_SUCCESS,
            payload : data
        })
    } catch (error) {
        dispatch({
            type : DELETE_ORDER_FAIL,
            payload : error.response.data.message
        })
    }
}