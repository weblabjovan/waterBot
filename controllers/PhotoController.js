const cloudinary = require('cloudinary');
const config = require('../config/config');
cloudinary.config({ 
  cloud_name: config.CLOUDINARY_NAME, 
  api_key: config.CLOUDINARY_API_KEY, 
  api_secret: config.CLOUDINARY_API_SECRET 
});

class PhotoController{
	constructor() {
		this.cloudinary = cloudinary;
	}

	async storeAndRound(image){
		const upload = await this.uploadImage(image);

		return upload.secure_url;

	}

	async uploadImage(image) {
		return this.cloudinary.v2.uploader.upload( image, {width: 300, height: 300, gravity: "face", radius: "max", crop: "crop"});
	}


}

module.exports = PhotoController;