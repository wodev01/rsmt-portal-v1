'use strict';
app.controller('HeaderCtrl', function ($scope, $mdDialog) {

    $scope.showSignup = function (ev) {
        $mdDialog.show({
            controller: 'SignUpCtrl',
            templateUrl: 'views/modals/signup.html',
            targetEvent: ev
        });
    };
});
