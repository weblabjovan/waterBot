const config = require('../config/config');
const BotController = require('../controllers/BotController');

module.exports = app => {
	
	app.get("/webhook/", function (req, res) {
	  console.log("request");
	  if (
	    req.query["hub.mode"] === "subscribe" &&
	    req.query["hub.verify_token"] === config.VERIFY_TOKEN
	  ) {
	    res.status(200).send(req.query["hub.challenge"]);
	  } else {
	    console.error("Failed validation. Make sure the validation tokens match.");
	    res.sendStatus(403);
	  }
	});

	app.post("/webhook/", function (req, res) {
	  const Bot = new BotController();
	  const data = req.body;
	  if (data.object == "page") {

	    data.entry.forEach(function (pageEntry) {
	      const pageID = pageEntry.id;
	      const timeOfEvent = pageEntry.time;

	      pageEntry.messaging.forEach(function (messagingEvent) {
	        if (messagingEvent.message) {
	           Bot.operateOnRecievedMessage(messagingEvent)
	        } else {
	          console.log("Webhook received unknown messagingEvent: ",messagingEvent);
	        }
	      });
	    });
	    res.sendStatus(200);
	  }
	});
}