const express=require('express');
const {createProduct,updateProduct,deleteProduct,getallProducts,getaProduct,fetchAllData,addToWishlist,rating} = require('../controller/productCtrl')
const {fetchuser}=require('../middlewares/auth.js')

const router = express.Router();


router.post("/add",createProduct);
router.post("/update",updateProduct)
router.post("/:product_id",deleteProduct)
router.post("/getallProducts",getallProducts)
router.post("/fetchAllData",fetchAllData)

// router.put("/wishlist", fetchuser, addToWishlist);
// router.put("/rating", fetchuser, rating);
// router.get("/", getAllProduct);

module.exports = router;
