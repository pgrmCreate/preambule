'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Preambule Schema
 */
var SuitePreambuleSchema = new Schema({
    sourcePreambule : String,
    contentSuite: String,
    author_suite : String,

    titre: String,
    description: String,
    content: String,
    auteur: {
        "_id" : String,
        "name" : String,
        "image_user" : String
    },
    tags: [String],
    votes : [],
    votes_size : Number,
    commentaires : [{"authorMail" : String,
        "content" : String}],
    commentaires_size : Number,
    date : Date,
    date_lastActivity : Date,
    photo : String,
    lectureNb : Number
});

/**
 * Validations
 */

mongoose.model('SuitePreambule', SuitePreambuleSchema);

