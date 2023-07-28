import React, { useEffect,useState } from 'react'
import "./product.css"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import {useDispatch,useSelector} from "react-redux"
import {getProducts,clearErrors} from "../../actions/productAction"
import Loader from "../layout/loader/Loader"
import Product from "../Home/ProductCard"
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import {useAlert} from "react-alert"
import Metadata from '../layout/Metadata'

const categories = ["laptop","FootWare","Bottom","Top","Attire","Camera","SmartPhones"]
const Products = () => {
    const dispatch=useDispatch();
    const params = useParams();
    const alert = useAlert();

    const [currentPage,setCurrentPage] = useState(1);
    const [price,setPrice] = useState([0,25000])
    const [category,setCategory]=useState("")
    const [rating,setRating] = useState(0)

    const {loading,error,products,productsCount,resultPerPage,filteredProductsLength} = useSelector(state => state.products)

    const setCurrentPageNo = (e)=>{
      setCurrentPage(e);
    }
    const priceHandler = (e,newPrice) => {
      setPrice(newPrice)
    }
    let count = filteredProductsLength;

    useEffect(() => {
      if(error)
      {
        alert.error(error)
        dispatch(clearErrors())
      }
      dispatch(getProducts(params.keyword,currentPage,price,category,rating))
  }, [dispatch,params.keyword,currentPage,price,category,rating,alert,error])
  return (
    <>
    {loading?(<Loader/>):(
       <>
       <Metadata title="PRODUCTS--ECOMMERCE"/>
       <h2 className='productsHeading'>Products</h2>
       <div className="products">
        {products && products.map((p,i)=>(
            <Product key={i} product={p} />
        ))}
       </div>

       <div className="filterBox">
        <Typography>Price</Typography>
        <Slider 
        value = {price}
        onChange = {priceHandler}
        valueLabelDisplay='auto'
        aria-labelledby='range-slider'
        min={0}
        max={25000}
        />
        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category)=>(
            <li className="categoryLink" key={category} onClick={()=>setCategory({category})}>{category}</li>
          ))}
        </ul>
        <fieldset>
          <Typography component='legend'>Ratings above</Typography>
          <Slider
          value = {rating}
          valueLabelDisplay='auto'
          onChange = {(e,newRating)=>{
            setRating(newRating)
          }}
          aria-labelledby='continuous-slider'
          min={0}
          max={5}
          />
        </fieldset>
       </div>

       {
        resultPerPage < count && (<div className="paginationBox">
        <Pagination 
        activePage={currentPage}
        itemsCountPerPage = {resultPerPage}
        totalItemsCount = {productsCount}
        onChange = {setCurrentPageNo}
        nextPageText="Next"
        prevPageText="Prev"
        firstPageText="First"
        lastPageText="Last"
        itemClass='page-item'
        linkClass='page-link'
        activeClass='pageItemActive'
        activeLinkClass='pageLinkActive'

        />
       </div>)
       }
       </>
    )}
    </>
  )
}

export default Products