'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:SeepreambuleCtrl
 * @description
 * # SeepreambuleCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('SeepreambuleCtrl', function ($scope, $http, $location) {


        var id_select = $location.path().split('/')[2];


        $http({
            url: '/api/OnePreambuleLoad',
            method: 'GET',
            params: {
                id : id_select
            }
        }).success(function(reply) {
            $scope.preambule_select = reply[0];
            console.log(reply);
        });
  });
