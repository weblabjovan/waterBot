const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	userId: {type: Number, required: true},
	userFirst: {type: String, required: true},
	userLast: {type: String, required: true},
	userPhoto: {type: String, required: true},
	reminder: {type: Boolean, required: true},
	rate: {type: Number, required: true},
	activatedAt: {type: Number, required:  true}
});


const User = mongoose.model('users', userSchema);

module.exports = User;