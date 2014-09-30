'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Preambule Schema
 */
var PreambuleSchema = new Schema({
    titre: String,
    description: String,
    content: String,
    auteur: String,
    tags: [String],
    votes : [],
    commentaires : [{"authorMail" : String,
    "content" : String}],
    date : String
});

/**
 * Validations
 */

mongoose.model('Preambule', PreambuleSchema);
