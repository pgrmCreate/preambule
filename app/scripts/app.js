'use strict';

angular.module('preambuleApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'angularFileUpload'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main',
                controller: 'MainCtrl'
            })
            .when('/comment', {
                templateUrl: 'partials/main',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .when('/connectFacebook', {
                templateUrl: 'partials/modules/connect_facebook',
                controller: 'SignupCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
                authenticate: true
            })
            .when('/preambules', {
                templateUrl: '/pages/preambules.html',
                controller: 'PreambulesCtrl'
            })
            .when('/auteurs', {
                templateUrl: '/pages/auteurs.html',
                controller: 'AuteursCtrl'
            })
            .when('/bibliotheque', {
                templateUrl: '/pages/bibliotheque.html',
                controller: 'BibliothequeCtrl'
            })
            .when('/partials/modules/connect_facebook', {
              templateUrl: 'views/partials/modules/connect_facebook.html',
              controller: 'PartialsModulesConnectFacebookCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'responseError': function(response) {
                    if(response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, Auth) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });

    });