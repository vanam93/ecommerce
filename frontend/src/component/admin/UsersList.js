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
import { allUsers,clearErrors, deleteUserByAdmin } from '../../actions/userActions'
import { DELETE_USER_RESET } from '../../constants/userConstants'
import Loader from '../layout/loader/Loader'

const UserList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error,users,loading} = useSelector(state=>state.allUsers)
    const {error : deleteError,isDeleted,message} = useSelector(state=>state.profile)

    const deleteBtnHandler = (id)=>{
        dispatch(deleteUserByAdmin(id));
    }

    const columns = [{
        field : "id" , headerName : "User Id",minWidth : 200,flex:1
    },{
        field : "email" , headerName : "Email",minWidth : 250,flex:0
    },{
        field : "name",headerName : "Name" ,minWidth:150,flex:0.3
    },{
        field : "role" , headerName : "Role",type : "number",minWidth : 270,flex:0.5,cellClassName : (params)=>{
          return (params.getValue(params.id,"role")==="admin"?"greenColor":"redColor")
      }
    },{
        field : "actions" , headerName : "Actions",type : "number",minWidth : 150,flex:0.3,sortable : false,
        renderCell:(params)=>{return (
            <>
            <Link to={`/admin/user/${params.getValue(params.id,"id")}`}>
                <EditIcon/>
            </Link>
            <Button onClick={()=>{deleteBtnHandler(params.getValue(params.id,"id"))}}>
                <DeleteIcon/>
            </Button>
            </>
        )}
    }]
    const rows= [];
    users && users.forEach((item)=>{
        rows.push({
            id:item._id,
            role : item.role,
            email : item.email,
            name : item.name
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
        alert.success(message)
        navigate("/admin/users");
        dispatch({type : DELETE_USER_RESET})
      }
      dispatch(allUsers());
    }, [alert,error,dispatch,navigate,isDeleted,deleteError,message])
    
   

    return (
    <>
    {loading ? <Loader/> : (
      <>
      <Metadata title ={"All Users-Admin"}/>
    <div className="dashBoard">
        <Sidebar/>
        <div className="productsListContainer">
            <h1 id="productListHeading">All Users</h1>
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
    )}
    </>
  )
}

export default UserList