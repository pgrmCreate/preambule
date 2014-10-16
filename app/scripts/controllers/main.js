'use strict';

angular.module('preambuleApp')
    .controller('MainCtrl', function ($scope, $http, $rootScope, Auth, $location, $cookies) {
        if($cookies.tags)
            $scope.filter_tagsPicked = $cookies.tags;
        else
            $scope.filter_tagsPicked = '';

        if($cookies.filter_main == "comment") {
            $scope.f_by = "mostComment";

            console.log("I USE FILTER: "+$scope.f_by+" width tag <"+$scope.filter_tagsPicked+">");


            $http({
                url: '/api/preambuleLoadMostComment',
                method: 'GET',
                params: {
                    tags : $scope.filter_tagsPicked
                }
            }).success(function(reply) {
                for(var i=0 ; i < reply.length ; i++ ) {
                    reply[i].displayWrapper = false;
                }
                $scope.preambules = reply;
            });
        }
        else if($cookies.filter_main == "default" || !$cookies.filter_main) {
            $scope.f_by = "show";
            console.log("I USE FILTER: "+$scope.f_by);
            $http.get('/api/preambuleLoad').success(function(reply) {
                for(var i=0 ; i < reply.length ; i++ ) {
                    reply[i].displayWrapper = false;
                }
                $scope.preambules = reply;
            });
        }

        $scope.preambuleSelect = [];






        $scope.login_open_window = function () {
            $scope.display_login = true;
            $scope.display_modal = true;
        };

        $scope.display_preambule = function (preambule) {

            $scope.preambuleSelect = preambule;
            $scope.show_preambule = true;
            $rootScope.bodyLocker = true;



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

        $scope.show_preambuleDetails = function () {
            $scope.$apply(function () {
                $scope.show_preambule = false;
            });
        }

        $scope.voteTry = function (preambulePicked) {
            preambulePicked.votes.push("LOL");
            $http.post('/api/updatePreambule', preambulePicked)
                .success(function(reply) {
                });
        }

        $scope.filter_by = function (value) {
            if($scope.filter_tagsPicked)
                $cookies.tags = $scope.filter_tagsPicked;

            if(value == "mostComment") {
                $cookies.filter_main = "comment";
                location.reload();
            }
            else if(value == "mostRecent") {
                $cookies.filter_main = "default";

                location.reload();
            }
        }

        $rootScope.log = function(variable) {
            console.log(variable);
        };

        $('#black').click(function (event) {
            $scope.$apply(function () {
                if(!$('.modal_content').is(":hover"))
                    $scope.show_preambule=false;
            });

        });

        $scope.preambuleSuiteSave = function(newSuite, sourcePreambule) {
            var sendData = sourcePreambule;
            sendData.contentSuite = newSuite.contentSuite;
            sendData.author_suite = $rootScope.currentUser.name;
            $http.post('/api/createSuitePreambule', sendData).success(function(reply) {
                console.log("NOUVELLE SUITE DU PREAMBULE");
                console.log(reply);
            });
        }

    });

