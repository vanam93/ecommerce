import React,{useEffect} from 'react'
import {DataGrid} from "@material-ui/data-grid"
import "./myOrders.css"
import { UseSelector,useDispatch, useSelector } from 'react-redux'
import { myOrders,clearErrors } from '../../actions/orderActions'
import Loader from '../layout/loader/Loader'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata'
import LaunchIcon from "@material-ui/icons/Launch"
import { Typography } from '@material-ui/core'

const MyOrders = () => {
    const dispatch = useDispatch();
        const alert = useAlert();
        const {loading,error,orders} = useSelector(state=>state.myOrders)
        const {user} = useSelector(state=>state.user)

        const rows = [];
        const columns = [{field : "id",headerName : "Order_id",minWidth : 200,flex : 0.6},
        {field : "status",headerName : "Order Status",minWidth : 150,flex : 0.3,cellClassName : (params)=>{
            return (params.getValue(params.id,"status")==="Delivered"?"greenColor":"redColor")
        }},
        {field:"itemsQty",headerName : "Items Qty",type : "number",minWidth : 150,flex : 0.3},
        {field : "amount",headerName : "Amount",type : "number",minWidth : 270,flex : 0.5},
    {field : "actions",headerName : "Actions",type :"number",flex : 0.3,minWidth : 150,sortable :false,
renderCell :(params)=>{
    return (
        <Link to={`/order/${params.getValue(params.id,"id")}`}><LaunchIcon/></Link>
    )
}}]

        orders && orders.forEach((item,index)=>{
            rows.push({
                itemsQty : item.orderItems.length,
                id : item._id,
                status : item.orderStatus,
                amount : item.totalPrice
            })
        })



        useEffect(()=>{
            if(error)
            {
                alert.error(error);
                dispatch(clearErrors())
            }
            dispatch(myOrders())
        },[dispatch,alert,error])
  return (
    <>
    <Metadata title={`${user.name}'s Orders`}/>
    {loading?(<Loader/>):(
        <div className="myOrdersPage">
            <DataGrid
            rows = {rows}
            columns = {columns}
            pageSize = {10}
            disableSelectionOnClick
            className='myOrdersTable'
            autoHeight
            />
            <Typography id="myOdersHeading">{`${user.name}'s Orders`}</Typography>
        </div>
    )}
    </>
  )
}

export default MyOrders