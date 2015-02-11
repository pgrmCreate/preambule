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

        };


        $http({
            url: '/api/myPreambuleLoad',
            method: 'GET',
            params: {
                id : $rootScope.currentUser.name
            }
        }).success(function(reply) {
            $scope.preambules = reply;
        });

//        EDIT PREAMBULE CONTROLLER
        $scope.display_preambule = function (preambule) {

            $scope.preambuleSelect = preambule;
            $scope.show_preambule = true;
            $rootScope.bodyLocker = true;
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
                    alert(reply);
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


  });
