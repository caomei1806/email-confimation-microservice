const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
const sendEmail = async (req) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const msg = {
		to: req.data.userEmail,
		from: 'caomei1806@gmail.com', // Change to your verified sender
		subject: 'User confirmation KG-Bank',
		text: 'please ',
		html: `<h2>Hi ${req.data.userName}! Thank you for registering! <br /><strong>Please verify your email by clicking on the link <a href="http://localhost:3000/verify-email?token=${req.data.jwtVerifyToken}">http://localhost:3000/verify-email?token=${req.data.jwtVerifyToken} </a></strong></h2>`,
	}

	const info = await sgMail.send(msg)
	console.log(info)
	return
}
module.exports = sendEmail
