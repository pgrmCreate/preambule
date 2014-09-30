'use strict';

angular.module('preambuleApp')
    .controller('MainCtrl', function ($scope, $http, $rootScope, Auth) {
        $http.get('/api/awesomeThings').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });

        $scope.preambuleSelect = [];

        $http.get('/api/preambuleLoad').success(function(reply) {
            for(var i=0 ; i < reply.length ; i++ ) {
                reply[i].displayWrapper = false;
            }
            $scope.preambules = reply;
        });

        $scope.login_open_window = function () {
            $scope.display_login = true;
            $scope.display_modal = true;
        };

        $scope.display_preambule = function (preambule) {
            $scope.preambuleSelect = preambule;
            $scope.show_preambule = true;
        }

        $scope.addComment = function (preambulePicked) {
            var pseudo = $rootScope.currentUser.name;


            preambulePicked.commentaires.push({
                "authorMail" : pseudo,
                "content" : $scope.newComment
            });

            $scope.newComment = '';
            $('#zoneComment').blur();

            $http.post('/api/updatePreambule', preambulePicked)
                .success(function(reply) {

            });
        }


    });

