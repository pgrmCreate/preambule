'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:EcrireCtrl
 * @description
 * # EcrireCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
    .controller('BibliothequeCtrl', function ($scope, $http, $rootScope, $location, $timeout,
                                              $animate) {
        var leftIndex = 0;



        $http.get('/api/preambuleSuiteLoad').success(function(reply) {
//            console.log("LOADING SUITE..");
//            console.log(reply);
            $scope.indexLoad = 1;
            $scope.slider_array = [];
            $scope.allLoadPreambules = reply;
            for(var i=0 ; i < $scope.allLoadPreambules.length ; i += 4) {
                $scope.SuitesPreambules = [];
                $scope.SuitesPreambules[0] = $scope.allLoadPreambules[i];
                if($scope.allLoadPreambules[i+1])
                    $scope.SuitesPreambules[1] = $scope.allLoadPreambules[i+1];
                if($scope.allLoadPreambules[i+2])
                    $scope.SuitesPreambules[2] = $scope.allLoadPreambules[i+2];
                if($scope.allLoadPreambules[i+3])
                    $scope.SuitesPreambules[3] = $scope.allLoadPreambules[i+3];
                $scope.slider_array.push($scope.SuitesPreambules);
            }
            console.log("ARRAY SLIDER :");
            console.log($scope.slider_array);

        });

        $scope.open_modal_next = function (preambule) {
            $scope.preambuleSelect = preambule;
            $scope.show_preambule = true;
        };

        $scope.close_preambule = function () {
            $scope.show_preambule=false;
            $rootScope.bodyLock=false;
        };

        $scope.display_preambule = function (preambule, index) {
            console.log(preambule.titre);
            $scope.preambuleSelect = preambule;
            console.log("index selected :");
            console.log(index);
            $scope.preambuleSelect.selectedIndex = index;
            $rootScope.show_preambule = true;
            $rootScope.bodyLock = true;
            $scope.preambuleSelect.lectureNb++;
            $http.post('/api/updatePreambuleSuite', $scope.preambuleSelect)
                .success(function(reply) {
                });

            $location.path('/seepreambule/'+preambule._id, false);
        };

        $scope.close_preambule = function () {
            $rootScope.show_preambule=false;
            $rootScope.bodyLock=false;
            $location.path('/', false);
        };

        $scope.myInterval = 5000;
        var slides = $scope.slides = [];

        $scope.addSlide = function() {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: 'http://placekitten.com/' + newWidth + '/300',
                text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
            });
        };
        for (var i=0; i<4; i++) {
            $scope.addSlide();
        }


        $scope.lib_slides = ['La jungle des felins', 'Les vieux chats', 'Chats de la Haute',
        "Fleur a chat", "Le Chat et le Poisson", "La gamelle du maitre", "Le chat des anges"];



        $timeout(function () {
            $scope.base_width_slide = $('#sliden_1').width();
        }, 300);

        $scope.slide_action = function(direction) {
            if(direction === "right") {
                $scope.lib_index += ($scope.base_width_slide * 3);
            }
            else if (direction === "left" && $scope.lib_index > 0) {
                $scope.lib_index -= ($scope.base_width_slide * 3);
            }
        };
    });
