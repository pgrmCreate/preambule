'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');
var    bodyParser = require('body-parser');

var aws = require('aws-sdk');
var AWS_ACCESS_KEY = "AKIAIFPILDVGSVDUXLAQ";
var AWS_SECRET_KEY = "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";
var S3_BUCKET = "preambule";
/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
//var db = mongoose.connect("mongodb://jb:pass@kahana.mongohq.com:10010/preambule", config.mongo.options);
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

app.get('/getDateNow', function (req, res) {
    res.write(JSON.stringify(new Date().getTime()));
    res.end();
});

//UPLOAD PREAMBULE IMAGE
app.get('/sign_s3', function(req, res) {
    console.log("GO TO /sign_s3");
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var targetPicked = "users/"+req.query.s3_object_name;

    var s3_params = {
        Bucket: S3_BUCKET,
        Key: targetPicked,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3_params, function(err, data) {
        console.log("TRY TO PUT IMAGE");
        if(err){
            console.log("ERROR :"+err);
        }
        else{
            console.log("UPLOAD WORKING for "+req.query.s3_object_name);
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+"users/"+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            console.log(return_data);
            res.end();
        }
    });
});

//UPLOAD ACCOUNT USER IMAGE
app.get('/sign_s3_account', function(req, res) {
    console.log("GO TO /sign_s3 account");
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var targetPicked = "accounts/"+req.query.s3_object_name;

    var s3_params = {
        Bucket: S3_BUCKET,
        Key: targetPicked,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3_params, function(err, data) {
        console.log("TRY TO PUT IMAGE");
        if(err){
            console.log("ERROR :"+err);
        }
        else{
            console.log("UPLOAD WORKING for "+req.query.s3_object_name);
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+"accounts/"+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            console.log(return_data);
            res.end();
        }
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
