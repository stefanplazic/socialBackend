var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Like', new Schema({

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
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }

}));