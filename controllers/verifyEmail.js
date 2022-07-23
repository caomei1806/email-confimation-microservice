const createConnection = require('../db/createConnection')
const checkConnection = require('../db/checkConnection')
const mongoose = require('mongoose')

const verifyEmail = async (req, res) => {
	const { token } = req.query
	const databaseConnection = createConnection(process.env.MONGO_URL, {
		useNewUrlParser: true,
	})
	await checkConnection(databaseConnection)
	const schema = new mongoose.Schema({}, { strict: false })
	const User = databaseConnection.model('user', schema, 'users')

	const update = {
		confirmed: true,
		emailToken: '',
	}

	const userData = await User.findOneAndUpdate({ emailToken: token }, update)
	console.log(userData)
	res.json({ msg: 'Verification successfull!' })
}
module.exports = verifyEmail
