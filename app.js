require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const sendEmail = require('./controllers/sendEmail')
const verifyEmail = require('./controllers/verifyEmail')
const consumeRabbitMQ = require('./consumer')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// routes
app.route('/').get(consumeRabbitMQ, async (req, res) => {
	if (req.data) {
		console.log('Please work:' + req.data.userEmail)
	}
	res.send('<h1>Please check your email</h1>')
	sendEmail(req)
})
app.get('/verify-email', verifyEmail)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
	app.listen(port, () => console.log(`Server is listening on port ${port}...`))
}

start()
