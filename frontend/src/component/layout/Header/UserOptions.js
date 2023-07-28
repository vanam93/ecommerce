import React, { useState } from 'react'
import "./header.css"
import {SpeedDial,SpeedDialAction} from "@material-ui/lab"
import {useNavigate} from "react-router-dom"
import {useAlert} from "react-alert"
import {logout} from "../../../actions/userActions"
import {useDispatch,useSelector} from "react-redux"
import Backdrop from "@material-ui/core/Backdrop"



const UserOptions = ({user}) => {
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const {cartItems} = useSelector(state=>state.cart)

    const dashBoard = ()=>{
      navigate("/admin/dashboard")
    }
    const profile = ()=>{
      navigate("/account")
    }
    const orders = ()=>{
      navigate("/orders")
    }
    const cart= ()=>{
      navigate("/Cart")
    }
    const logoutUser = ()=>{
      dispatch(logout());
      alert.success("Logged Out Successfully")
    }
  return (
    <>
    <Backdrop open={open} style={{zIndex:"10"}}/>
    <SpeedDial className='speedDial'
        ariaLabel='PeedDial tooltip example'
        onClose={()=>setOpen(false)}
        onOpen={()=>setOpen(true)}
        open ={open}
        style={{zIndex:"11"}}
        direction = "down"
        icon={<img className='speedDailIcon' src={user.avatar.url?user.avatar.url : "./Profile.png"} alt="ProfileImg"/>}
    >
        {
            user.role === "admin"?(<SpeedDialAction tooltipOpen={window.innerWidth<=600} onClick={dashBoard} icon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>} tooltipTitle="Dashboard"/>):(<></>)
        }
        <SpeedDialAction tooltipOpen={window.innerWidth<=600} onClick={profile} icon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>} tooltipTitle="Profile"></SpeedDialAction>
        <SpeedDialAction tooltipOpen={window.innerWidth<=600} onClick={cart} tooltipTitle={`Cart(${cartItems.length})`} icon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>}></SpeedDialAction>
        <SpeedDialAction tooltipOpen={window.innerWidth<=600} onClick={orders} icon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>} tooltipTitle="Orders"></SpeedDialAction>
        <SpeedDialAction tooltipOpen={window.innerWidth<=600} onClick={logoutUser} icon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>} tooltipTitle="Logout"></SpeedDialAction>
    </SpeedDial>
    </>
  )
}

export default UserOptions