'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');
var    bodyParser = require('body-parser');


/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var busboy = require('connect-busboy');
//var db = mongoose.connect(config.mongo.uri, config.mongo.options);
var db = mongoose.connect("mongodb://localhost/preambule", config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
//UPLOAD FILE
app.use(busboy());

app.post('/upload', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("successfull upload!");
        var stringChaine = 'app/images/users/'+filename;
        var fstream = fs.createWriteStream(stringChaine);

        file.pipe(fstream);
        fstream.on('close', function () {

            console.log("Upload Finished of " + filename);
            res.send("THX");

        });
    });
});
require('./lib/config/express')(app);
require('./lib/routes')(app);

// Start server
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
