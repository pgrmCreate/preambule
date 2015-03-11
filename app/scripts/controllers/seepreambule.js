'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:SeepreambuleCtrl
 * @description
 * # SeepreambuleCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
    .controller('SeepreambuleCtrl', function ($scope, $http, $location, $rootScope, $timeout) {


        var id_select = $location.path().split('/')[2];


        $http({
            url: '/api/OnePreambuleLoad',
            method: 'GET',
            params: {
                id : id_select
            }
        }).success(function(reply) {
            var allPreambuleLoaded = reply.allDocs;
            var allUsers = reply.allUsers;
            for(var i=0 ; i < allUsers.length ; i++) {
                for(var i2=0 ; i2 < allPreambuleLoaded.length ; i2++) {
                    if(allUsers[i]._id === allPreambuleLoaded[i2].auteur._id) {
                        allPreambuleLoaded[i2].auteur.name = allUsers[i].author_name;

                    }
                }
            }
            $scope.preambule_select = allPreambuleLoaded[0];
        });

        $scope.edit_preambule_active = function () {
            $http.post('/api/updatePreambule', $scope.preambule_select)
                .success(function(reply) {
                    Notifier.success('Le préambule a bien été edité.', 'Mise a jour');
                });
        };

        $scope.deletePreambule = function () {
            $http.post('/api/deletePreambule', $scope.preambule_select)
                .success(function(reply) {
                    $location.path("/");
                });
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
                    $http.post('/api/updatePreambule', preambulePicked)
                        .success(function(reply) {
                        });
                }
            }
        };

    });
