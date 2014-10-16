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

    app.route('/api/preambuleSuiteLoad')
        .get(api.preambuleSuiteLoad);

        // Server API Routes
    app.route('/api/preambuleLoadMostComment')
        .get(api.preambuleLoadMostComment);

    // Server API Routes
    app.route('/api/createPreambule')
        .post(api.createPreambule);

    app.route('/api/createSuitePreambule')
        .post(api.createSuitePreambule);

        // Server API Routes
    app.route('/api/updatePreambule')
        .post(api.updatePreambule);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

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