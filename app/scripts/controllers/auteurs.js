'use strict';


/**
 * @ngdoc function
 * @name preambuleApp.controller:AuteursCtrl
 * @description
 * # AuteursCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
    .controller('AuteursCtrl', function ($scope, $http, $rootScope) {
      

        $scope.auteurs = [
            {
                "nom_auteur" : "Jk Rowling",
                "index" : 1,
                "show_full_bio" : false
            },
            {
                "nom_auteur" : "Dany Laferrière",
                "index" : 2,
                "show_full_bio" : false
            },
            {
                "nom_auteur" : "Stephen King",
                "index" : 3,
                "show_full_bio" : false
            },
            {
                "nom_auteur" : "Jacques Ferron",
                "index" : 4,
                "show_full_bio" : false
            }
        ];



    });
