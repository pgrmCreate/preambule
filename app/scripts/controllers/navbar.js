'use strict';

angular.module('preambuleApp')
    .controller('NavbarCtrl', function ($upload, $scope, $location, $http, Auth, $rootScope) {
        $( "#tagLoad" ).autocomplete({
            source: ["meurtre", "humour", "romance", "epouvante",
            "mystere", "science-fiction", "policier", "biographie"]
        });

        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }, {
            'title': 'Settings',
            'link': '/settings'
        }];

        $scope.newPreambule = {
            "titre" : "",
            "content" : "",
            "auteur" : "",
            "votes" : [],
            "tags" : [],
            "commentaires" : [],
            "date" : 0
        };

        $scope.logout = function() {
            Auth.logout()
                .then(function() {
                    $location.path('/login');
                });
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.write_newPreambule = function () {

            $scope.modal_write_preambule = true;
            $scope.display_modal = true;
            $scope.newPreambule.auteur = $rootScope.currentUser.name;
        }

        $scope.preambuleSave = function (newPreambule) {
            $http.post('/api/createPreambule', newPreambule).success(function(reply) {
                var defineNameFile = "img_"+reply.id+".jpg";
                for (var i = 0; i < $scope.imageData.length; i++) {
                    var file = $scope.imageData[i];

                    $scope.upload = $upload.upload({
                        url: '/upload', //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        headers: {'header-key': 'header-value'},
                        grunwithCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file, // or list of files ($files) for html5 only
                        fileName: defineNameFile // or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                        // customize file formData name ('Content-Disposition'), server side file variable name.
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                        //formDataAppender: function(formData, key, val){}
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        $location.path();
                    });
                    //.error(...)
                    //.then(success, error, progress);
                    // access or attach event listeners to the underlying XMLHttpRequest.
                    //.xhr(function(xhr){xhr.upload.addEventListener(...)})
                }
            });

        }

        $scope.onFileSelect = function (files) {
            $scope.imageData = files;
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                }

                reader.readAsDataURL(files[0]);
            }
        }

        $scope.removeTag = function (index) {

            $scope.newPreambule.tags.splice(index, 1);;
        }

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
        }



            $scope.loadingTag = ["meurtre", "humour", "rommance",
                "mystere", "voyage" , "philosphie", "science-fiction"];

    });
