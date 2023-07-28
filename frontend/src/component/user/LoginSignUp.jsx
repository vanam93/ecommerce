import React, { useRef,useState,useEffect } from 'react'
import "./LoginSignUp.css"
import Loader from '../layout/loader/Loader'
import { Link, useLocation } from 'react-router-dom'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face"
import {useDispatch} from "react-redux"
import {login,clearErrors,register} from "../../actions/userActions"
import { useSelector } from 'react-redux'
import {useAlert} from "react-alert"
import {useNavigate} from 'react-router-dom';
import Metadata from '../layout/Metadata';

const LoginSignUp = () => {
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switchTab = useRef(null);
    const dispatch = useDispatch();
    const alert= useAlert();
    const navigate = useNavigate();
    const location = useLocation()

    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");
    const [user,setUser] = useState({
        name : "",
        email:"",
        password:""
    })
    const {name,email,password} = user;
    const [avatar,setAvatar]=useState();
    const [avatarPreview,setAvatarPreview] = useState("/Profile.png")


    const {error,loading,isAuthenticated} = useSelector(state => state.user);

    const loginSubmit = (e)=>{
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
    }
const registerSubmit = (e)=>{
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name",name);
    myForm.set("email",email);
    myForm.set("password",password);
    myForm.set("avatar",avatar);
    dispatch(register(myForm))
}

const registerDataChange=(e)=>{
    if(e.target.name === "avatar")
    {const reader = new FileReader();
        reader.onload = ()=>{
            if(reader.readyState===2)
            {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }else{
        setUser({...user,[e.target.name]:e.target.value})
    }
}

    const redirect = location.search ? location.search.split("=")[1]:"/account"

    useEffect(() => {
        if(isAuthenticated)
        {
            navigate(redirect);
        }
        if(error)
        {
            if(error !== "Login to access this resource")
            {
                alert.error(error);
            }
            dispatch(clearErrors())
        }
    }, [dispatch,error,alert,isAuthenticated,navigate,redirect])
    

    const switchTabs = (e,tab)=>{
        if(tab==="login")
        {
            switchTab.current.classList.add("shiftToNeutral");
            switchTab.current.classList.remove("shiftToRight");
            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if(tab==="register")
        {
            switchTab.current.classList.add("shiftToRight");
            switchTab.current.classList.remove("shiftToNeutral");
            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    }

  return (
    <>
    {
        loading?(<Loader/>):(<>
        <Metadata title="LogIn or SignUp"/>
            <div className="LoginSignUpContainer">
                <div className="LoginSignUpBox">
                    <div>
                       <div className="login_signup_toggle">
                        <p onClick={(e)=>switchTabs(e,"login")}>LOGIN</p>
                        <p onClick={(e)=>switchTabs(e,"register")}>REGISTER</p>
                       </div>
                       <button ref={switchTab}></button>
                    </div>
                    <form ref={loginTab} onSubmit={loginSubmit} className="loginForm">
                        <div className="loginEmail">
                            <MailOutlineIcon/>
                            <input type="email" placeholder='Email' required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} />
                        </div>
                        <div className="loginPassword">
                            <LockOpenIcon/>
                            <input type="password" placeholder='Password' required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)}/>
                        </div>
                        <Link to="/password/forgot">Forgot Password?</Link>
                        <input type="submit"value="Login" className="loginBtn"/>
                    </form>
                    <form ref={registerTab} encType='multipart/form-data' className="signupForm" onSubmit = {registerSubmit}>
                        <div className="signupName">
                            <FaceIcon/>
                        <input type="text" placeholder='Name' required value={name} name="name" onChange={registerDataChange} />
                        </div>
                        <div className="signupEmail">
                        <MailOutlineIcon/>
                        <input type="email" placeholder='Email' required name="email" value={email} onChange={registerDataChange} />
                        </div>
                        <div className="signupPassword">
                        <LockOpenIcon/>
                            <input type="password" placeholder='Password' name="password" required value={password} onChange={registerDataChange}/>
                        </div>
                        <div id="register_img">
                            <img src={avatarPreview} alt="AvatarPreview" />
                            <input type="file" name="avatar" accept="image/" onChange={registerDataChange} />
                        </div>
                        <input type="submit" value="Register" className='signupBtn'/> 
                         {/* disabled={loading?true : false} */}
                    </form>
                </div>
            </div>
            </>)
    }
    </>
  )
}

export default LoginSignUp