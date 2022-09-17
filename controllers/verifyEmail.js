const createConnection = require('../db/createConnection')
const checkConnection = require('../db/checkConnection')
const mongoose = require('mongoose')

const verifyEmail = async (req, res) => {
	// get email verification token from url
	const { token } = req.query
	// connect with bank users database
	const databaseConnection = createConnection(process.env.MONGO_URL, {
		useNewUrlParser: true,
	})
	await checkConnection(databaseConnection)
	// create blank schema to be able to search through user data
	const schema = new mongoose.Schema({}, { strict: false })
	const User = databaseConnection.model('user', schema, 'users')

	// confirm user and clean token email
	const update = {
		confirmed: true,
		emailToken: '',
	}
	// update existing user info (add account confirmation and delete token used for verifing account)
	const userData = await User.findOneAndUpdate({ emailToken: token }, update)
	console.log(userData)
	res.json({ msg: 'Verification successfull!' })
}
module.exports = verifyEmail
