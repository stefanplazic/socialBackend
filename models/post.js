var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Post', new Schema({

	creationDate: {
		type: Date,
		required: true,
		default: Date.now()
	},

	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	filePath: {
		type: String,
		required: true
	},
	isDeleted: {
		type: Boolean,
		required: true,
		default: false
	},
	likeNum: {
		type: Number,
		required: true,
		default: 0
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],

}));