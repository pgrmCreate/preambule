'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:EditprofileCtrl
 * @description
 * # EditprofileCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('EditpreambuleCtrl', function ($scope, $http, $rootScope, $route) {


//        $http.get('/api/myPreambuleLoad').success(function(reply) {
//            for(var i=0 ; i < reply.length ; i++ ) {
//                reply[i].displayWrapper = false;
//            }
//            $scope.preambules = reply;
//        });


        $scope.saveEdit = function (preambulePicked) {
            $http.post('/api/updatePreambule', preambulePicked)
                .success(function(reply) {
                    $route.reload();
                });
        };

        $scope.deleteEdit = function (preambulePicked) {
            $http.post('/api/deletePreambule', preambulePicked)
                .success(function(reply) {
                    alert(reply);
                    $route.reload();
                });
        };

        $scope.close_preambule = function () {
            $scope.show_preambule=false;
            $rootScope.bodyLock=false;
            console.log("OKKKKk");
        };
  });
