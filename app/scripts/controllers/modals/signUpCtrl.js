'use strict';
app.controller('SignUpCtrl', function ($scope, $location, $timeout, $mdDialog, globalTimeZone, ErrorMsg, toastr) {

    $scope.user = {businessTimezone:'US/Central', isProcessing: false};
    $scope.timeZoneDDOptions = globalTimeZone;

    $scope.fnHide = function () {
        $mdDialog.hide();
    };

    $scope.fnCancel = function () {
        $mdDialog.cancel();
    };

    $scope.fnRefreshDom = function(){
        $timeout(function(){$scope.$apply();});
    };

    $scope.fnRegisterUser = function (user) {
        if (user.password !== user.confirmPassword) {
            toastr.error('Password must be matched');
        } else {
            $scope.isProcessing = true;
            CarglyPartner.createPartner(user,
                function () {
                    $scope.isProcessing = false;
                    $scope.fnRefreshDom();
                    $scope.fnHide();
                    $location.url('/verify');
                },
                function (failure) {
                    $scope.isProcessing = false;
                    $scope.fnRefreshDom();
                    if (typeof failure === 'undefined' || failure.status !== 409) {
                        toastr.remove();
                        toastr.error('An unexpected error occurred on the server. Please reload the page and try again. If the problem continues, contact us at support@cargly.com.');
                    } else {
                        ErrorMsg.CheckStatusCode(failure.status);
                    }
                }
            );
        }
    };

    $scope.fnOpenTermsOfServiceModal = function (ev) {
        var TermsOfServiceModalController = ['$scope', '$mdDialog', function ($scope, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
                $scope.fnOpenSignUp();
            };

            $scope.fnOpenSignUp = function () {
                $mdDialog.show({
                    controller: 'SignUpCtrl',
                    templateUrl: 'views/modals/signup.html',
                    targetEvent: ev
                });
            };
        }];
        $mdDialog.show({
            controller: TermsOfServiceModalController,
            templateUrl: 'views/modals/termsOfServiceDialog.html',
            targetEvent: ev
        });
    };

});
