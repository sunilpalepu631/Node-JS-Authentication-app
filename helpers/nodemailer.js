//node mailer
const nodemailer = require('nodemailer')

require('dotenv').config();

const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD

let sendMail = async (email, message) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_HOST_USER,
            pass: EMAIL_HOST_PASSWORD
        }
    });

    let mailOptions = {
        from: EMAIL_HOST_USER,
        to: email,
        subject: 'Reset password',
        text: message
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return error
        } else {
            console.log('Email sent: ' + info.response);
            return info.response
        }
    });
}


// export default sendMail
module.exports = sendMail