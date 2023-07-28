import React,{useEffect} from 'react'
import {DataGrid} from "@material-ui/data-grid"
import "./productList.css"
import { useDispatch,useSelector } from 'react-redux'
import { Link,  useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata'
import Sidebar from './Sidebar'
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import { Button } from '@material-ui/core'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'
import { allOrders, deleteOrder,clearErrors } from '../../actions/orderActions'

const OrderList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error,orders} = useSelector(state=>state.allOrders)
    const {error : deleteError,isDeleted} = useSelector(state=>state.order)

    const deleteOrderHandler = (id)=>{
        dispatch(deleteOrder(id))
    }

    const columns = [{field : "id",headerName : "Order_id",minWidth : 200,flex : 0.6},
    {field : "status",headerName : "Order Status",minWidth : 150,flex : 0.3,cellClassName : (params)=>{
        return (params.getValue(params.id,"status")==="Delivered"?"greenColor":"redColor")
    }},
    {field:"itemsQty",headerName : "Items Qty",type : "number",minWidth : 150,flex : 0.3},
    {field : "amount",headerName : "Amount",type : "number",minWidth : 270,flex : 0.5},{
        field : "actions" , headerName : "Actions",type : "number",minWidth : 150,flex:0.3,sortable : false,
        renderCell:(params)=>{return (
            <>
            {/* <Link to={`/admin/order/${params.getValue(params.id,"id")}`}>
                <EditIcon/>
            </Link> */}
            <Button onClick={()=>{deleteOrderHandler(params.getValue(params.id,"id"))}}>
                <DeleteIcon/>
            </Button>
            </>
        )}
    }]
    const rows= [];
    orders && orders.forEach((item)=>{
        rows.push({
            id:item._id,
            itemsQty : item.orderItems.length,
            amount : item.totalPrice,
            status : item.orderStatus
        })
    })
    useEffect(() => {
      if(error)
      {
        alert.error(error);
        dispatch(clearErrors());
      }
      if(deleteError)
      {
        alert.error(deleteError);
        dispatch(clearErrors());
      }
      if(isDeleted)
      {
        alert.success("Order Deleted Successfully")
        navigate("/admin/orders");
        dispatch({type : DELETE_ORDER_RESET})
      }
      dispatch(allOrders())
    }, [alert,error,dispatch,deleteError,isDeleted])
    
   

    return (
    <>
    <Metadata title ={"All Orders-Admin"}/>
    <div className="dashBoard">
        <Sidebar/>
        <div className="productsListContainer">
            <h1 id="productListHeading">All Orders</h1>
            <DataGrid
            rows={rows}
            columns={columns}
            pageSize={50}
            disableSelectionOnClick
            className="productsListTable"
            autoHeight
            />
        </div>
    </div>
    </>
  )
}

export default OrderList