'use strict';



angular.module('preambuleApp')
    .controller('InfosCtrl', function ($scope, $location ) {

        var id_select = $location.path().split('/')[2];
        $scope.link = id_select;

        var allTypes = ['contact', 'apropos', 'aide', 'conditions', 'confident', 'cookies'];
        var found = $.inArray(id_select, allTypes) > -1;

        if(found === false) {
            $location.path('/');
        }
    });