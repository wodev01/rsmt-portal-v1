'use strict';

app.controller('SignUpDialogCtrl',
    function ($scope, $mdDialog) {

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    });
