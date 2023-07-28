import React,{ useEffect } from 'react'
import {CgMouse} from "react-icons/cg"
import "./home.css"
import Product from "./ProductCard.js"
import Metadata from '../layout/Metadata.jsx'
import {useSelector,useDispatch} from "react-redux"
import {getProducts,clearErrors} from "../../actions/productAction"
import {useAlert} from "react-alert"
import Loader from '../layout/loader/Loader'

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const {loading,error,products} = useSelector(state => state.products)
  useEffect(()=>{
    if(error)
    {
      alert.error(error);
      dispatch(clearErrors())
    }
    dispatch(getProducts())
  },[dispatch,error,alert])
  window.addEventListener("contextmenu",(e)=>[e.preventDefault()])
  return (
    <>
    {loading?(<Loader/>):(<>
    <Metadata title="E-Commerce"/>
    <div className="banner">
      <p>WELCOME TO E-COMMERCE</p>
      <h1>Find amazing products below..</h1>
      <a href="#container">
        <button>Scroll <CgMouse/></button>
      </a>
    </div>
    <h2 className='homeHeading'>Featured Poducts</h2>
    <div className="container" id="container">
     {products && products.map((p,i)=>(
      <Product key={i} product={p}/>
     ))}
    </div>
    </>)}
    </>
  )
}

export default Home