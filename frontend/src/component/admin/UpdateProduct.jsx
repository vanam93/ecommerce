import React,{useEffect, useState} from 'react'
import "./updateProduct.css"
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors,updateProduct,getProductDetails } from '../../actions/productAction'
import { useAlert } from 'react-alert'
import { Button } from '@material-ui/core'
import Metadata from '../layout/Metadata'
import AccountTreeIcon from "@material-ui/icons/AccountTree"
import DescriptionIcon from "@material-ui/icons/Description"
import StorageIcon from "@material-ui/icons/Storage"
import SpellcheckIcon from "@material-ui/icons/Spellcheck"
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants' 
import { useParams } from 'react-router-dom'

const UpdateProduct = () => {
    const categories = ["laptop","FootWare","Bottom","Top","Attire","Camera","SmartPhones"]
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const alert = useAlert();

    const {loading,error:updateError,isUpdated} = useSelector(state=>state.product)
    const {error,product} = useSelector(state=>state.productDetails)

    const [name,setName] = useState("");
    const [price,setPrice] = useState(0);
    const [category,setCategory] = useState("");
    const [description,setDescription] = useState("");
    const [stock,setStock]=useState(0);
    const [images,setImages]=useState([]);
    const [oldimages,setOldImages]=useState([]);
    const [imagesPreview,setImagesPreview]=useState([])

    const id = params.id



    useEffect(()=>{
        if(product && product._id !==id)
        {
            dispatch(getProductDetails(id));
        }
        else{
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setStock(product.stock);
            setCategory(product.category);
            setOldImages(product.images)
        }
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors())
        }
        if(updateError)
        {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if(isUpdated)
        {
            alert.success("Product Updated Successfully")
            navigate("/admin/products")
            dispatch({type:UPDATE_PRODUCT_RESET})
        }
    },[dispatch,alert,error,isUpdated,navigate,updateError,id,product])

    const createProductSubmitHandler = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name",name);
        myForm.set("price",price);
        myForm.set("description",description);
        myForm.set("category",category);
        myForm.set("stock",stock);
        images.forEach((img)=>{
            myForm.append("images",img);
        })
        dispatch(updateProduct(id,myForm))
    }

    const createProductImageChange = (e)=>{
        const files = Array.from(e.target.files);
        

        files.forEach((f)=>{
            const reader= new FileReader();
            reader.onload = ()=>{
                if(reader.readyState === 2)
                {
                    setImagesPreview((old)=>[...old,reader.result]);
                    setImages((old)=>[...old,reader.result]);
                }
            }
            reader.readAsDataURL(f)
        })
    }

  return (
   <>
   <Metadata title="Update Product"/>
   <div className="dashBoard">
    <Sidebar/>
    <div className="newProductContainer">
        <form encType='multipart/form-data' className="createProductForm" onSubmit={(e)=>{createProductSubmitHandler(e)}}>
            <h1>Update Product</h1>
            <div>
                <SpellcheckIcon/>
                <input type="text" placeholder="Product Name" required value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
                <AttachMoneyIcon/>
                <input type="number" value={price} placeholder="Price" required  onChange={(e)=>setPrice(e.target.value)}/>
            </div>
            <div>
                <DescriptionIcon/>
                <textarea placeholder='Product Description' cols="30" rows="1" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
            </div>
            <div>
                <AccountTreeIcon/>
                <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                    <option value="">Choose Category</option>
                    {
                        categories.map((c)=>(
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div>
                <StorageIcon/>
                <input type="number" value={stock} placeholder="Stock" required onChange={(e)=>setStock(e.target.value)} />
            </div>
            <div id="createProductFromFile">
                <input type="file" name = "avatar" accept="image/" onChange={createProductImageChange} multiple/>
            </div>
            <div id="createProductFromImage">
                {oldimages && oldimages.map((img,ind)=>(
                    <img key={ind} src={img.url} alt="Product Preview"/>
                ))}
            </div>
            <div id="createProductFromImage">
                {imagesPreview.map((img,ind)=>(
                    <img key={ind} src={img} alt="Product Preview"/>
                ))}
            </div>
            <Button id="createProductBtn" type="submit" disabled={loading ? true : false}>
                Update
            </Button>
        </form>
    </div>
   </div>
   </>
  )
}

export default UpdateProduct