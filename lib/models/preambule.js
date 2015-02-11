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
    auteur: {
        "_id" : String,
        "name" : String,
        "image_user" : String
    },
    tags: [String],
    votes : [String],
    votes_size : Number,
    commentaires : [{"authorMail" : String,
    "content" : String}],
    commentaires_size : Number,
    date : Date,
    date_lastActivity : Date,
    photo : String,
    lectureNb : Number,
    categorie : [String]
});

/**
 * Validations
 */

mongoose.model('Preambule', PreambuleSchema);
