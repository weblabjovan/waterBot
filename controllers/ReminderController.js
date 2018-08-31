const Reminder = require('../models/Reminder');

class ReminderController{
	constructor() {
		this.reminder = Reminder;
	}

	async newReminder(remData) {
		const reminder = new Reminder({
			text: remData.text,
			replies: remData.replies,
			activatedAt: Date.now()
		});

		return reminder;
	}

	async updateReminder(id, data){
		await this.reminder.findOneAndUpdate(
			{_id: id},
			{$set: {text: data.text, replies:data.replies}}
		);
	}

	async getLatestReminder() {
		const reminder = await this.reminder.findOne().sort({created_at: -1});

		return reminder;
	}
}

module.exports = ReminderController;