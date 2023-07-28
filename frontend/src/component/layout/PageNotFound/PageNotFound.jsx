import React from 'react'
import { Link } from 'react-router-dom'
import "./PageNotFound.css"

const PageNotFound = () => {
  return (
    <>
    <div className="container">
    <div>PageNotFound</div>
    <Link to="/">Home</Link>
    </div>
    </>
  )
}

export default PageNotFound