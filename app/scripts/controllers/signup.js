'use strict';

angular.module('preambuleApp')
    .controller('SignupCtrl', function ($scope, Auth, $location, $http) {
        $scope.user = {};
        $scope.errors = {};
        $scope.user.birth = {};

        $scope.choose_birth_day = [];
        for(var i=1 ; i <= 31 ; i++) {
            $scope.choose_birth_day.push(i);
        }
        $scope.user.birth.day = 1;

        $scope.choose_birth_month = ['janvier',	'février',	'mars',	'avril',	'mai',	'juin',
            'juillet',	'août',	'septembre',	'octobre',	'novembre',	'décembre'];
        $scope.user.birth.month = 'janvier';

        $scope.choose_birth_year = [];
        for(i=1970 ; i <= 2012 ; i++) {
            $scope.choose_birth_year.push(i);
        }
        $scope.user.birth.year = 1970;

        $scope.register = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                Auth.createUser({
                    name: $scope.user.name,
                    author_name: $scope.user.author_name,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    image_user : $('#avatar_url_account').attr('value')
                })
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
            }
        };

        $scope.upload_image_account = function () {
            //    var status_elem = document.getElementById("status");
            $http.get('/getDateNow').success(function(data) {
                var url_elem = document.getElementById("avatar_url_account");
                var s3upload = new S3Upload({
                    file_dom_selector: 'files_account',
                    s3_sign_put_url: '/sign_s3_account',
                    s3_object_name : data,
                    onProgress: function(percent, message) {
//        status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
                    },
                    onFinishS3Put: function(public_url) {
//        $('#new_upload_status').text('Upload completed. Uploaded to: '+ public_url);
                        url_elem.value = public_url;
                        $('#preview_account').attr('src', public_url);
                        console.log("FINISH UPLOAD");
//                        $('#button_publish').removeAttr("disabled");
                    },
                    onError: function(status) {
//        status_elem.innerHTML = 'Upload error: ' + status;
                        console.log("############ERROR############");
                        console.log(status);
                    }
                });
            }).error(function(data, status) {
                console.log("ERROR :");
                console.log(status);
                console.log(data);
            });
        };

        $scope.checkFormSignup = function () {

        };
    });