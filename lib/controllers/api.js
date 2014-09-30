'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Preambule = mongoose.model('Preambule');

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
    return Preambule.find(function (err, things) {
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
        doc.save();
    });
};
