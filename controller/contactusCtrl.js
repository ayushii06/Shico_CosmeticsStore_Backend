const { ApiError } = require('../middlewares/ApiError');
const ContactUs = require('../models/ContactUsModel');
const mailSender = require('../utils/mailSender')

exports.getMessage = async(req,res)=>{
    try {
        const {id} = req.user.id;
        const {name,email,message} = req.body;
        const contact = await ContactUs.create({
            name,
            email,
            message
        });

        
    } catch (error) {
        throw new ApiError(400,error.message);
    }
}