import React,{useEffect, useState} from 'react'
import "./newProduct.css"
import { useDispatch,useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { Button } from '@material-ui/core'
import Metadata from '../layout/Metadata'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import PersonIcon from "@material-ui/icons/Person"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { UPDATE_USER_RESET } from '../../constants/userConstants'
import { getUserDetails, updateUserByAdmin,clearErrors } from '../../actions/userActions'

const UpdateUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();

    const {loading , error ,user} = useSelector(state=>state.userDetails);
    const {loading:updateLoading,error:updateError,isUpdated} = useSelector(state=>state.profile)

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [role,setRole] = useState("");

    const id=params.id;

    useEffect(()=>{
      if(user && user._id !==id)
        {
            dispatch(getUserDetails(id));
        }
        else{
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors())
        }
        if(updateError)
        {
            alert.error(updateError);
            dispatch(clearErrors())
        }
        if(isUpdated)
        {
            alert.success("User Updated Successfully")
            navigate("/admin/users")
            dispatch({type:UPDATE_USER_RESET})
        }
    },[dispatch,alert,error,updateError,navigate,id,user,params,isUpdated])

    const createProductSubmitHandler = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("role",role);
        dispatch(updateUserByAdmin(id,myForm));
    }

  return (
   <>
   <Metadata title="Update User"/>
   <div className="dashBoard">
    <Sidebar/>
    <div className="newProductContainer">
        <form className="createProductForm" onSubmit={(e)=>{createProductSubmitHandler(e)}}>
            <h1>Update User</h1>
            <div>
                <PersonIcon/>
                <input type="text" placeholder="User Name" required value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
                <MailOutlineIcon/>
                <input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>
                <VerifiedUserIcon/>
                <select value={role} onChange={(e)=>setRole(e.target.value)}>
                    <option value="">Choose Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
            <Button id="createProductBtn" type="submit" disabled={updateLoading ? true : false || role===""?true:false}>
                Update
            </Button>
        </form>
    </div>
   </div>
   </>
  )
}

export default UpdateUser