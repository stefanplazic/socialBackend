var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Tag', new Schema({

    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    name: {
        type: String,
        required: true,
        index: true
    },
    postsNum: {
        type: Number,
        required: true,
        default: 1
    }

})
);