'use strict';
app.controller('ResetPasswordCtrl',
    function ($scope, $location, toastr) {
        $scope.pass = {isProcessing:false};

        $scope.fnResetPassword = function(pass) {
            if (pass.password !== pass.retypePassword) {
                toastr.error('Password must be matched.');
            } else {
                pass.isProcessing = true;
                var passObj = angular.copy(pass);
                delete passObj.isProcessing;
                CarglyPartner.resetPassword(passObj, function() {
                    pass.isProcessing = false;
                    toastr.success('Password changed successfully.');
                    $location.url('/login');
                }, function() {
                    pass.isProcessing = false;
                    toastr.error('Something goe\'s wrong, while resetting password.');
                });
            }
            return false;
        };

    });
