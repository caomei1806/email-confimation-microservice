require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const config = require('./config')

const connectDB = require('./db/connect')
const sendEmail = require('./controllers/sendEmail')
const verifyEmail = require('./controllers/verifyEmail')
const amqp = require('amqplib')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

let channel
const connect = async () => {
	const connection = await amqp.connect(config.rabbitMQ.url)
	channel = await connection.createChannel()
}
connect().then(() => {
	channel.consume(config.rabbitMQ.queue, (message) => {
		const data = JSON.parse(message.content)
		console.log(`Received : ${data.userEmail}`)
		channel.ack(message)
		sendEmail(data)
	})
})
//routes
app.route('/').get((req, res) => {
	res.send('<h1>Email verification</h1>')
})
app.get('/verify-email', verifyEmail)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3001
const host = process.env.HOST || '127.0.0.1'

const start = async () => {
	app.listen(port, () =>
		console.log(`Server is listening on port ${port}... && ${host}`)
	)
}

start()
