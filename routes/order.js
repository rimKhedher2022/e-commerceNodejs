const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js")
const router=require("express").Router();
const Order = require("../models/Order")


//create 

router.post("/",verifyToken,async(req,res)=>{

    const newOrder = new Order(req.body)

   try {
    const savedOrder =await newOrder.save();
    res.status(200).json(savedOrder)
    
   } catch (err) {
    res.status(500).json(err)
    
   }



})
//update
router.put("/:id",verifyTokenAndAdmin, async(req,res)=>{
   

   try{
    const updatedOrder= await Product.findByIdAndUpdate(req.params.id,
        {
        $set:req.body,
        }
    ,{new:true}
    );

    res.status(200).json(updatedOrder);
   }catch(err){
    res.status(500).json(err);
   }
});


//DELETE

router.delete("/:id", verifyTokenAndAdmin , async(req,res)=>{

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted")
        
    } catch (err) {

        res.status(500).json(err)
        
    }
})

// GET user orders
router.get("/find/:id", verifyTokenAndAuthorization,async(req,res)=>{

    try {
        const orders  = await Order.find(req.params.id);
       
        res.status(200).json(orders);
        
    } catch (err) {

        res.status(500).json(err)
        
    }
})


// GET ALL orders
router.get("/",verifyTokenAndAdmin, async(req,res)=>{
   try {
    const orders = await Order.find() ; 
    res.status(200).json(orders)
   } catch (error) {
    res.status(500).json(error)
   }
})


//get monthly income 

router.get("/income",verifyTokenAndAdmin,async(req,res)=>
{
    const date = new Date();  // septembre
    const lastMonth = new Date(date.setMonth(date.getMonth()-1)) ;// aout
    const preMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1)) ;// aout

    try {
        const income = await Order.aggregate([
            {$match:{ createdAt :{$gte:preMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount",
                },
            },
            {
            
                    $group:{
                        _id:"$month",
                        total:{ $sum :"$sales"},
                    },
            },
        ]);
        res.status(200).json(income)
        
    } catch (error) {

        res.status(500).json(error)
        
    }
});
module.exports=router;