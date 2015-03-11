'use strict';

/**
 * @ngdoc function
 * @name preambuleApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the preambuleApp
 */
angular.module('preambuleApp')
    .controller('ProfileCtrl', function ($scope, $route, $http, $rootScope, $location, User,
                                         Auth, $animate) {

        $scope.profil_user = {};
        $scope.profil_user.aboutYou = "";
        $scope.profil_user.birthday = {};

        $scope.choose_birth_day = [];
        for(var i=1 ; i <= 31 ; i++) {
            $scope.choose_birth_day.push(i);
        }

        $scope.choose_birth_month = ['janvier',	'février',	'mars',	'avril',	'mai',	'juin',
            'juillet',	'août',	'septembre',	'octobre',	'novembre',	'décembre'];

        $scope.choose_birth_year = [];
        for(i=1970 ; i <= 2012 ; i++) {
            $scope.choose_birth_year.push(i);
        }


        if($rootScope.currentUser) {
            $http({
                url: '/api/findUserById',
                method: 'GET',
                params: {
                    id : $rootScope.currentUser.id
                }
            }).success(function(reply) {
                $scope.profil_user = reply[0];
            });

        }


        $scope.save_edit_profil = function () {
            var send_profil = $scope.profil_user;

            $http.put('/api/users/update', {"user" : send_profil})
                .success(function(reply) {
                    if(reply === "Finished") {
                        Notifier.success('Votre profil a bien été edité.', 'Mise a jour');
                    }
                });
        };

        $scope.onFileSelect_profil = function () {
            //    var status_elem = document.getElementById("status");
            var url_elem = document.getElementById("preview_user");
            $scope.id_picked = url_elem.src;
            $scope.id_picked = $scope.id_picked.split('/')[4];

            if(url_elem.src.split('/')[5] === "anonymous.png") {
                $http.get('/getDateNow').success(function(data) {
                    var url_elem = document.getElementById("preview_user");
                    var s3upload = new S3Upload({
                        file_dom_selector: 'files_user',
                        s3_sign_put_url: '/sign_s3_account',
                        s3_object_name : data,
                        onProgress: function(percent, message) {
                        },
                        onFinishS3Put: function(public_url) {
                            url_elem.value = public_url;
                            $('#preview_account').attr('src', public_url);
                            alert(public_url);
                            $http({
                                url: '/api/findUserById',
                                method: 'GET',
                                params: {
                                    id : $scope.profil_user._id
                                }
                            }).success(function(reply) {
                                reply[0].image_user = public_url;
                                $http.put('/api/users/update', {"user" : reply[0]})
                                    .success(function(reply) {
                                        location.reload();
                                    });
                            });

                        },
                        onError: function(status) {
                            console.log("############ERROR############");
                            console.log(status);
                        }
                    });
                }).error(function(data, status) {
                    console.log("ERROR :");
                    console.log(status);
                    console.log(data);
                });

            }
            else {
                var s3upload = new S3Upload({
                    file_dom_selector: 'files_user',
                    s3_sign_put_url: '/sign_s3_account',
                    s3_object_name : $scope.id_picked,
                    onProgress: function(percent, message) {
                    },
                    onFinishS3Put: function(public_url) {
                        url_elem.value = public_url;
                        $('#preview_user').attr('src', public_url);
                        location.reload();

                    },
                    onError: function(status) {
//        status_elem.innerHTML = 'Upload error: ' + status;
                        console.log("############ERROR############");
                        console.log(status);
                    }
                });
            }
        };

        $http({
            url: '/api/myPreambuleLoad',
            method: 'GET'
        }).success(function(reply) {
            $scope.preambules = reply;
            for(var i=0 ; i <  $scope.preambules.length ; i++) {
                $scope.preambules[i].auteur.name = $rootScope.currentUser.author_name;
            }
        });

//        EDIT PREAMBULE CONTROLLER
        $scope.display_preambule = function (preambule) {
            $location.path('/seepreambule/'+preambule._id);
        };

        $scope.saveEdit = function (preambulePicked) {
            $http.post('/api/updatePreambule', preambulePicked)
                .success(function(reply) {
                    $route.reload();
                });
        };

        $scope.deleteEdit = function (preambulePicked) {
            $http.post('/api/deletePreambule', preambulePicked)
                .success(function(reply) {
//                    alert(reply);
                    $route.reload();
                });
        };

        $scope.close_preambule = function () {
            $scope.show_preambule=false;
            $rootScope.bodyLock=false;
            console.log("OKKKKk");
        };

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.open_modal_delete = function () {
            $scope.modal_profil_delete = true;
        };

        $scope.action_delete_account = function () {
            var mdp = {'mdp' : $scope.deleteAccount_mdp};
            $http.post('/api/deleteProfil', mdp)
                .success(function(reply) {
                    if(reply === "GOOD") {
                        var id_select = {'id' : $rootScope.currentUser.id};
                        Auth.logout()
                            .then(function() {
                                $location.path('/');
                                $rootScope.display_login=false;
                                $rootScope.display_userMenu=false;
                                $rootScope.display_modal=false;
                                $route.reload();
                                $http.post('/api/deleteUser', id_select).success(function () {
                                    alert("account destroyed");
                                });
                            });
                    }
                });
        };

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

    });
