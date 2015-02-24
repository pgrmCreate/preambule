'use strict';

(function() {
angular.module('preambuleApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate',
        'angularFileUpload',
        'angularMoment',
        'ui.bootstrap',
        'ngImgCrop'

    ])
    .run(function($rootScope, Facebook) {
        $rootScope.service_facebook = Facebook;

        $rootScope.isJsonEmpty = function(obj) {
            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        };
    })
    .filter('plus1', function($filter) {
        return function(input) {
            var dateNow = [];
            var pickedDate = [];
            var finalDate = "Date";
//            var pickedDate =  $filter('amDateFormat')(input, 'dddd, MMMM Do YYYY, h:mm:ss a');

            dateNow.month =     parseInt($filter('amDateFormat')(new Date(), 'M'));
            dateNow.day =       parseInt($filter('amDateFormat')(new Date(), 'D'));
            dateNow.hour =      parseInt($filter('amDateFormat')(new Date(), 'H'));
            dateNow.minute =    parseInt($filter('amDateFormat')(new Date(), 'mm'));

            pickedDate.month =  parseInt($filter('amDateFormat')(input, 'M'));
            pickedDate.day =    parseInt($filter('amDateFormat')(input, 'D'));
            pickedDate.hour =   parseInt($filter('amDateFormat')(input, 'H'));
            pickedDate.minute = parseInt($filter('amDateFormat')(input, 'mm'));

            // 48H +
            if(dateNow.month !== pickedDate.month ||
                dateNow.day-2 >= pickedDate.day) {
                finalDate = $filter('amDateFormat')(input, 'DD/MM/YYYY');
            }
            // DAY CHOOSE
            else if(dateNow.day === pickedDate.day+1) {
                finalDate = "Hier";
            }
            // HOUR SPECIFIQUE
            else if (dateNow.day === pickedDate.day &&
                dateNow.hour !== pickedDate.hour) {
                finalDate = (dateNow.hour-pickedDate.hour)+" h";
            }
            // MINUTE SPECIFIQUE
            else if (dateNow.day === pickedDate.day &&
                dateNow.hour === pickedDate.hour) {
                if(dateNow.minute === pickedDate.minute) {
                    finalDate = "1min";
                }
                else {
                    finalDate = (dateNow.minute-pickedDate.minute)+"min";
                }
            }

            return finalDate;
        };
    })
    .run(function(amMoment) {
        amMoment.changeLocale('de');
    })

    .factory('userFilter', function ($rootScope) {

        var service = {

            pickedFilter: {
                classement : 'lastActivity',
                date : 'firstActivity',
                categorie : '0',
                tags : []
            },


            save: function () {
                sessionStorage.userFilter = angular.toJson(service.pickedFilter);
            },

            load: function () {
                service.pickedFilter = angular.fromJson(sessionStorage.userFilter);
            }
        };

        $rootScope.$on("savestate", service.save);
        $rootScope.$on("restorestate", service.load);

        return service;
    })
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
                restrict: 'A',
                templateUrl: '/pages/bibliotheque.html',
                controller: 'BibliothequeCtrl'
            })
            .when('/partials/modules/connect_facebook', {
                templateUrl: 'views/partials/modules/connect_facebook.html',
                controller: 'PartialsModulesConnectFacebookCtrl'
            })
            .when('/profil', {
                templateUrl: '/pages/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/editPreambule', {
                templateUrl: '/pages/editPreambule.html',
                controller: 'EditpreambuleCtrl'
            })
            .when('/seeProfil/:idProfil', {
              templateUrl: '/pages/seeprofil.html',
              controller: 'SeeprofilCtrl'
            })
            .when('/seepreambule/:idPreambule', {
              templateUrl: '/pages/seepreambule.html',
              controller: 'SeepreambuleCtrl'
            })
            .when('/seebook/:idBook', {
              templateUrl: '/pages/seebook.html',
              controller: 'SeebookCtrl'
            })
            .when('/preambules_finished', {
              templateUrl: '/pages/preambules_finished.html',
              controller: 'PreambulesFinishedCtrl'
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
    .run(function ($rootScope, $location, Auth, $window, Facebook) {
            var width_block = window.innerWidth;
            var width_withoutRight = width_block - 270 - 30 - 20;
            var number_preambules_possible = Math.floor(width_withoutRight/270);
            width_withoutRight -=  number_preambules_possible * 4;
            var width_margin_picked = width_withoutRight - (270*number_preambules_possible);
            width_margin_picked /= 2;
            width_margin_picked += "px";


            $rootScope.dynamic_left = {'margin-left' : width_margin_picked};


//        console.log("### Choose ###");
//        console.log(5* (Math.floor((width_block - 270 - 30) / 270) -1 ) );

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });

        angular.element($window).bind('resize', function() {
            var width_block = window.innerWidth;
            var width_withoutRight = width_block - 270 - 30 - 20;
            var number_preambules_possible = Math.floor(width_withoutRight/270);
            width_withoutRight -=  number_preambules_possible * 5;
            var width_margin_picked = width_withoutRight - (270*number_preambules_possible);
            width_margin_picked /= 2;
            width_margin_picked += "px";


            $rootScope.$apply(function () {
                $rootScope.dynamic_left = {'margin-left' : width_margin_picked};
            });


        });

    })
    .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }]);
}
    .call(this));

