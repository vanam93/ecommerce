import React from 'react'
import {ReactNavbar} from "overlay-navbar"
import {FaUserAlt,FaSearch,FaShoppingBasket} from "react-icons/fa"
import logo from "../../images/Logo.png"

function Header() {
  return (
    <ReactNavbar
    burgerColor = "black"
    logo={logo}
    burgerColorHover = "tomato"
    nav1Transition = "0"
    nav3Transition = "0"
    nav4Transition = "0"
    nav2Transition = "0"
    navColor1 = "white"
    navcolor = "white"
    link1Text = "Home"
    link2Text = "Products"
    link3Text = "Contact"
    link4Text = "About"
    link1Url = "/"
    link2Url = "/products"
    link3Url = "/contact"
    link4Url = "/about"
    link1Size="2vmax"
    link1Color = "black"
    nav1JustifyConent = "flex-end"
    nav2JustifyConent = "flex-end"
    nav3JustifyConent = "flex-start"    
    nav4JustifyConent = "flex-start"
    link1ColorHover = "tomato"
    link1Margin = "1vmax"
    profileIcon = {true}
    ProfileIconElement = {FaUserAlt}
    profileIconColor = "black"
    profileIconColorHover = "tomato"
    profileIconSize = "2vmax"
    profileIconUrl = "/login"
    searchIcon = {true}
    SearchIconElement = {FaSearch}
    searchIconColor = "black"
    searchIconColorHover = "tomato"
    cartIcon = {true}
    CartIconElement = {FaShoppingBasket}
    cartIconColor = "black"
    cartIconColorHover = "tomato"
    searchIconMargin = "1vmax"
   profileIconMargin = "1vmax"
    cartIconMargin = "1vmax"
    />
  )
}

export default Header