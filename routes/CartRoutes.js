const { Router } = require('express');
const {get_cart_items,add_cart_item,delete_item} = require('../controller/cartCtrl');
const {auth,isBuyer} = require('../middlewares/auth')
const router = Router();

router.get('/getcart',auth,isBuyer,get_cart_items);
router.post('/addtocart',auth,isBuyer,add_cart_item);
router.delete('/delete/:itemId',auth,isBuyer,delete_item);

module.exports = router;