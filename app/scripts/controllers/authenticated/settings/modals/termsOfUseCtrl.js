'use strict';

app.controller('TermsOfUseCtrl', function ($scope,$mdDialog) {

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    });
