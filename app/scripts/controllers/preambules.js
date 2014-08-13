'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:PreambulesCtrl
 * @description
 * # PreambulesCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('PreambulesCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
