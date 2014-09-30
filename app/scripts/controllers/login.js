'use strict';

angular.module('preambuleApp')
    .controller('LoginCtrl', function ($scope, Auth, $location) {
        $scope.user = {};
        $scope.errors = {};

        $scope.login = function(form) {
            $scope.submitted = true;
            if(form.$valid) {
                Auth.login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then( function() {
                        window.location.reload();
                    })
                    .catch( function(err) {
                        err = err.data;
                        $scope.errors.other = err.message;
                        alert("## Bad login because "+err.data);
                    });
            }
        };
    });