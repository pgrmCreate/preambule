'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:SeebookCtrl
 * @description
 * # SeebookCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('SeebookCtrl', function ($scope, $location, $http, $rootScope, $timeout) {
        var id_select = $location.path().split('/')[2];
        var page_select = $location.path().split('/')[3];

        if(typeof page_select === 'undefined') {
            $scope.page = 1;
        }
        else {
            $scope.page = page_select;
        }

        $http({
            url: '/api/preambuleSuiteLoadOne',
            method: 'GET',
            params: {
                id : id_select
            }
        }).success(function(reply) {
            console.log("LOADING SUITE..");
            console.log(reply);
            $scope.selectBook = reply[0];
        });

        $scope.changePage = function(type) {
            if(type === 'right' && $scope.selection < 3) {
                $scope.selection += 1;
                $scope.margin_select += 1140;
                console.log("+");
            }
            else if(type === 'left' && $scope.selection > 1) {
                $scope.selection -= 1;
                $scope.margin_select -= 1140;
                console.log("-");

            }
        };

        $scope.selection = 1;


  });
