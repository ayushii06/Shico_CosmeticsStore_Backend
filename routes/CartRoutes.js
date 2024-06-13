const { Router } = require('express');
const cartController = require('../controller/cartCtrl');
const {auth,isBuyer} = require('../middlewares/auth')
const router = Router();

router.get('/getcart',auth,isBuyer,cartController.get_cart_items);
router.post('/addtocart',auth,isBuyer,cartController.add_cart_item);
router.delete('/delete/:itemId',auth,isBuyer,cartController.delete_item);

module.exports = router;