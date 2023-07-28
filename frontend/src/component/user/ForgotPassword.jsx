import React, {  useState,useEffect } from 'react'
import "./ForgotPassword.css"
import Loader from '../layout/loader/Loader'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import {useDispatch} from "react-redux"
import {clearErrors,forgotPassword} from "../../actions/userActions"
import { useSelector } from 'react-redux'
import {useAlert} from "react-alert"
import Metadata from '../layout/Metadata';


const ForgotPassword = () => {
    const dispatch = useDispatch();
    const alert= useAlert();
  
    const {error,message,loading} = useSelector(state => state.forgotPassword)

    const forgotPasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email",email);
        dispatch(forgotPassword(myForm))
    }

    const [email,setEmail] = useState("");

    useEffect(() => {
          if(message)
          {
            alert.success(message)
          }
          if(error)
          {
              if(error !== "Login to access this resource")
              {
                  alert.error(error);
              }
              dispatch(clearErrors())
          }
      }, [dispatch,error,alert,message])
  return (
    <>
    {loading ? (<Loader/>):(<>
        <Metadata title="Forgot Password?"/>
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                  <h2 className='forgotPasswordHeading'>Forgot Password?</h2>
                    <form className="forgotPasswordForm" onSubmit = {forgotPasswordSubmit}>
                        <div className="forgotPasswordEmail">
                        <MailOutlineIcon/>
                        <input type="email" placeholder='Email' required name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                        </div>
                        <input type="submit" value="Send Password Reset Link" className='forgotPasswordBtn'/> 
                         {/* disabled={loading?true : false} */}
                    </form>
                </div>
            </div>
            </>)}
    </>
  )
}

export default ForgotPassword