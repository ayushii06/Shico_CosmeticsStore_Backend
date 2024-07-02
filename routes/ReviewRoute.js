const express = require('express');
const router = express.Router();
const { productBuyed, createRatingAndReview } = require('../controller/ratingCtrl');
const {auth,isBuyer} = require('../middlewares/auth');

router.post('/productBuyed',auth,productBuyed);

module.exports = router;