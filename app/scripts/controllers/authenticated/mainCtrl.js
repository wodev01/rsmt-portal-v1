'use strict';

app.controller('MainCtrl', function ($scope, $mdDialog, $location, $cookies, cookieName, $state) {

    $scope.fnToggleSideNav = function (componentId) {
        $mdSidenav(componentId).toggle();
    };

    $scope.fnIsActive = function (viewLocation) {
        return viewLocation === $location.path() ? 'md-accent' : '';
    };

    $scope.fnLogout = function () {
        CarglyPartner.logout(function () {
            $cookies.remove(cookieName);
            $state.go('login');
        }, function () {
        });
    };

    $scope.fnOpenTermsOfServiceModal = function (ev) {

        $mdDialog.show({
            controller: 'TermsOfUseCtrl',
            templateUrl: 'views/authenticated/settings/modals/termsOfServiceDialog.html',
            targetEvent: ev
        });
    };

    $scope.fnStateSettings = function () {
        $state.go('main.settings', {'settingsName': 'account'});
    };

    $scope.fnInitMain = function () {
        if (localStorage.getItem('userObj')) {
            $scope.userObj = JSON.parse(localStorage.getItem('userObj'));
        }
    };
});
