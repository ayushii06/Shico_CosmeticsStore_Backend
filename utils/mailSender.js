const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {
        // Create a nodemailer transporter object with SMTP details
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,  
            port: 465,  
            secure: true,  
            auth: {
                user: process.env.MAIL_USER,  
                pass: process.env.MAIL_PASS,  
            }
        });

        // Send the email using the transporter object
        let info = await transporter.sendMail({
            from: ' Shico - by Ayushi Pal',  
            to: `${email}`,
            subject: `${title}`, 
            html: `${body}`, 
        });
        
        return info;  
    } catch (err) {
        console.log(err);  
    }
}

module.exports = mailSender;
