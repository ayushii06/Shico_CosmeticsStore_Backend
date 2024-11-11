const express=require('express');
const {createProduct,updateProduct,deleteProduct,getallProducts,getaProduct,fetchAllData,addToWishlist} = require('../controller/productCtrl')
const {auth,isSeller,isBuyer}=require('../middlewares/auth.js')

const router = express.Router();


router.post("/add",auth,isSeller,createProduct);
router.put("/update",auth,isSeller,updateProduct)
router.delete("/delete/:product_id",auth,isSeller,deleteProduct)
router.get("/getallProducts",getallProducts)
router.post("/fetchAllData",fetchAllData)
router.get("/",getaProduct)
router.post("/wishlist", auth, isBuyer, addToWishlist);

module.exports = router;
