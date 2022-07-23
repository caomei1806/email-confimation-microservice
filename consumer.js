const amqp = require('amqplib')
const config = require('./config')
const consumeRabbitMQ = async (req, res, next) => {
	try {
		const connection = await amqp.connect(config.rabbitMQ.url)
		const channel = await connection.createChannel()
		await channel.assertQueue(config.rabbitMQ.exchangeName)
		channel.consume(config.rabbitMQ.exchangeName, (message) => {
			const data = JSON.parse(message.content)
			console.log(`Received : ${data.userEmail}`)
			channel.ack(message)
			req.data = data
			next()
		})
	} catch (err) {
		console.log(err)
	}
}
module.exports = consumeRabbitMQ
