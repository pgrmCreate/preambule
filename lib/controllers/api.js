'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Preambule = mongoose.model('Preambule'),
    SuitePreambule = mongoose.model('SuitePreambule');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
    return Thing.find(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};


exports.preambuleLoad = function(req, res) {
    return Preambule.find({}).sort({}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

exports.preambuleLoadMostComment = function(req, res) {
    if(req.query.tags) {
        console.log("SEARCH WITH TAG <"+req.query.tags+">");
        return Preambule.find({ 'tags' : { $in :  req.query.tags} }).sort('-commentaires_size')
            .exec(function (err, things) {
                if (!err) {
                    return res.json(things);
                } else {
                    return res.send(err);
                }
            });
    }
    else {
        return Preambule.find({}).sort('-commentaires_size').exec(function (err, things) {
            if (!err) {
                return res.json(things);
            } else {
                return res.send(err);
            }
        });
    }
};

exports.preambuleLoadComment = function(req, res) {
    return Preambule.find({}).sort({titre: -1}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

exports.createPreambule = function(req, res) {
    var newPreambule = new Preambule(req.body);
    var dt = new Date();

    var datePicked = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    newPreambule.date = datePicked;

    console.log("ADD PREAMBULE :");
    console.log(newPreambule);



    newPreambule.save(function(err,room) {
        var id = room._id;
        res.json({id : id});
    });
};

exports.updatePreambule = function(req, res) {
    var updatePreambule = new Preambule(req.body);

    console.log("UPDATE ENGINE PROCESS..");
    console.log(updatePreambule.id);

    Preambule.findOne({ _id: updatePreambule.id },
        function (err, doc){
            console.log("#1 FOUND MODEL");
            doc.commentaires = updatePreambule.commentaires;
            doc.commentaires_size = updatePreambule.commentaires.length;
            doc.votes = updatePreambule.votes;
            doc.save();
        });
};

exports.createSuitePreambule = function (req, res) {
    var newPreambuleSuite = new SuitePreambule(req.body);

    newPreambuleSuite.save(function(err, model) {
        res.json(model);
    });
};

exports.preambuleSuiteLoad = function(req, res) {
    return SuitePreambule.find({}).sort({}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

