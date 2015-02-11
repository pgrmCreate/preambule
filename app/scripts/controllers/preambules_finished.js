'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:PreambulesFinishedCtrl
 * @description
 * # PreambulesFinishedCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('PreambulesFinishedCtrl', function ($scope, $http, $rootScope, $location) {
        $http.get('/api/preambuleSuiteLoad').success(function(reply) {
            $scope.preambules = reply;
        });

        $scope.close_preambule = function () {
            $rootScope.show_preambule=false;
            $rootScope.bodyLock=false;
            $location.path('/', false);
        };

        $scope.show_preambuleDetails = function () {
            $scope.$apply(function () {
                $rootScope.show_preambule = false;
            });
        };

        $scope.open_randomPreambule = function () {
            var id_select = Math.floor((Math.random() *
                $scope.preambules.length) + 0);
            $scope.display_preambule($scope.preambules[id_select], id_select);
        };

        $scope.voteTry = function (preambulePicked) {

            if(!$rootScope.currentUser) {
                $rootScope.show_preambule = false;
                $rootScope.display_login = true;
                $rootScope.display_modal = true;

            }
            else {
                var found = $.inArray($rootScope.currentUser.name, preambulePicked.votes) > -1;

                if(found === true && $scope.notifer_warningVote !== true) {
                    $scope.notifer_warningVote = true;
                    $timeout(function () {
                        $scope.notifer_warningVote = false;
                    }, 4000);
                    Notifier.warning('Vous nous pouvez voter plusieurs fois le meme article',
                        'Vote non accepté');
                }
                else if(found === false) {
                    preambulePicked.votes.push($rootScope.currentUser.name);
                    preambulePicked.votes_size++;
                    preambulePicked.updateTimeActivity = true;
                    console.log("ADD :");
                    console.log(preambulePicked);
                    $http.post('/api/updatePreambuleSuite', preambulePicked)
                        .success(function(reply) {
                        });
                }
            }
        };

        $scope.display_preambule = function (preambule, index) {
            console.log(preambule.titre);
            $scope.preambuleSelect = preambule;
            console.log("index selected :");
            console.log(index);
            $scope.preambuleSelect.selectedIndex = index;
            $rootScope.show_preambule = true;
            $rootScope.bodyLock = true;
            $scope.preambuleSelect.lectureNb++;
            $http.post('/api/updatePreambuleSuite', $scope.preambuleSelect)
                .success(function(reply) {
                });

            $location.path('/seepreambule/'+preambule._id, false);
        };

    });
