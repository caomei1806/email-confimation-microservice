const RABBIT_URL = process.env.AMQP_URL || 'amqp://localhost:5672'
module.exports = {
	rabbitMQ: {
		url: RABBIT_URL,
		exchangeName: 'verificationExchange',
		queue: 'user.sign_up_email',
	},
}
