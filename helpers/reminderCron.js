const cron = require('cron');
const BotController = require('../controllers/BotController');
const UserController = require('../controllers/UserController');
const ReminderController = require('../controllers/ReminderController');

module.exports = new cron.CronJob({
	 cronTime: '0 */6 * * *',
	 onTick: async function() {
	    const Bot = new BotController();
	    const User = new UserController();
	    const Reminder = new ReminderController();
	    const latest = await Reminder.getLatestReminder();
	    const usersForReminders = await User.getAllUsersForReminder();
	    const photoUrl = "https://ds055uzetaobb.cloudfront.net/image_optimizer/ef2031b0a48ae73a5a6c56dba30f917643e7ef1c.gif";
		var d = new Date();

	    const reminders = usersForReminders.map( async user => {
	    	let range = 0;
			let message = "";

	    	if (d.getHours() > 5 && d.getHours() < 12) {
				message = 'Good morning '+user.userFirst+' time for your morning drink';
				range = 2;
	    	}else if(d.getHours() > 11 && d.getHours() < 18) {
				message = 'Good day '+user.userFirst+' time for your mid day drink';
				range = 1;
	    	}else if(d.getHours() > 17 && d.getHours() < 23){
				message = 'Good evening '+user.userFirst+' time for your evening drink';
				range = 3;
	    	}

			if (range <= user.rate) {
				await Bot.sendImageMessage(user.userId, photoUrl);
				if (latest) {
					await Bot.sendQuickReply(user.userId, latest.text, latest.replies);
				}else{
					await Bot.sendTextMessage(user.userId, message);
				}
				
			};
	    	
	    });

	    await Promise.all(reminders);

	 },
	 start: false,
	 timeZone: 'Europe/Belgrade'
});