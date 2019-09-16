var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Notification', new Schema({

    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    },
    notificationType: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        required: true,
        default: false
    }

}));