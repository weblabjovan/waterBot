const ReminderController = require('../controllers/ReminderController');
const makeReplyObject = require('../helpers/makeReplyObject')

module.exports = app => {

	app.post("/reminders", async (req, res) => {
		if (req.body.reminder && req.body.qr1 && req.body.qr2 && req.body.qr3 && req.body.qr4) {
			const Reminder = new ReminderController();
			const latest = await Reminder.getLatestReminder();
			const replies = [
				makeReplyObject(req.body.qr1),
				makeReplyObject(req.body.qr2),
				makeReplyObject(req.body.qr3),
				makeReplyObject(req.body.qr4)
			];

			if (latest) {
				await Reminder.updateReminder(latest._id, {text: req.body.reminder});
			}else{
				const newReminder = await Reminder.newReminder({text: req.body.reminder, replies});
				newReminder.save();
			}
			res.sendStatus(200).json('Reminder changed');
		}else{
			res.sendStatus(500).json('There was not full reminder data');
		}
	    
	});
}