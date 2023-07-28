import React,{useEffect} from 'react'
import Sidebar from "./Sidebar.jsx"
import "./adminDashBoard.css"
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import {Doughnut,Line} from "react-chartjs-2"
import Chart from 'chart.js/auto';
import { useAlert } from 'react-alert'
import { useDispatch,useSelector } from 'react-redux'
import { getAdminProducts,clearErrors } from '../../actions/productAction'
import { allOrders } from '../../actions/orderActions.js'
import {allUsers} from "../../actions/userActions.js"


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  let outOfStock=0;

  const {error,products} = useSelector(state=>state.products)
  const {orders} = useSelector(state=>state.allOrders)
  const {users} = useSelector(state => state.allUsers)

  products && products.forEach((item)=>{
    if(item.stock === 0)
    {
      outOfStock+=1;
    }
  })

  let totalAmount = 0;
  orders && orders.forEach((order)=>{
    totalAmount+=order.totalPrice;
  })


  const lineState={
    labels : ["Initial Amount" , "Amount Earned"],
    datasets :[
      {
        label : "Total Amount",
      backgroundColor : ["tomato"],
      hoverBackgroundColor : ["rgb(197,72,49)"],
      data:[0,totalAmount]
      }
    ]
  }
  const doughnutState={
    labels : ["Out of Stock","In Stock"],
  datasets :[
    {
    backgroundColor : ["red","green"],
    hoverBackgroundColor : [],
    data:[outOfStock,products.length-outOfStock]
    }
  ]
}

useEffect(() => {
  if(error)
  {
    alert.error(error);
    dispatch(clearErrors());
  }
  dispatch(getAdminProducts());
  dispatch(allOrders());
  dispatch(allUsers())
}, [alert,error,dispatch])



  return (
    <div className="dashBoard">
      <Sidebar/>
        <div className="dashBoardContainer">
          <Typography component="h1">DashBord</Typography>
          <div className="dashBoardSummary">
            <div>
            <p>Total Amount <br /> Rs.{totalAmount}</p>
            </div>
            <div className="dashBoardSummaryBox2">
              <Link to="/admin/products"><p>Products</p><p>{products && products.length}</p></Link>
              <Link to="/admin/orders"><p>Orders</p><p>{orders && orders.length}</p></Link>
              <Link to="/admin/users"><p>Users</p><p>{users && users.length}</p></Link>
            </div>
            <div className="lineChart">
              <Line data={lineState}/>
            </div>
            <div className="doughnutChart">
              <Doughnut data={doughnutState}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard