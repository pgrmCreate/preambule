'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:EcrireCtrl
 * @description
 * # EcrireCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
  .controller('EcrireCtrl', function ($scope) {

    $scope.auteurs = [
        {
            'index' : 1,
            'nom_auteur' : 'Guy Ritchie',
            'select_write' : false
        },
        {
            'index' : 2,
            'nom_auteur' : 'Arthur Phillips',
            'select_write' : false
        },
        {
            'index' : 3,
            'nom_auteur' : 'Michael Chabon',
            'select_write' : false
        },
        {
            'index' : 4,
            'nom_auteur' : 'Dan Brown',
            'select_write' : false
        },
        {
            'index' : 5,
            'nom_auteur' : 'Michael Connelly',
            'select_write' : false
        }
    ]

        $scope.author_select = function (author_selected) {
            $scope.auteur_select = author_selected;
        }
  });
