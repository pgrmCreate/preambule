'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Preambule = mongoose.model('Preambule'),
    User = mongoose.model('User'),
    SuitePreambule = mongoose.model('SuitePreambule');

var ObjectId = require('mongoose').Types.ObjectId;

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
    Thing.find(function (err, things) {
        if (!err) {
            res.json(things);
        } else {
            res.send(err);
        }
    });
};

exports.hisPreambuleLoad = function(req, res) {
    return Preambule.find({'auteur.name' : req.query.auteurName}).sort({'_id': -1}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

exports.preambuleLoad = function(req, res) {
    // ADD SORT BY DATE
    var filters = JSON.parse(req.query.filters);
    console.log(filters);
    var maxLoad = 0;
    var include_filter_tags = {};
    var include_filter_date = {};
    var include_filter_classement = {};
    var include_filter_allFind = {};

    if(req.query.maxLoad) {
        maxLoad = req.query.maxLoad;
    }

    // INITIALISATION TAGS ARRAY
    var array_tags = [];
    if(filters.tags && filters.tags.length > 0) {
        console.log(filters.tags.length);
        if(filters.tags.length > 1) {
            array_tags = filters.tags;

        }
        else {
            array_tags.push(filters.tags);
        }

        include_filter_tags = {"tags" : { $in :  array_tags} };
        var regexp = new RegExp("^" + array_tags.join("|"), "i");
        include_filter_tags = {"$or" : [
            {"tags" : regexp },
            {"auteur.name" : regexp },
            {"titre" : regexp } ]};
    }

    // INITIALISATION DATE
    if(filters.date) {
        var date_now = new Date();
        var hour = date_now.getHours();
        var min = date_now.getMinutes();
        var month = date_now.getMonth()+1;
        var day = date_now.getDate();
        var year = date_now.getFullYear();

        if(filters.date === "todayActivity") {
            include_filter_date = { date : { $lt: new Date(),
                $gt: new Date(year+','+month+','+day) } };
        }
        else if(filters.date === "monthActivity") {
            include_filter_date = { date : { $lt: new Date(),
                $gt: new Date(year+','+month-1+','+(day)) } };
        }
    }


    // INITIALISATION CLASSEMENT
    if(filters.classement === "lastActivity") {
        include_filter_classement = {'date_lastActivity': -1};
    }
    else if(filters.classement === "mostRecent") {
        include_filter_classement = {'_id': -1};
    }
    else if(filters.classement === "mostComment") {
        include_filter_classement = {'commentaires_size': -1};
    }
    else if(filters.classement === "mostPopular") {
        include_filter_classement = {'votes_size': -1};
    }
    else if(filters.classement === "mostRead") {
        include_filter_classement = {'lectureNb': -1};
    }

    /// INITIALISE TAGS AND DATE FILTER
    if(filters.tags.length < 1 && filters.date === "mostRecent") {
        include_filter_allFind = {};
    }
    else if(filters.tags.length > 0 && filters.date === "mostRecent") {
        include_filter_allFind = include_filter_tags;
    }
    else if(filters.tags.length < 1 && filters.date !== "mostRecent") {
        include_filter_allFind = include_filter_date;
    }
    else if(filters.tags.length > 0 && filters.date !== "mostRecent") {
        include_filter_allFind = { $and : [
            include_filter_tags, include_filter_date ]};
    }

    /// INITIALISE CATEGORIE FILTER
    if(filters.categorie !== '0') {
        console.log("Filter categorie!");
        console.log(include_filter_allFind.length);
        if(isEmptyObject(include_filter_allFind)) {
            console.log("RIEN!!!!!!!!!");
            console.log(include_filter_allFind);
            include_filter_allFind = {'categorie' : filters.categorie};
        }
        else {
            console.log("PUSH MODE");
            console.log(include_filter_allFind);
            if(isEmptyObject(include_filter_allFind.$and) && !isEmptyObject(include_filter_allFind.date))
            {
                console.log("PUSH MODE SPECIALE");
                include_filter_allFind. categorie = filters.categorie;
            }
            else {
                include_filter_allFind.$and.push({'categorie' : filters.categorie});

            }
        }
    }

    console.log("filter");
    console.log(maxLoad);
    console.log(include_filter_allFind);
    // LAUNCH REQUEST
    return Preambule.find(include_filter_allFind).skip(maxLoad).limit(12).sort(include_filter_classement).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};



exports.myPreambuleLoad = function(req, res) {
    // ADD SORT BY DATE
    return Preambule.find({'auteur.name' : req.user.userInfo.name}).sort({'_id': -1}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

exports.OnePreambuleLoad = function(req, res) {
    // ADD SORT BY DATE
    console.log(req.query);
    return Preambule.find({'_id' : req.query.id}).sort({'_id': -1}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};


exports.createPreambule = function(req, res) {
    var newPreambule = new Preambule(req.body);
    console.log("#1");
    console.log(req.body);
    var datePicked = new Date();
    newPreambule.date = datePicked;
    newPreambule.date_lastActivity = datePicked;
    console.log("AUTHOR IMAGE :");
    console.log(req.user.userInfoExtend);
    newPreambule.auteur = {
        'name' : req.user.userInfoExtend.author_name,
        '_id' : req.user.userInfoExtend.id,
        'image_user' : req.user.userInfoExtend.image_user
    };

    console.log("BEFORE SAVE :");
    console.log(newPreambule);
    newPreambule.save(function(err,response) {
        if(err) {
            res.send(err);
        }
        else {
            var id = response._id;
            res.json({id : id});
        }
    });
};

exports.updatePreambule = function(req, res) {
    var updatePreambule = new Preambule(req.body);

    Preambule.findOne({ _id: updatePreambule.id },
        function (err, doc){
            console.log("#1 FOUND MODEL");
            doc.commentaires = updatePreambule.commentaires;
            doc.content = updatePreambule.content;
            doc.titre = updatePreambule.titre;
            doc.commentaires_size = updatePreambule.commentaires.length;
            doc.votes = updatePreambule.votes;
            doc.votes_size = updatePreambule.votes_size;
            doc.lectureNb = updatePreambule.lectureNb;
            if(req.body.updateTimeActivity === true) {
                doc.date_lastActivity = new Date();
            }
            doc.save();
            res.send("okedit");
        });
};

exports.updatePreambuleSuite = function(req, res) {
    var updatePreambule = new Preambule(req.body);

    SuitePreambule.findOne({ _id: updatePreambule.id },
        function (err, doc){
            console.log("#1 FOUND MODEL");
            doc.commentaires = updatePreambule.commentaires;
            doc.content = updatePreambule.content;
            doc.titre = updatePreambule.titre;
            doc.commentaires_size = updatePreambule.commentaires.length;
            doc.votes = updatePreambule.votes;
            doc.votes_size = updatePreambule.votes_size;
            doc.lectureNb = updatePreambule.lectureNb;
            if(req.body.updateTimeActivity === true) {
                doc.date_lastActivity = new Date();
            }
            doc.save();
            res.send("okedit");
        });
};

exports.deletePreambule = function (req, res) {
    console.log("READY");
    console.log(req.body._id);

    Preambule.remove({ _id: req.body._id }, function(err) {
        if (!err) {
            console.log("DELETE WIHOUT ERROR FOR");
            console.log(req.body._id);
            res.send("finished delete");
        }
        else {
        }
    });
};

exports.createSuitePreambule = function (req, res) {
    var initPreambule = req.body;
    initPreambule._id = null;
    var newPreambuleSuite = new SuitePreambule(req.body);

    newPreambuleSuite.save(function(err, model) {
        console.log("SUITE CREATED");

        if (!err) {
            return res.send("good");
        } else {
            console.log("ERROR");
            console.log(err);
            return res.send(err);
        }
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

exports.hisPreambuleSuiteLoad = function(req, res) {
    return SuitePreambule.find({'auteur._id' : req.query.id}).sort({}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};

exports.preambuleSuiteLoadOne = function(req, res) {
    return SuitePreambule.find({'_id' : req.query.id}).sort({}).exec(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};


exports.findUserById = function(req, res) {
    // ADD SORT BY DATE
    console.log(req.query.id);
    return User.find({'_id' : req.query.id}).sort({}).exec(function (err, User) {
        if (!err) {
            return res.json(User);
        } else {
            return res.send(err);
        }
    });
};

exports.deleteProfil = function (req, res) {
    User.findById(req.user.userInfoExtend.id, function (err, user) {
        if(user.authenticate(req.body.mdp)) {
            Preambule.remove({'auteur._id' : req.user.userInfoExtend.id}).exec(function (err, out) {
            });

            res.send("GOOD");
        } else {
            res.send("BAD");
        }
    });
};

exports.deleteUser = function(req, res) {
    User.remove({'_id' : req.body.id}).exec(function (err, out) {
        res.send("end");
    });

};

