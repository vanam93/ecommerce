import React,{useEffect, useState} from 'react'
import "./newProduct.css"
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors,newProduct } from '../../actions/productAction'
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
import { NEW_PRODUCT_RESET } from '../../constants/productConstants' 

const NewProduct = () => {
    const categories = ["laptop","FootWare","Bottom","Top","Attire","Camera","SmartPhones"]
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading,error,success} = useSelector(state=>state.newProduct)
    const [name,setName] = useState("");
    const [price,setPrice] = useState(0);
    const [category,setCategory] = useState("");
    const [description,setDescription] = useState("");
    const [stock,setStock]=useState(0);
    const [images,setImages]=useState([]);
    const [imagesPreview,setImagesPreview]=useState([])

    useEffect(()=>{
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors())
        }
        if(success)
        {
            alert.success("Product Created Successfully")
            navigate("/admin/dashboard")
            dispatch({type:NEW_PRODUCT_RESET})
        }
    },[dispatch,alert,error,success,navigate])

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
        dispatch(newProduct(myForm))
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
   <Metadata title="Create Product"/>
   <div className="dashBoard">
    <Sidebar/>
    <div className="newProductContainer">
        <form encType='multipart/form-data' className="createProductForm" onSubmit={(e)=>{createProductSubmitHandler(e)}}>
            <h1>Create Product</h1>
            <div>
                <SpellcheckIcon/>
                <input type="text" placeholder="Product Name" required value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
                <AttachMoneyIcon/>
                <input type="number" placeholder="Price" required  onChange={(e)=>setPrice(e.target.value)}/>
            </div>
            <div>
                <DescriptionIcon/>
                <textarea placeholder='Product Description' cols="30" rows="1" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
            </div>
            <div>
                <AccountTreeIcon/>
                <select onChange={(e)=>setCategory(e.target.value)}>
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
                <input type="number" placeholder="Stock" required onChange={(e)=>setStock(e.target.value)} />
            </div>
            <div id="createProductFromFile">
                <input type="file" name = "avatar" accept="image/" onChange={createProductImageChange} multiple/>
            </div>
            <div id="createProductFromImage">
                {imagesPreview.map((img,ind)=>(
                    <img key={ind} src={img} alt="Product Preview"/>
                ))}
            </div>
            <Button id="createProductBtn" type="submit" disabled={loading ? true : false}>
                Create
            </Button>
        </form>
    </div>
   </div>
   </>
  )
}

export default NewProduct