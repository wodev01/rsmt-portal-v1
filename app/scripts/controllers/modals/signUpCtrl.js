'use strict';
app.controller('SignUpCtrl', function ($scope, $location, $mdDialog, globalTimeZone) {

    $scope.user = {
        businessName: '',
        businessZip: '',
        businessTimezone: '',
        businessUrl: '',
        contactName: '',
        contactEmail: '',
        password: ''
    };

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.timeZoneDDOptions = globalTimeZone;

    var HTTP_CONFLICT = 409;
    $scope.user.businessTimezone = 'US/Central';
    $scope.registerUser = function () {
        if ($scope.user.password !== $scope.user.confirmPassword) {
            $scope.error = 'Password must be matched';
        } else {
            $scope.error = '';
            $scope.isProcessing = true;
            $scope.businessForm.$invalid = true;
            CarglyPartner.createPartner($scope.user,
                function () {
                    $scope.user = {
                        businessName: '',
                        businessZip: '',
                        businessTimezone: '',
                        businessUrl: '',
                        contactName: '',
                        contactEmail: '',
                        password: ''
                    };
                    $scope.isProcessing = false;
                    $location.url('/verify');
                },
                function (failure) {
                    if (typeof failure === 'undefined' || failure.status !== HTTP_CONFLICT) {
                        $scope.error = 'An unexpected error occurred on the server. Please reload the page and try again. If the problem continues, contact us at support@cargly.com.';
                    } else {
                        $scope.error = 'The email address provided is already associated with another partner account.';
                    }

                    $scope.isProcessing = false;
                    $scope.businessForm.$invalid = false;
                    $scope.$apply();
                }
            );
        }
    };

    $scope.resendMail = function () {
        CarglyPartner.requestPasswordReset($scope.resendEmail,
            function () {
                Toast.success('Password request send successfully.');
                $scope.hide();
            },
            function () {
                Toast.failure('Something goe\'s, wrong while sending request.');
                $scope.cancel();
            }
        );
    };

    $scope.fnOpenTermsOfServiceModal = function (ev) {
        var TermsOfServiceModalController = ['$scope', '$mdDialog', function ($scope, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
                $scope.fnOpenSignUp();
            };

            $scope.fnOpenSignUp = function(){
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
