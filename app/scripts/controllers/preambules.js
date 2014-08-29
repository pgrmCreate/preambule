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
    $scope.preambules = [
        {
            "titre" : "Le grand LHC",
            "auteur" : "Baghery Nassim",
            "votes" : 247,
            "commentaires" : 4
        },
        {
            "titre" : "Du plastique dans le corps",
            "auteur" : "Baghery Nassim",
            "votes" : 182,
            "commentaires" : 2
        },
        {
            "titre" : "Du plastique dans le corps",
            "auteur" : "Baghery Nassim",
            "votes" : 92,
            "commentaires" : 4
        },
        {
            "titre" : "Water spirales",
            "auteur" : "Hippie of wind",
            "votes" : 28,
            "commentaires" : 2
        },
        {
            "titre" : "Le jardin d'Eden",
            "auteur" : "Adam & Eve",
            "votes" : 314,
            "commentaires" : 7
        },
        {
            "titre" : "Tenir un arbre par la main",
            "auteur" : "Jerome Sourcedevie",
            "votes" : 144,
            "commentaires" : 3
        },
        {
            "titre" : "Tenir un arbre par la main",
            "auteur" : "Jerome Sourcedevie",
            "votes" : 144,
            "commentaires" : 3
        },
        {
            "titre" : "La femme et l'eau",
            "auteur" : "Elodie Rien",
            "votes" : 52,
            "commentaires" : 0
        }
    ]
  });
