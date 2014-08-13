'use strict';

angular.module('preambuleApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

        $scope.login_open_window = function () {
            $scope.display_login = true;
            $scope.display_modal = true;
        };

  });

