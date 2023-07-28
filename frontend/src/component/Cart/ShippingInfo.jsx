import React,{useState} from 'react'
import "./shippingInfo.css"
import {useSelector,useDispatch} from "react-redux"
import { saveShippingInfo } from '../../actions/cartActions'
import Metadata from '../layout/Metadata'
import PinDropIcon from "@material-ui/icons/PinDrop"
import HomeIcon from"@material-ui/icons/Home"
import LocationCityIcon from "@material-ui/icons/LocationCity"
import PublicIcon from "@material-ui/icons/Public"
import PhoneIcon from "@material-ui/icons/Phone"
import TransferWihAStationIcon from "@material-ui/icons/TransferWithinAStation"
import {Country,State} from "country-state-city"
import {useAlert} from "react-alert"
import CheckoutSteps from "../Cart/CheckoutSteps.jsx"
import { useNavigate } from 'react-router-dom'

const ShippingInfo = () => {
    const dispatch=useDispatch();
    const alert= useAlert();
    const navigate = useNavigate()
    const {shippingInfo} = useSelector(state=>state.cart)
    const [address,setAddress] = useState(shippingInfo.address)
    const [city,setCity] = useState(shippingInfo.city)
    const [state,setState] = useState(shippingInfo.state)
    const [country,setCountry] = useState(shippingInfo.country)
    const [pincode,setPincode] = useState(shippingInfo.pincode)
    const [phnNo,setPhnNo] = useState(shippingInfo.phnNo)

    const shippingSubmit=(e)=>{
        e.preventDefault();
        if(phnNo.length!==10)
        {
            alert.error("Enter a valid Phone Number")
            return
        }
        dispatch(saveShippingInfo({address,city,state,country,pincode,phnNo}))
        navigate("/order/confirm")
    }

  return (
    <>
    <Metadata title="ShippingInfo"/>
    <CheckoutSteps activeStep={0}/>
    <div className="shippingContainer">
        <div className="shippingBox">
            <h2 className="shippingBoxHeading">
                Shipping Details
            </h2>

            <form action="
            " className="shippingForm" encType="multipart/formdata" onSubmit={shippingSubmit}>
                <div>
                    <HomeIcon/>
                    <input type="text" placeholder='Address' required value={address} onChange={(e)=>setAddress(e.target.value)} />
                </div>
                <div>
                    <LocationCityIcon/>
                    <input type="text" placeholder='City' required value={city} onChange={(e)=>setCity(e.target.value)} />
                </div>
                <div>
                    <PinDropIcon/>
                    <input type="number" placeholder='Pin Code' required value={pincode} onChange={(e)=>setPincode(e.target.value)} />
                </div>
                <div>
                    <PhoneIcon/>
                    <input size="10" type="number" placeholder='Phone Number' required value={phnNo} onChange={(e)=>setPhnNo(e.target.value)} />
                </div>

                <div>
                    <PublicIcon/>
                    <select required value={country} onChange={(e)=>setCountry(e.target.value)}>
                        <option value="">Country</option>
                        {Country && Country.getAllCountries().map(i=>(
                            <option value={i.isoCode}>{i.name}</option>
                        ))}
                    </select>
                </div>
                {country && (
                    <div>
                        <TransferWihAStationIcon/>
                        <select required value={state} onChange={(e)=>setState(e.target.value)}>
                        <option value="">State</option>
                        {State && State.getStatesOfCountry(country).map(i=>(
                            <option value={i.isoCode}>{i.name}</option>
                        ))}
                    </select>
                    </div>
                )
                }

                <input type="submit" value="Continue" className='shippingBtn' disabled={state?false:true} />
            </form>
        </div>
    </div>
    </>
  )
}

export default ShippingInfo