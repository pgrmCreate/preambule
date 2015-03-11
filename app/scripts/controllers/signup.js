'use strict';

angular.module('preambuleApp')
    .controller('SignupCtrl', function ($scope, Auth, $location, $http) {
        $scope.user = {
            gender : 'rien'
        };
        $scope.errors = {};
        $scope.user.birthday = {};

        $scope.choose_birth_day = [];
        for(var i=1 ; i <= 31 ; i++) {
            $scope.choose_birth_day.push(i);
        }
        $scope.user.birthday.day = 1;

        $scope.user.birthday.month = 1;
        $scope.choose_birth_month = ['janvier',	'février',	'mars',	'avril',	'mai',	'juin',
            'juillet',	'août',	'septembre',	'octobre',	'novembre',	'décembre'];

        $scope.choose_birth_year = [];
        for(i=1970 ; i <= 2012 ; i++) {
            $scope.choose_birth_year.push(i);
        }
        $scope.user.birthday.year = 1970;

        $scope.allCountry = ["Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
            "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
            "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
            "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina",
            "Botswana", "Bouvet Island", "Brazil",
            "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
            "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China",
            "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo",
            "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba",
            "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
            "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)",
            "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
            "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece",
            "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
            "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)",
            "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq",
            "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya",
            "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan",
            "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
            "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic Of",
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
            "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of",
            "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
            "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger",
            "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
            "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
            "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation",
            "Rwanda", "Saint Barthelemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia",
            "Saint Martin (French Part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
            "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
            "Sint Maarten (Dutch Part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
            "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
            "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
            "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste",
            "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
            "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
            "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu",
            "Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.",
            "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];



        $('#DDDQ').click(function (e) {
            console.log(e.target);
            if(e.target.id === 'DDDQ' || e.target.id === 'wrong_checkPicture') {
                $scope.$apply(function () {
                    $scope.check_picture=false;
                });
            }
        });



        $scope.register = function(form) {
            console.log($scope.user);
            if($scope.user.gender !== "rien") {
                $scope.submitted = true;


                if(form.$valid) {
                    if($('#avatar_url_account').attr('value') === "images/general_small_elements/anonymous.png") {
                        $scope.check_picture=true;
                        $('#ok_checkPicture').click(function () {
                            Auth.createUser({
                                name: $scope.user.name,
                                author_name: $scope.user.author_name,
                                email: $scope.user.email,
                                password: $scope.user.password,
                                gender: $scope.user.gender,
                                birthday: {
                                    day : $scope.user.birthday.day,
                                    month : $scope.user.birthday.month,
                                    year : $scope.user.birthday.year},
                                country: $scope.user.country,
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
                        });
                    }
                    else {
                        Auth.createUser({
                            name: $scope.user.name,
                            author_name: $scope.user.author_name,
                            email: $scope.user.email,
                            password: $scope.user.password,
                            gender: $scope.user.gender,
                            birthday: {
                                day : $scope.user.birthday.day,
                                month : $scope.user.birthday.month,
                                year : $scope.user.birthday.year},
                            country: $scope.user.country,
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


                }
            }
            else {
                $scope.error_sex_choose = true;
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