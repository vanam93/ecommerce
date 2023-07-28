import { Step, Typography,Stepper,StepLabel } from '@material-ui/core'
import React from 'react'
import LocalShippingIcon from "@material-ui/icons/LocalShipping"
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck"
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import "./CheckoutSteps.css"

const CheckoutSteps = ({activeStep}) => {
  const steps = [
    {
        label:<Typography>Shipping Details</Typography>,
        icon:<LocalShippingIcon/>
    },
    {
        label:<Typography>Confirm Order</Typography>,
        icon:<LibraryAddCheckIcon/>
    },
    {
        label:<Typography>Payment</Typography>,
        icon:<AccountBalanceIcon/>
    }
  ];
  
    return (
    <>
    <Stepper alternativeLabel activeStep={activeStep} style={{
        boxSizing:"border-box",
        width:"80%",
        marginLeft:"10vw"
    }}>
        {steps.map((i,ind)=>(
            <Step key={ind} active={activeStep === ind ? true:false} completed={activeStep >= ind ? true:false}>
                <StepLabel style={
                    {
                        color : activeStep>=ind ? "tomato":"rbga(0,0,0,0.649)"
                    }
                } icon={i.icon}>
                    {i.label}
                </StepLabel>
            </Step>
        ))}
    </Stepper>
    </>
  )
}

export default CheckoutSteps