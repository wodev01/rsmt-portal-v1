'use strict';
app.controller('VerifyCtrl',
    function ($scope, $cookies, $state, $timeout, $mdDialog, cookieName, toastr) {

        $scope.isProcessing = false;

        $scope.fnLogout = function () {
            CarglyPartner.logout(function () {
                $cookies.remove(cookieName);
                $state.go('login');
            }, function () {});
        };

        $scope.fnOpenTermsOfServiceModal = function (ev) {
            var TermsOfServiceModalController = ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }];

            $mdDialog.show({
                controller: TermsOfServiceModalController,
                templateUrl: 'views/modals/termsOfServiceDialog.html',
                targetEvent: ev
            });
        };

        $scope.fnRefreshDom = function(){
            $timeout(function(){$scope.$apply();});
        };

        $scope.fnReconfirmUser = function () {
            $scope.isProcessing = true;
            CarglyPartner.reconfirmUser(function () {
                $scope.isProcessing = false;
                $scope.fnRefreshDom();
                toastr.success('Confirmation email sent successfully.');
            });
        };

        $scope.fnInitVerify = function () {
            if (CarglyPartner.user) {
                $scope.userObj = CarglyPartner.user;
            }
        };
    });
