'use strict';
app.controller('LoginCtrl',
    function ($scope, $rootScope, $mdDialog, $mdMedia, $state, toastr, ErrorMsg, localStorage, userObjKey) {

        $scope.user = {isProcessing: false};

        $scope.fnRefreshDom = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.fnSignInUser = function (user) {
            user.isProcessing = true;
            CarglyPartner.login(user.email, user.password,
                function (response) {
                    user.isProcessing = false;
                    $scope.fnRefreshDom();
                    localStorage.setItem(userObjKey,escape(JSON.stringify(response)));
                    if (response.verified === 'true') {
                        $rootScope.loginUserName = response.name;
                        toastr.success('Signed in as ' + $rootScope.loginUserName);
                        $state.go('main.dashboard');
                    }
                },
                function (rejection) {
                    user.isProcessing = false;
                    $scope.fnRefreshDom();
                    if (rejection) {
                        ErrorMsg.CheckStatusCode(rejection.status);
                    }
                    else {
                        toastr.error('Username and password are wrong.');
                    }
                }
            );
        };

        $scope.fnForgotPassword = function (ev) {
            $mdDialog.show({
                controller: 'ForgotPasswordCtrl',
                templateUrl: 'views/modals/forgotPassword.html',
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

    });
