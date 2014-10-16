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
    auteur: String,
    tags: [String],
    votes : [],
    commentaires : [{"authorMail" : String,
        "content" : String}],
    commentaires_size : Number,
    date : String
});

/**
 * Validations
 */

mongoose.model('SuitePreambule', SuitePreambuleSchema);

