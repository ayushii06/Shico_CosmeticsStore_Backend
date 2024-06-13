const {instance} = require('../config/rajorpay')
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');


exports.payment = async(req,res)=>{
    try {
        const user_id = req.user.id;
        const {prodId,quantity} = req.body;

        if(!user_id){
            res.status(400).json({
                success:false,
                message:'Please provide the id of the user'
            })
        }

        if(!prodId){
            res.status(400).json({
                success:false,
                message:'Please provide the id of the product'
            })
        }

        let product = await Product.findById(prodId)
        if(!product){
            res.status(400).json({
                success:false,
                message:'Product Not Found'
            })
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
        res.status(400).json({
            success:false,
            message:error.message
        })
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
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.verifySignature = async(req,res)=>{
    const webhookSecret = process.env.WEB_HOOK_SECRET;

    const signature = req.headers['x-razorpay-signature'];

    const shasum= crypto.createHmac('sha256', webhookSecret)

    shasum.update(JSON.stringify(req.body)) 
    const digest = shasum.digest('hex')

    if(digest === signature){
        console.log('Request is legit')

        const {prodId} = req.body.payload.payment.entity.notes;

        //mail the user
        const emailResponse = await mailSender(
            req.user.email,
            'Payment Successful',
            'Your payment is successful'
        )

        await Product.findByIdAndUpdate(prodId,{
            $inc : {stock : -1},
            buyer : req.user.id,
        })

        res.status(200).json({
            success : true,
            message : 'Payment is successful',
            productId : prodId
        })
    }
    else{
        res.status(400).json({
            success:false,
            message:'Invalid Signature'
        })
    }
}