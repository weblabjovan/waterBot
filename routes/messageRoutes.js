const BotController = require('../controllers/BotController');

module.exports = app => {

	app.post("/message", async (req, res) => {
		console.log('this is '+req.body.message.length);
		if (req.body.message.length > 0) {
			const Bot = new BotController();
			await Bot.sendMessageToAllUsers(req.body.message);
			res.sendStatus(200).send('Message successfully sent');
		}else{
			res.sendStatus(500).send('No message');
		}
	    
	});
}