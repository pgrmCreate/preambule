'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:EcrireCtrl
 * @description
 * # EcrireCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
    .controller('BibliothequeCtrl', function ($scope, $http) {
        $scope.histoires = [];

        for(var i=0 ; i < 5 ; i++) {

            $scope.histoires.push(
                {
                    'title' : 'Terre de feu',
                    'author_preambule' : 'Guy Ritchie',
                    'author_suite' : 'Frederic Chabon',
                    'date' : "21 juin 2013",
                    'tags' : ['horreur', 'enfant', 'drole', 'ciel']
                });
        }

        $http.get('/api/preambuleSuiteLoad').success(function(reply) {
            console.log("LOADING SUITE..");
            console.log(reply);
            $scope.SuitesPreambules = reply;
        });

    });
