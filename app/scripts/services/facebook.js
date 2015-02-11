'use strict';

angular.module('preambuleApp')
    .factory('Facebook', function ($location, $rootScope, Session, User,
                                           $cookieStore, $http, Auth) {

        return {

            /**
             * Authenticate user
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            connected: function(into) {
                console.log("Into User:");
                console.log(into);

                $http.post('/api/users/findUserByEmailOrCreate', {input_facebook : into})
                    .success(function(reply) {
                        if(reply === "nouserexist") {
                            console.log("Good i signup with"+ into.email +"....");
                            //////////////////////
                            var input_name = into.first_name + " " + into.last_name;
                            var newUserData = {name : input_name, email : into.email,
                                password : "nopassword"};
                            Auth.createUser(newUserData)
                                .then( function() {
                                    // Account created, redirect to home
                                    $location.path('/');
                                })
                                .catch( function(err) {
                                    err = err.data;
                                    $scope.errors = {};

                                    // Update validity of form fields that match the mongoose errors
                                    angular.forEach(err.errors, function(error, field) {
                                        form[field].$setValidity('mongoose', false);
                                        $scope.errors[field] = error.message;
                                    });
                                });
                            //////////////////////
                        }
                        else {
                            if(reply === "userexist") {
                                Auth.login({
                                    email: into.email,
                                    password: "nopassword"
                                })
                                    .then( function() {
                                        window.location.reload();
                                    })
                                    .catch( function(err) {
                                        err = err.data;
                                        alert("## Bad login because "+err.data);
                                    });
                            }
                        }
                    });

                return 1;
            }
        };
    });