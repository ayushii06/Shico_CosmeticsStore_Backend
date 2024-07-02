const express = require('express')
const router = express.Router();
const { payment,verifySignature } = require('../controller/paymentCtrl');
const {auth,isBuyer} = require('../middlewares/auth');  

router.post('/buy',auth,payment);
router.post('/verifySignature',verifySignature);

module.exports = router;