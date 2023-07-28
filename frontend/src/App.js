import './App.css';
import Header from "./component/layout/Header/Header.js"
import {BrowserRouter as Router , Route , Routes} from "react-router-dom";
import WebFonts from "webfontloader"
import { useEffect, useState } from 'react';
import Home from "./component/Home/Home.jsx"
import ProductDetails from './component/Home/ProductDetails';
import Products from "./component/product/products.js"
import Search from "./component/product/search.js"
import Login from "./component/user/LoginSignUp.jsx"
import {loadUser} from "./actions/userActions"
import { useDispatch, useSelector } from 'react-redux';
import UserOptions from "./component/layout/Header/UserOptions.js"
import Profile from "./component/user/Profile.jsx"
import ProtectedRoute from './component/routes/ProtectedRoute';
import UpdateProfile from "./component/user/UpdateProfile.jsx"
import UpdatePassword from "./component/user/UpdatePassword.jsx"
import ForgotPassword from "./component/user/ForgotPassword.jsx"
import ResetPassword from "./component/user/ResetPassword.jsx"
import Cart from "./component/Cart/cart.jsx"
import ShippingInfo from "./component/Cart/ShippingInfo.jsx"
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx"
import Payment from "./component/Cart/Payment.jsx"
import axios from "axios"
// import { Elements } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
import OrderSuccess from "./component/Cart/OrderSuccess.jsx"
import MyOrders from "./component/Cart/MyOrders.jsx"
import OrderDetails from "./component/Cart/OrderDetails.jsx"
import { useAlert } from 'react-alert';
import AdminDashboard from "./component/admin/AdminDashboard.jsx"
import ProductList from "./component/admin/ProductList.jsx"
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct.jsx';
import OrderList from './component/admin/OrderList.jsx';
import UpdateOrder from './component/admin/UpdateOrder.jsx';
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser.jsx';
import PageNotFound from "./component/layout/PageNotFound/PageNotFound.jsx"
import ContactPage from './component/layout/ContactPage/ContactPage';
import AboutPage from "./component/layout/AboutPage/AboutPage"

function App() {
  const dispatch = useDispatch();
  const alert = useAlert()

  const [stripeApiKey,setStripeApiKey] = useState("")

  async function getStripeApiKey() {
    try {
      const {data} = await axios.get("/api/v1/stripeapikey")
    setStripeApiKey(data.stripeApiKey)
    } catch (error) {
      alert.error(error.response.data.message)
    }
  }

  const {isAuthenticated,user} = useSelector(state => state.user)
  useEffect(()=>{
    WebFonts.load({
      google : {
       families :["Roboto"] 
      }
    })

    dispatch(loadUser());

    getStripeApiKey();

  },[dispatch,stripeApiKey])
  return (
      <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user}/>}
      <Routes>
        <Route exact path = "/" element={<Home/>}/>

        <Route path = "/product/:id" element={<ProductDetails />}/>

        <Route exact path = "/products" element={<Products />}/>

        <Route path = "/products/product/:id" element={<ProductDetails />}/>

        <Route path = "/products/:keyword" element={<Products />}/>

        <Route exact path = "/search" element={<Search />}/>

        <Route exact path='/account' element={<ProtectedRoute/>}>
            <Route exact path='/account' element={<Profile/>}/>
          </Route>

          <Route exact path='/me/update' element={<ProtectedRoute/>}>
            <Route exact path='/me/update' element={<UpdateProfile/>}/>
          </Route>

          <Route exact path='/password/update' element={<ProtectedRoute/>}>
            <Route exact path='/password/update' element={<UpdatePassword/>}/>
          </Route>

          <Route exact path='/password/forgot' element={<ForgotPassword/>}/>

          <Route exact path='/password/reset/:token' element={<ResetPassword/>}/>

        <Route exact path = "/login" element={<Login />}/>

        <Route exact path = "/cart" element={<Cart />}/>
        
        <Route exact path='/login/shippingInfo' element={<ProtectedRoute/>}>
            <Route exact path='/login/shippingInfo' element={<ShippingInfo/>}/>
          </Route>

        <Route exact path='/login/shippingInfo' element={<ProtectedRoute/>}>
            <Route exact path='/login/shippingInfo' element={<ShippingInfo/>}/>
          </Route>

          <Route exact path='/order/confirm' element={<ProtectedRoute/>}>
            <Route exact path='/order/confirm' element={<ConfirmOrder/>}/>
          </Route>
          
          {stripeApiKey && <Route exact path='/process/payment' element={<Payment/>}/>}

          <Route exact path='/success' element={<ProtectedRoute/>}>
            <Route exact path='/success' element={<OrderSuccess/>}/>
          </Route>

          
          <Route exact path='/orders' element={<ProtectedRoute/>}>
            <Route exact path='/orders' element={<MyOrders/>}/>
          </Route>

          <Route exact path='/order/:id' element={<ProtectedRoute/>}>
            <Route exact path='/order/:id' element={<OrderDetails/>}/>
          </Route>

          <Route exact path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/dashboard' element={<AdminDashboard/>}/>
          </Route>

          <Route exact path='/admin/products' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/products' element={<ProductList/>}/>
          </Route>

          <Route exact path='/admin/product' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/product' element={<NewProduct/>}/>
          </Route>

          <Route exact path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/product/:id' element={<UpdateProduct/>}/>
          </Route>

          <Route exact path='/admin/orders' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/orders' element={<OrderList/>}/>
          </Route>

          <Route exact path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/order/:id' element={<UpdateOrder/>}/>
          </Route>

          <Route exact path='/admin/users' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/users' element={<UsersList/>}/>
          </Route>

          <Route exact path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}/>}>
            <Route exact path='/admin/user/:id' element={<UpdateUser/>}/>
          </Route>

          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
