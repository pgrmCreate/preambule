'use strict';

angular.module('preambuleApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth, $modalService) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }, {
            'title': 'Settings',
            'link': '/settings'
        }];

        $scope.logout = function() {
            Auth.logout()
                .then(function() {
                    $location.path('/login');
                });
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };



    });
