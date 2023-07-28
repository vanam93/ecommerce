import React,{useEffect} from 'react'
import {DataGrid} from "@material-ui/data-grid"
import "./productList.css"
import { useDispatch,useSelector } from 'react-redux'
import { getAdminProducts,clearErrors,deleteProduct } from '../../actions/productAction'
import { Link,  useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata'
import Sidebar from './Sidebar'
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import { Button } from '@material-ui/core'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const ProductList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {error,products} = useSelector(state=>state.products)
    const {error : deleteError,isDeleted} = useSelector(state=>state.product)

    const deleteBtnHandler = (id)=>{
        dispatch(deleteProduct(id))
    }

    const columns = [{
        field : "id" , headerName : "Product Id",minWidth : 200,flex:1
    },{
        field : "name" , headerName : "Name",minWidth : 250,flex:0
    },{
        field : "stock",headerName : "Stock" , type : "number",minWidth:150,flex:0.3
    },{
        field : "price" , headerName : "Price",type : "number",minWidth : 270,flex:0.5
    },{
        field : "actions" , headerName : "Actions",type : "number",minWidth : 150,flex:0.3,sortable : false,
        renderCell:(params)=>{return (
            <>
            <Link to={`/admin/product/${params.getValue(params.id,"id")}`}>
                <EditIcon/>
            </Link>
            <Button onClick={()=>{deleteBtnHandler(params.getValue(params.id,"id"))}}>
                <DeleteIcon/>
            </Button>
            </>
        )}
    }]
    const rows= [];
    products && products.forEach((item)=>{
        rows.push({
            id:item._id,
            stock : item.stock,
            price : item.price,
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
        alert.success("Product Deleted Successfully")
        navigate("/admin/products");
        dispatch({type : DELETE_PRODUCT_RESET})
      }
      dispatch(getAdminProducts())
    }, [alert,error,dispatch,navigate,isDeleted,deleteError])
    
   

    return (
    <>
    <Metadata title ={"All Products-Admin"}/>
    <div className="dashBoard">
        <Sidebar/>
        <div className="productsListContainer">
            <h1 id="productListHeading">All Products</h1>
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
  )
}

export default ProductList