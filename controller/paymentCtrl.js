const {instance} = require('../config/rajorpay')
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const { ApiError } = require('../middlewares/ApiError');
const { ApiSuccess } = require('../middlewares/ApiError');
const { mongo, default: mongoose } = require('mongoose');

exports.payment = async(req,res)=>{
    try {
        const user_id = req.user.id;
        const {prodId,quantity} = req.body;

        if(!user_id){
            throw new ApiError(400,'Please provide the id of the user')
        }

        if(!prodId){
            throw new ApiError(400,'Please provide the id of the product')
        }

        let product = await Product.findById(prodId)
        if(!product){
            throw new ApiError(400,'Product not found')
        }

        const amount = product.selling_price * 100*quantity;
        const curr = 'INR';

        const options = {
            amount : amount,
            currency : curr,
            receipt : Math.random(Date.now()).toString(),
            notes:{
                productId : prodId,
                productName : product.product_name
            }

        }
      

    } catch (error) {
        throw new ApiError(400,error.message)
    }

    try {
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)

        return res.status(200).json(
            {
                success : true,
                productName : product.product_name,
                productDesc : product.desc,
                img : product.imgsrc,
                qty : quantity,
                orderId : paymentResponse.id,
                currency:paymentResponse.currency,
                amount: paymentResponse.amount,
            }
        )
    } catch (error) {
        
    }
}

exports.verifySignature = async(req,res)=>{
    const webhookSecret = process.env.WEB_HOOK_SECRET;

    const signature = req.headers['x-razorpay-signature'];

    const shasum= crypto.createHmac('sha256', webhookSecret)

    shasum.update(JSON.stringify(req.body)) 
    const digest = shasum.digest('hex')
}