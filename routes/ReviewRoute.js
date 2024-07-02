const express = require('express');
const router = express.Router();
const { productBuyed, createRatingAndReview ,getRatingAndReview } = require('../controller/ratingCtrl');
const {auth,isBuyer} = require('../middlewares/auth');

router.post('/productBuyed',auth,productBuyed);
router.post('/createRatingAndReview',auth,isBuyer,createRatingAndReview);
router.get('/getRatingAndReview/:productId',getRatingAndReview);
module.exports = router;