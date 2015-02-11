'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {



  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);

    // Server API Routes
    app.route('/api/preambuleLoad')
        .get(api.preambuleLoad);

    app.route('/api/hisPreambuleLoad')
        .get(api.hisPreambuleLoad);

    app.route('/api/findUserById')
        .get(api.findUserById);

    app.route('/api/myPreambuleLoad')
        .get(api.myPreambuleLoad);

    app.route('/api/OnePreambuleLoad')
        .get(api.OnePreambuleLoad);

    app.route('/api/preambuleSuiteLoad')
        .get(api.preambuleSuiteLoad);

    app.route('/api/hisPreambuleSuiteLoad')
        .get(api.hisPreambuleSuiteLoad);

    app.route('/api/preambuleSuiteLoadOne')
        .get(api.preambuleSuiteLoadOne);

    // Server API Routes
    app.route('/api/createPreambule')
        .post(api.createPreambule);

    app.route('/api/createSuitePreambule')
        .post(api.createSuitePreambule);

    app.route('/api/deletePreambule')
        .post(api.deletePreambule);

    app.route('/api/deleteProfil')
        .post(api.deleteProfil);

    app.route('/api/deleteUser')
        .post(api.deleteUser);

        // Server API Routes
    app.route('/api/updatePreambule')
        .post(api.updatePreambule);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);

  app.route('/api/users/me')
    .get(users.me);

    app.route('/api/users/findUserByEmailOrCreate')
    .post(users.findUserByEmailOrCreate);

  app.route('/api/users/:id')
    .get(users.show);

    app.route('/api/users/update')
    .put(users.update);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/pages/*')
    .get(index.partials);
    app.route('/*')
        .get( middleware.setUserCookie, index.index);
};