'use strict';
app.controller('HeaderCtrl', function ($scope, $mdDialog) {

    $scope.showSignup = function (ev) {
        $mdDialog.show({
            controller: 'SignUpDialogCtrl',
            templateUrl: 'views/authenticated/settings/modals/signup.tmpl.html',
            targetEvent: ev
        });
    };
});
