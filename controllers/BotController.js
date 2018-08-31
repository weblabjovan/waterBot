const apiai = require('apiai');
const axios = require('axios');
const UserController = require('./UserController');
const PhotoController = require('./PhotoController');
const config = require('../config/config');
const isDefined = require('../helpers/isDefined');
const getProperResponse = require('../helpers/getProperResponse');
const handleTextForReminders = require('../helpers/handleTextForReminders');
const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
  language: "en",
  requestSource: "fb"
});


class BotController{
	constructor() {
		this.userObj = {};
		this.messageText = "";
		this.user = new UserController();
		this.photo = new PhotoController()
	};

	async getUserObj(userId) { 
		const userObj = await axios.get("https://graph.facebook.com/v2.6/"+userId+"?fields=first_name,last_name,profile_pic&access_token="+config.FB_PAGE_ACCESS_TOKEN);
		this.userObj = userObj.data;
		
		const user = await this.user.findUser(userId);
		if (!user) {
			const newUser = await this.user.newUser(userObj.data);
			await newUser.save();
		}
	}

	async operateOnRecievedMessage(event) {
		await this.getUserObj(event.sender.id);

		const message = event.message;
		
		this.messageText = message.text;
		const messageAttachments = message.attachments;
		if (this.messageText) {
		   await this.sendToApiAi();
		} else if (messageAttachments) {
		   this.handleMessageAttachments(messageAttachments);
		}
	}
	async handleMessageAttachments(attachment) {
		let photo = null;
		if (attachment[0].type === 'image') {
			photo = attachment[0].payload.url;
		}

		if (photo) {
			const url = await this.photo.storeAndRound(photo);
			await this.sendImageMessage(this.userObj.id, url);
		};
	}

	async sendToApiAi() {
		if (this.userObj === {}) {
			throw new Error('Internal Server Error: user object is not defined');
		}
		await this.sendTypingAction('typing_on');
		let apiaiRequest = apiAiService.textRequest(this.messageText, {
		    sessionId: 'testBot'
		});
		
		apiaiRequest.on("response", async response => {
		    if (isDefined(response.result)) {
		      await this.handleApiAiResponse(response);
		    }
		});

		apiaiRequest.on("error", error => console.error(error));
		apiaiRequest.end();
	}

	async handleApiAiResponse(response) {
		let responseText = response.result.fulfillment.speech;
		let responseData = response.result.fulfillment.data;
		let messages = response.result.fulfillment.messages;
		let action = response.result.action;
		let parameters = response.result.parameters;

		await this.sendTypingAction('typing_off');

		if (responseText == "" && !isDefined(action)) {
		    //api ai could not evaluate input.
		    console.log("Unknown query " + response.result.resolvedQuery);
		    await this.sendTextMessage(this.userObj.id, "I'm not sure what you want. Can you be more specific?");
		} else if (isDefined(action)) {
		    await this.handleApiAiAction(action, responseText, parameters);
		} else if (isDefined(responseData) && isDefined(responseData.facebook)) {
		    try {
		      console.log("Response as formatted message" + responseData.facebook);
		      await this.sendTextMessage(this.userObj.id, responseData.facebook);
		    } catch (err) {
		      await this.sendTextMessage(this.userObj.id, err.message);
		    }
		} else if (isDefined(responseText)) {
		    await this.sendTextMessage(this.userObj.id, responseText);
		}
	}

	async handleApiAiAction(action, text, parameters) {
		if (this.userObj === {}) {
			throw new Error('Internal Server Error: user object is not defined');
		}
		let response = null;
		if (isNaN(parseInt(parameters.number))) {
			response = getProperResponse(action, this.userObj.first_name);
		}else{
			const cups = Math.floor(parseInt(parameters.number)/10);
			const text = 'Thanks. The best amount of water for you is '+cups.toString()+' cups per day.';
			response = {
				text: [text],
	 			quick: null 
			}
		}
		
		if (!response) {
			await this.sendTextMessage(this.userObj.id, text);
		}else{
			await this.changeReminderRate();
			const resArray = await response.text.map( async resp => {
				await this.sendTextMessage(this.userObj.id, resp);
			});
			await Promise.all(resArray);

			if (response.quick) {
				await this.sendQuickReply(this.userObj.id, response.quick.text, response.quick.reply);
			};
		}
	}

	async changeReminderRate() {
		const reminderInfo = handleTextForReminders(this.messageText);
		if (reminderInfo) {
			await this.user.changeReminder(this.userObj.id, reminderInfo.reminder, reminderInfo.rate);
		}
	}

	async sendTypingAction(action) {
		const messageData = {
		 	recipient: {
		      id: this.userObj.id
		    },
		    sender_action: action
		};
		await this.callSendAPI(messageData);
	}

	async sendTextMessage(userId, text) {
		const messageData = {
		    recipient: {
		      id: userId
		    },
		    message: {
		      text: text
	    	}
  		};
  		await this.callSendAPI(messageData);
	}

	async sendImageMessage (userId, imageUrl) {
	  const messageData = {
	    recipient: {
	      id: userId
	    },
	    message: {
	      attachment: {
	        type: "image",
	        payload: {
	          url: imageUrl
	        }
	      }
	    }
	  };
	    await this.callSendAPI(messageData);
	}

	async sendQuickReply(userId, text, replies) {
		const messageData = {
		    recipient: {
		      id: userId
		    },
		    message: {
		      text: text,
		      metadata: "",
		      quick_replies: replies
		    }
	    };
	  await this.callSendAPI(messageData);
	}

	async callSendAPI(messageData) {
		const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_ACCESS_TOKEN;
  		await axios.post(url, messageData)
		    .then(function (response) {
		      if (response.status == 200) {
		        const recipientId = response.data.recipient_id;
		        const messageId = response.data.message_id;
		      }
		    })
		    .catch(function (error) {
		      console.log(error.response.headers);
		    });
	}

	async sendMessageToAllUsers(message) {
		const userIds = await this.user.getAllUsers();
		const messageAll = await userIds.map( async data => {
			this.sendTextMessage(data.userId, message);
		});
		await Promise.all(messageAll);
	}
}

module.exports = BotController;