'use strict';
app.controller('PaymentCtrl',
    function ($scope, $cookies, $state, $mdDialog, cookieName, localStorage, userObjKey, paymentService) {

        $scope.fnLogout = function () {
            CarglyPartner.logout(function () {
                $cookies.remove(cookieName);
                localStorage.removeItem(userObjKey);
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

        $scope.payment = {isProcessing: false};

        ChargeIO.init({
            public_key: 'm_zuT9A5oAQTilLxkc_PWanQ'
        });

        $scope.fnUpdateUserPaymentInfo = function (payment) {
            payment.isProcessing = true;
            var paymentObj = angular.copy(payment);
            delete paymentObj.isProcessing;
            ChargeIO.create_token(paymentObj, chargeIOResponseHandler,function(response) {
                // Show the errors on the form
                payment.isProcessing = false;
                console.log(response.error.message);
            });
        };

        function chargeIOResponseHandler(response) {
            paymentService.savePaymentInfo(response).then(function(){
                $state.go('main.dashboard');
            });
        }


        $scope.fnInitPaymentInfo = function () {
            if (localStorage.getItem(userObjKey)) {
                $scope.userObj = JSON.parse(unescape(localStorage.getItem(userObjKey)));
            }
        };
    });
