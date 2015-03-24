'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function(err) {
        if (err) return res.json(400, err);

        req.logIn(newUser, function(err) {
            if (err) return next(err);

            return res.json(req.user.userInfo);
        });
    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);

        res.send({ profile: user.profile });
    });
};

/**
 *  Get profile of specified user
 */
exports.update = function (req, res, next) {
    var user_input = req.body.user;
    delete user_input._id;

    User.update({email: user_input.email}, user_input, {upsert: true}, function (err) {
        if(!err) {
            res.send("Finished");
        }
        else {
            res.send(err);
        }
    });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return res.send(400);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

exports.findUserByEmailOrCreate = function(req, res, next) {
    var input_facebook = req.body.input_facebook;

//    var input_name = input_facebook.first_name + " " + input_facebook.last_name;
//    var newUserData = {name : input_name, email : input_facebook.email, hashedPassword : "nopassword"};
//    var newUser = new User(newUserData);

    console.log("I search ....");
    console.log(input_facebook.email);

    User.find({email : input_facebook.email}).sort({}).exec(function (err, User) {
        if (!err) {
            if(User[0]) {
                res.send('userexist');
            }
            else {
                res.send('nouserexist');
            }
        } else {
            console.log("Error searching..");
            res.send('bad');
        }
    });


};

/**
 * Get current user
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};