var mongoose = require('mongoose');

var answerSchema = mongoose.Schema({
	answerer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	question: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
    upvoters: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    downvoters: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
	answererName: String,
  	text: String,
  	time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);