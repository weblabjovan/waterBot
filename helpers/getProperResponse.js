module.exports = (action , name) => {
   switch (action) {
    case "send-txt":
    	let sendText = "Hi " +name+" ! I will be your personal water trainer 🙂 you can call me Woty";
	    let sendText1 = "Bellow is your menu. You can reach it by writing Menu, Help or Start 🙂";

	    let sendReplies = [{
	        "content_type": "text",
	        "title": "About Waterbot",
	        "payload": "About Waterbot",
	    },
	    {
	        "content_type": "text",
	        "title": "Change alerts",
	        "payload": "Change alerts",
	    }];

	    return {
	 		text: [sendText],
	 		quick: {
	 			text: sendText1,
	 			reply: sendReplies
	 		}   
	    };
	case "about": 
		let aboutResponse = "Thanks for asking 🙂";
		let aboutResponse1 = "WaterBot  was created by SPARTANS AI LTD. We build innovative AI driven products.";
		let aboutResponse2 = "WaterBot's goal is to help you drink more water for a healthier life.";
		let aboutResponse3 = "☑  Daily water reminders \n☑  Personalized AI recommendations \n☑  Number of cups of water drank this week \n☑  Tips about water drinking ";
		let aboutReplies = [{
	        "content_type": "text",
	        "title": "Back",
	        "payload": "Back",
	    }];
	    return {
	 		text: [aboutResponse, aboutResponse1, aboutResponse2],
	 		quick: {
	 			text: aboutResponse3,
	 			reply: aboutReplies
	 		}   
	    };
	case 'change':
		let changeResponse = "Changing frequency is super easy. Select new frequency:";
		let changeReplies = [{
	        "content_type": "text",
	        "title": "3 Times a Day",
	        "payload": "Three Times a Day",
	    },
	    {
	        "content_type": "text",
	        "title": "Twice a Day",
	        "payload": "Twice a Day",
	    },
	    {
	        "content_type": "text",
	        "title": "Once a Day",
	        "payload": "Once a Day",
	    },
	    {
	        "content_type": "text",
	        "title": "Stop reminding me",
	        "payload": "Stop reminding me",
	    }];

	    return {
	 		text: [],
	 		quick: {
	 			text: changeResponse,
	 			reply: changeReplies
	 		}   
	    };
	case 'frequency':
		let frequencyResponse = name+" new frequency was set succesfuly 🙂 thanks";
		let frequencyReplies = [{
	        "content_type": "text",
	        "title": "Menu",
	        "payload": "Menu",
	    }];
	    return {
	 		text: [],
	 		quick: {
	 			text: frequencyResponse,
	 			reply: frequencyReplies
	 		}   
	    };
     case "input.unknown": 
     	let responseText2 = "Sorry. I am a young WaterBot and still learning. Type Start to get our menu";
		return {
	 		text: [responseText2],
	 		quick: null   
	    };
    default:
      return null;
  }
}