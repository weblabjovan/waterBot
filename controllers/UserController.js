const User = require('../models/User');

class UserController{
	constructor() {
		this.user = User;
	}

	async newUser(userData) {
		const user = new User({
			userId: userData.id,
			userFirst: userData.first_name,
			userLast: userData.last_name,
			userPhoto: userData.profile_pic,
			reminder: false,
			rate: 0,
			activatedAt: Date.now()
		});

		return user;
	}

	async findUser(userId){
		const user = await this.user.findOne({userId});

		return user;
	}

	async getAllUsersForReminder() {
		const users = await this.user.find({reminder: true});

		return users;
	}

	async getAllUsers() {
		const userIds = await this.user.find({}).select('userId');
		return userIds;
	}

	async changeReminder(userId, reminder, rate) {
		await this.user.findOneAndUpdate(
			{userId},
			{$set: {reminder, rate}}
		)
	}
}

module.exports = UserController;