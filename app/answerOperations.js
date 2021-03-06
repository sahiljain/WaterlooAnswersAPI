var Question = require('../models/question');
var Answer = require('../models/answer');
var _ = require('lodash');
var tokenUtils = require('../utils/tokenutils');
var Constants = require('../constants');

module.exports = function () {

    var postAnswer = function (req, res) {

        var questionId = req.body.questionId;
        if (_.isEmpty(questionId)) {
            res.status(400).json({error: Constants.ERROR.MISSING.QUESTION_ID});
            return;
        }

        var text = req.body.answerBody;
        if (_.isEmpty(text)) {
            res.status(400).json({error: Constants.ERROR.MISSING.ANSWER_BODY});
            return;
        }

        var token = req.body.token;
        if (_.isEmpty(token)) {
            res.status(400).json({error: Constants.ERROR.MISSING.TOKEN});
            return;
        }

        tokenUtils.getUserFromToken(token, function (err, doc) { //TODO-sahil there's currently a link between question->answer and answer->question, make it one way
            if (err || !doc) {
                return res.status(401).json({error: Constants.ERROR.INVALID.TOKEN});
            } else {
                var ans = new Answer({answerer: doc._id, question: questionId, answererName: doc.firstName, text: text});
                ans.save(function (err, answerSaved) {
                    if (err) {
                        return res.status(500).json({error: Constants.ERROR.SAVE.ANSWER});
                    } else {
                        Question.findById(questionId, function (err, question) {
                            if (err) {
                                res.status(500).json({error: Constants.ERROR.SAVE.ANSWER});
                            } else {
                                question.answers.push(answerSaved._id);
                                question.save();
                                Question.format(question, function (err, questionFormatted) {
                                    if (err) {
                                        return res.status(500).json({error: Constants.ERROR.SAVE.ANSWER});
                                    } else {
                                        return res.json({question: questionFormatted});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    return { postAnswer: postAnswer };
};
