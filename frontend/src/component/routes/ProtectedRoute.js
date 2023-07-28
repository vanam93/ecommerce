import React from 'react'
import {useSelector} from "react-redux"
import {useNavigate ,Outlet} from "react-router-dom"
import Loader from '../layout/loader/Loader'

const ProtectedRoute = ({isAdmin}) => {
    const {loading,isAuthenticated,user} = useSelector((state)=>state.user)
    const navigate = useNavigate();
    if(loading)
    {
        return <Loader/>
    }
    if(!isAuthenticated)
    {
        return navigate("/login")
    }
    if(isAdmin === true && user.role!=="admin"){
        return navigate("/login")
    }
    else{
        return <Outlet/>
    }
}

export default ProtectedRoute