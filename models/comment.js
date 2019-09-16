var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var uniqeValidator = require('mongoose-unique-validator');



var TimeSchema = mongoose.model('Comment',new Schema({

	creationDate:{
		type: Date,
		required:true,
		default: Date.now()
	},
	author:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	post:{
		type:Schema.Types.ObjectId,
		ref:'Post',
		index: true
	},
	content:{
		type:String,
		required:true
	}
	
}))
;

module.exports = TimeSchema;