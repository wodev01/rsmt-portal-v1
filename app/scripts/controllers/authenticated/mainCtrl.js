'use strict';

app.controller('MainCtrl', function ($scope, $mdDialog, $location, $cookies, cookieName, $state, $mdSidenav) {

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

    $scope.fnStateSettings = function () {
        $state.go('main.settings', {'settingsName': 'account'});
    };

    $scope.fnInitMain = function () {
        if (localStorage.getItem('userObj')) {
            $scope.userObj = JSON.parse(localStorage.getItem('userObj'));
            $scope.userSubscriptions = JSON.parse($scope.userObj.subscriptions);
        }
    };

    $scope.fnCheckSubscription = function (userSubscriptions, subscriptions) {
        var hasSubscriptions = true;
        if(userSubscriptions) {
            angular.forEach(userSubscriptions, function (obj) {
                angular.forEach(subscriptions, function (value) {
                    if (hasSubscriptions) {
                        if (obj.subscriptions.indexOf(value) === -1) {
                            hasSubscriptions = false;
                        }
                    }
                });
            });
        }
        return hasSubscriptions;
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
});
