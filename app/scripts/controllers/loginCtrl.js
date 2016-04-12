'use strict';
app.controller('LoginCtrl',
    function ($scope, $rootScope, $mdDialog, $mdMedia, $location, paymentService, toastr, ErrorMsg, localStorage, userObjKey) {

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
                    toastr.success('Signed in as ' + response.name);
                    if (response.verified === 'true') {
                        /*paymentService.fetchUserPaymentInfo()
                            .then(function(res) {
                                if (res.status === 404) {
                                    $location.url('/payment');
                                }
                                else {*/
                                    var userSubscriptions = JSON.parse(response.subscriptions);
                                    angular.forEach(userSubscriptions, function (obj) {
                                        if(obj.subscriptions.indexOf('realtime_dashboard') !== -1){
                                            $location.url('/dashboard');
                                        }else{
                                            $location.url('/locations');
                                        }
                                    });
                                /*}
                            });*/
                    } else {
                        $location.url('/verify');
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
