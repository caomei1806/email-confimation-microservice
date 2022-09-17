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

// assign needed queing system info (name of the queue that connects microservices)
const AMQP_URL = process.env.MESSAGE_QUEUE || config.rabbitMQ.url

// create amqp channel and connect with rabbitmq queue
let channel
const connect = async () => {
	const connection = await amqp.connect(AMQP_URL)
	channel = await connection.createChannel()
	channel.assertQueue(config.rabbitMQ.queue, { durable: false })
}

//routes
app.route('/').get((req, res) => {
	res.send('<h1>Email verification</h1>')
})
// redirected from verifing url address included in email confirmation
app.get('/verify-email', verifyEmail)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3001

const start = async () => {
	// when server successfully started connect to rabbitmq
	connect()
		.then(() => {
			// process all incomming data (users to verify)
			channel.consume(config.rabbitMQ.queue, (message) => {
				const data = JSON.parse(message.content)
				console.log(`Received : ${data.userEmail}`)
				channel.ack(message)
				// send verification email
				sendEmail(data)
			})
		})
		.catch((err) => {
			console.log(err)
		})
	app.listen(port, () => console.log(`Server is running... `))
}

start()
