'use strict';

angular.module('preambuleApp')
    .controller('SettingsCtrl', function ($scope, User, Auth, $route) {
        $scope.errors = {};

        $scope.changePassword = function(form) {
            $scope.submitted = true;

            if(form.$valid && $scope.confirmPassword()) {
                Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
                    .then( function() {
                        $scope.message = 'Mot de passe changé.';
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $route.reload();
                            });
                        }, 2000);
                    })
                    .catch( function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Mauvais mot de passe';
                    });
            }
        };

        $scope.confirmPassword = function () {
            if($scope.confirmNewPassword === $scope.user.newPassword) {
                return true;
            }
            else {
                $scope.formError_confirmPassword = true;
                return false;
            }
        };
    });
