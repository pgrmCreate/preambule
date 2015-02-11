'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:SeeprofilCtrl
 * @description
 * # SeeprofilCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('SeeprofilCtrl', function ($scope, $http, $location, $route, $rootScope) {

        var id_select = $location.path().split('/')[2];

        $http({
            url: '/api/hisPreambuleSuiteLoad',
            method: 'GET',
            params: {
                id : id_select
            }
        }).success(function(reply) {
            $scope.preambules_suite = reply;
        });

        $http({
            url: '/api/findUserById',
            method: 'GET',
            params: {
                id : id_select
            }
        }).success(function(reply) {
            $scope.user_select = reply[0];
            console.log("Begin load :");
            console.log(reply[0].name);
            $http({
                url: '/api/hisPreambuleLoad',
                method: 'GET',
                params: {
                    auteurName : reply[0].name
                }
            }).success(function(reply) {
                for(var i=0 ; i < reply.length ; i++ ) {
                    reply[i].displayWrapper = false;
                }
                $scope.preambules = reply;
            });
        });


//        INCLUDE MAIN
            $scope.login_open_window = function () {
                $rootScope.display_login = true;
                $rootScope.display_modal = true;
            };

            $scope.display_preambule = function (preambule) {
                $scope.preambuleSelect = preambule;
                $rootScope.show_preambule = true;
                $rootScope.bodyLock = true;
                $scope.preambuleSelect.lectureNb ++;
                $http.post('/api/updatePreambule', $scope.preambuleSelect)
                    .success(function(reply) {
                    });

                $location.path('/seepreambule/'+preambule._id, false);
            };



            $scope.show_preambuleDetails = function () {
                $scope.$apply(function () {
                    $rootScope.show_preambule = false;
                });
            };

            $scope.voteTry = function (preambulePicked) {
                if(!$rootScope.currentUser) {
                    $rootScope.show_preambule = false;
                    $rootScope.display_login = true;
                    $rootScope.display_modal = true;

                }
                else {
                    preambulePicked.votes.push("LOL");
                    preambulePicked.votes_size++;
                    preambulePicked.updateTimeActivity = true;
                    console.log("ADD :");
                    console.log(preambulePicked);
                    $http.post('/api/updatePreambule', preambulePicked)
                        .success(function(reply) {
                        });
                }
            };

            $rootScope.log = function(variable) {
                console.log(variable);
            };

            $scope.preambuleSuiteSave = function(newSuite, sourcePreambule) {
                var sendData = sourcePreambule;
                sendData.contentSuite = newSuite.contentSuite;
                sendData.author_suite = $rootScope.currentUser.name;
                $http.post('/api/createSuitePreambule', sendData).success(function(reply) {
                    $route.reload();
                });
            };

            $scope.close_preambule = function () {
                $rootScope.show_preambule=false;
                $rootScope.bodyLock=false;
//                $location.path('/', false);
            };

            $scope.open_randomPreambule = function () {
                var id_select = Math.floor((Math.random() *
                    $scope.preambules.length) + 0);
                $scope.display_preambule($scope.preambules[id_select]);
            };



    });
