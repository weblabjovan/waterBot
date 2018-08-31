const mongoose = require('mongoose');
const { Schema } = mongoose;

const reminderSchema = new Schema({
	text: {type: String, required: true},
	replies: { type: Array , "default" : [] },
	activatedAt: {type: Number, required:  true}
});


const Reminder = mongoose.model('reminders', reminderSchema);

module.exports = Reminder;