var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var uniqeValidator = require('mongoose-unique-validator');

function toLower(v) {
	return v.toLowerCase();
}

var UserSchema = mongoose.model('User', new Schema({
	username: {
		type: String,
		required: "Please enter the name",
		unique: true,
		set: toLower,
		index: true
	},
	password: {
		type: String,
		required: "Please give us the password"
	},
	salt: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: "Please provide us the email",
		unique: true,
		validate: [validator.isEmail, 'wrong email format'],
		set: toLower,
		index: true
	},

	registrationDate: {
		type: Date,
		required: true,
		default: Date.now()
	},
	avatar: {
		type: String,
		required: true,
		default: 'profile.png'
	},
	followers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	following: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	verified: {
		type: Boolean,
		default: false,
		required: true
	},
	verificationCode: {
		type: String,
		required: true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date


})
	.plugin(uniqeValidator, { message: '{VALUE} is already taken.' }));

module.exports = UserSchema;