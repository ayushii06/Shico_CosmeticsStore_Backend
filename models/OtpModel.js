const mongoose = require('mongoose'); 
const mailSender = require("../utils/mailSender");
const emailTemplate = require('../mailTemplates/verifyOtp.js');

//defining the otp model
var OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },

    otp:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
        expires: 2*60, //120 sec?
    }
});

//sending otp on email
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

//
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

//exporting the model
module.exports = mongoose.model('Otp', OTPSchema);