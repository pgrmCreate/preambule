'use strict';

angular.module('preambuleApp')
    .controller('NavbarCtrl', function ($upload, $scope, $location, $http,
                                        Auth, $rootScope, $route) {

        $scope.write_type = "normal";

//        $scope.liste_auteurs = [{
//            nom : "stephen king"
//        },
//            {
//                nom : "Alphonse Daudet"
//            },
//            {
//                nom : "Denis Diderot"
//            }];

        $( "#tagLoad" ).autocomplete({
            source: ["aventure", "enfants", "humour", "crime",
                "mort", "démons", "dépression", "drame", "famille", "fanfiction",
                "fantaisie", "fiction", "amitié", "horreur", "vie", "amour",
                "magie", "mystère", "paranormal", "meurtre", "romance", "triste", "science-fiction",
                "suspense", "adolescence", "thriller", "voyage", "vampires", "Voyages"]
        });

        $scope.current_link = $location.path();

        $scope.newPreambule = {
            "titre" : "",
            "content" : "",
            "auteur" : {
                "name" : "",
                "_id" : "",
                "image_user" : ""
            },
            "votes" : [],
            "votes_size" : 0,
            "tags" : [],
            "commentaires" : [],
            "commentaires_size" : 0,
            "date" : 0,
            "date_lastActivity" : 0,
            "photo" : "",
            "lectureNb" : 0,
            "categorie" : []
            };

        $scope.items = [
            { value: 1, name: 'Enfants' },
            { value: 2, name: 'Drame' },
            { value: 3, name: 'Horreur' },
            { value: 4, name: 'Humour' },
            { value: 5, name: 'Fiction' },
            { value: 6, name: 'Mystères' },
            { value: 7, name: 'Thriller' },
            { value: 8, name: 'Science-Fiction' },
            { value: 9, name: 'Fantaisie' }
        ];

        $scope.logout = function() {
            Auth.logout()
                .then(function() {
                    $location.path('/');
                    $rootScope.display_login=false;
                    $rootScope.display_userMenu=false;
                    $rootScope.display_modal=false;
                    $route.reload();
                });
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.write_newPreambule = function () {
            $rootScope.modal_write_preambule = true;
            $rootScope.display_modal = true;
            $rootScope.bodyLock = true;
        };

        $scope.closeWriting = function () {
            $rootScope.modal_write_preambule = false;
            $rootScope.display_modal = false;
            $rootScope.bodyLock = false;
        };

        $scope.preambuleSave = function (newPreambule) {
            console.log("BEGIN ADD PREAMBULE");
            console.log(newPreambule);
            var parts = $('#avatar_url').val().split("/");
            var result = parts[parts.length - 1];

            newPreambule.photo = result;
            // EXTRACT ONLY NAME
            newPreambule.categorie[0] = newPreambule.categorie[0].name;
            newPreambule.categorie[1] = newPreambule.categorie[1].name;

            $http.post('/api/createPreambule', newPreambule).success(function(reply) {
//                var defineNameFile = "img_"+reply.id+".jpg";
//                for (var i = 0; i < $scope.imageData.length; i++) {
//                    var file = $scope.imageData[i];
//                }
                location.reload();
            });

        };

        $scope.onFileSelect = function (files) {
            $scope.imageData = files;
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                };
                reader.readAsDataURL(files[0]);
            }
        };

        $scope.removeTag = function (index) {

            $scope.newPreambule.tags.splice(index, 1);;
        };

        $scope.legalPushTag = function (searchTag) {
            var isLegal = true;
            for(var i=0 ; i < $scope.newPreambule.tags.length ; i++) {
                if($scope.newPreambule.tags[i] == searchTag)
                    isLegal = false;
            }
            if(isLegal) {
                $scope.newPreambule.tags.push(searchTag);
            }
            else
                Notifier.warning('Vous avez rentré 2 tags identiques.', 'Doublon de tag');
        };

        $scope.loadingTag = ["meurtre", "humour", "rommance",
            "mystere", "voyage" , "philosphie", "science-fiction"];

        $scope.upload_image = function () {
            //    var status_elem = document.getElementById("status");
            $http.get('/getDateNow').success(function(data) {
                var url_elem = document.getElementById("avatar_url");
                var s3upload = new S3Upload({
                    file_dom_selector: 'files',
                    s3_sign_put_url: '/sign_s3',
                    s3_object_name : data,
                    onProgress: function(percent, message) {
//        status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
                    },
                    onFinishS3Put: function(public_url) {
//        $('#new_upload_status').text('Upload completed. Uploaded to: '+ public_url);
                        url_elem.value = public_url;
                        $('#preview').attr('src', public_url);
                        console.log("FINISH UPLOAD");
                        $('#button_publish').removeAttr("disabled");
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

        $scope.create_account_window = function () {
            $scope.display_login = false;
            $scope.display_modal = false;
            $location.path('/signup');
        };

        $scope.openLogin = function () {

            $rootScope.bodyLock = true;
            $scope.display_login = true;
            $scope.display_modal = true;
        };

        $scope.closeLogin = function () {
            $scope.display_login=false;
            $scope.display_modal = false;
            $rootScope.bodyLock = false;
        };

        $scope.select_author_writting = function (index) {
            $scope.picked_author = index;

            if(index !== 4) {
                $scope.result_picked = $scope.liste_auteurs[index].nom;
            }
            else {
                $scope.result_picked = "Libre préambule";
            }
        };
        $scope.select_author_writting(4);
    });
