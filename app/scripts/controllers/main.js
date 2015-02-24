'use strict';



angular.module('preambuleApp')
    .controller('MainCtrl', function ($scope, $http, $rootScope, Auth, $location, $window,
                                      $route, $filter, userFilter, $timeout, $interval,Facebook ) {
        $scope.preambuleSelect = [];
        $scope.preambules = [];
        $scope.filter_tagsPicked = [];
        $scope.notifer_warningVote = false;
        var cursorLoad = 0;


        $scope.items_categories = [
            { value: 1, name: 'Enfants' },
            { value: 2, name: 'Drame' },
            { value: 3, name: 'Horreur' },
            { value: 4, name: 'Humour' },
            { value: 5, name: 'Fiction' },
            { value: 6, name: 'Mystères' },
            { value: 7, name: 'Thriller' },
            { value: 8, name: 'Science-Fiction' },
            { value: 9, name: 'Fantaisie' } ];

        $timeout(function () {
            window.onscroll = function(ev) {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    $scope.load_preambule();
                }
            };
        }, 1500);


        $scope.load_preambule = function () {
            userFilter.load();
            if(!userFilter.pickedFilter) {
                userFilter.pickedFilter = {
                    classement : 'lastActivity',
                    date : 'firstActivity',
                    categorie : '0',
                    tags : []
                };
            }

            // alert(getDateNow);
            $scope.f_classement = userFilter.pickedFilter.classement;
            $scope.f_date = userFilter.pickedFilter.date;
            $scope.filter_tagsPicked = userFilter.pickedFilter.tags;
            $scope.f_categorie = userFilter.pickedFilter.categorie;

            console.log("Filters :");
            console.log(userFilter.pickedFilter);
            $http({
                url: '/api/preambuleLoad',
                method: 'GET',
                params: {
                    filters : userFilter.pickedFilter,
                    maxLoad : cursorLoad
                }
            }).success(function(reply) {
                var description_short = "";
                for(var i=0 ; i < reply.length ; i++ ) {
                    reply[i].displayWrapper = false;
//                    if(reply[i].description.length > 340) {
//                        console.log(reply[i].description.length);
//                        for(var i2=0 ; i2 < reply[i].description.length ; i2++) {
//                            if(i2 < 310) {
//                                description_short += reply[i].description[i2];
//                          e
//                        }
//                        description_short += " [...]";
//                        reply[i].description = description_short;
//                        console.log("Now : "+description_short);
//                    }
                }
                console.log(cursorLoad);
                console.log(reply);
                console.log($scope.preambules.length);
                 if(reply.length > 0) {
                    for(i=cursorLoad ; i < (reply.length+cursorLoad) ; i++) {
                        $scope.preambules[i] = reply[i-cursorLoad];
                    }
                     cursorLoad += 12;
                }



//                $scope.maxCharaDescription($scope.preambules);
            });

        };

        $scope.maxCharaDescription = function(loaded) {
            loaded[0].description.length = 300;
        };

        $scope.removeTag = function (index) {
//            $scope.filter_tagsPicked.splice(index, 1);
            userFilter.pickedFilter.tags
                .splice(index, 1);
            userFilter.save();

            $route.reload();
        };

        $scope.change_filter = function () {
            cursorLoad = 0;
            
            userFilter.pickedFilter.date = $scope.f_date;
            userFilter.pickedFilter.classement = $scope.f_classement;
            userFilter.pickedFilter.categorie = $scope.f_categorie;

            userFilter.save();
            $scope.loading_filter = true;
//            location.reload();
            $scope.preambules = [];
            $timeout(function(){
                $scope.load_preambule();

                $timeout(function(){$scope.loading_filter = false;}, 200);
            }, 800);

        };

        $scope.filter_tags_add = function () {
            var isLegal = true;
            if($scope.filter_tagsPicked) {
                for(var i=0 ; i < $scope.filter_tagsPicked.length ; i++) {
                    if($scope.filter_tagsPicked[i] === $scope.filter_tagsPicked_input)
                    {
                        isLegal = false;
                    }
                }
            }
            if(isLegal) {
                userFilter.pickedFilter.tags
                    .push($scope.filter_tagsPicked_input);
                userFilter.save();
            }
            else
                Notifier.warning('Vous avez rentré 2 tags identiques.', 'Doublon de tag');

//            $scope.filter_tagsPicked.push($scope.filter_tagsPicked_input);
            $route.reload();
        };


        $scope.login_open_window = function () {
            $rootScope.display_login = true;
            $rootScope.display_modal = true;
        };

        $scope.display_preambule = function (preambule, index) {

//            $location.path('/seepreambule/'+preambule._id);

            $window.open('/seepreambule/'+preambule._id);

//            console.log(preambule.titre);
//            $scope.preambuleSelect = preambule;
//            console.log("index selected :");
//            console.log(index);
//            $scope.preambuleSelect.selectedIndex = index;
//            $rootScope.show_preambule = true;
//            $rootScope.bodyLock = true;
//            $scope.preambuleSelect.lectureNb++;
//            $http.post('/api/updatePreambule', $scope.preambuleSelect)
//                .success(function(reply) {
//                });
//
//            $location.path('/seepreambule/'+preambule._id, false);
        };

        $scope.addComment = function (preambulePicked) {
            var pseudo = $rootScope.currentUser.name;


            preambulePicked.commentaires.push({
                "authorMail" : pseudo,
                "content" : $scope.newComment
            });

            preambulePicked.updateTimeActivity = true;

            $scope.newComment = '';
            $('#zoneComment').blur();

            $http.post('/api/updatePreambule', preambulePicked)
                .success(function(reply) {
                });
        };

        $scope.show_preambuleDetails = function () {
            $scope.$apply(function () {
                $rootScope.show_preambule = false;
            });
        };

        $scope.voteTry = function (preambulePicked) {

            if(!$rootScope.currentUser) {
                $rootScope.show_preambule = false;
                $rootScope.display_login = true;
                $rootScope.display_modal = true;

            }
            else {
                var found = $.inArray($rootScope.currentUser.name, preambulePicked.votes) > -1;

                if(found === true && $scope.notifer_warningVote !== true) {
                    $scope.notifer_warningVote = true;
                    $timeout(function () {
                        $scope.notifer_warningVote = false;
                    }, 4000);
                    Notifier.warning('Vous nous pouvez voter plusieurs fois le meme article',
                        'Vote non accepté');
                }
                else if(found === false) {
                    preambulePicked.votes.push($rootScope.currentUser.name);
                    preambulePicked.votes_size++;
                    preambulePicked.updateTimeActivity = true;
                    $http.post('/api/updatePreambule', preambulePicked)
                        .success(function(reply) {
                        });
                }
            }
        };

        $rootScope.log = function(variable) {
            console.log(variable);
        };

        $scope.preambuleSuiteSave = function(newSuite, sourcePreambule) {
            var sendData = sourcePreambule;
            sendData.contentSuite = newSuite.contentSuite;
            sendData.author_suite = $rootScope.currentUser.name;
            $http.post('/api/createSuitePreambule', sendData).success(function(reply) {
                $route.reload();
            });
        };

        $scope.close_preambule = function () {
            $rootScope.show_preambule=false;
            $rootScope.bodyLock=false;
            $location.path('/', false);
        };

        $scope.open_randomPreambule = function () {
            var id_select = Math.floor((Math.random() *
                $scope.preambules.length) + 0);
            $scope.display_preambule($scope.preambules[id_select], id_select);
        };

        $scope.edit_preambule_active = function () {
            $http.post('/api/updatePreambule', $scope.pickedEdit_preambule)
                .success(function(reply) {
                    Notifier.success('Le préambule a bien été edité.', 'Mise a jour');
                });
        };

        $timeout(function(){
            $scope.load_preambule();

            $timeout(function(){$scope.loading_filter = false;}, 100);
        }, 200);

    });




