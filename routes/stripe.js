const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);


router.post("/payment",(req,res)=>{
    
})
module.exports=router