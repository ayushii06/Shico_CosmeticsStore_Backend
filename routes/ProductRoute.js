const express=require('express');
const {createProduct,updateProduct,deleteProduct,getallProducts,getaProduct,fetchAllData,addToWishlist,rating} = require('../controller/productCtrl')
const {auth,isSeller}=require('../middlewares/auth.js')

const router = express.Router();


router.post("/add",auth,isSeller,createProduct);
router.put("/update",auth,isSeller,updateProduct)
router.delete("/delete/:product_id",auth,isSeller,deleteProduct)
router.get("/getallProducts",getallProducts)
router.post("/fetchAllData",fetchAllData)
router.get("/",getaProduct)
// router.put("/wishlist", fetchuser, addToWishlist);
// router.put("/rating", fetchuser, rating);
// router.get("/", getAllProduct);

module.exports = router;
