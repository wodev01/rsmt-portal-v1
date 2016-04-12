'use strict';
app.controller('SettingsCtrl', function ($scope, $stateParams) {
    $scope.tabs = [
        {
            title: 'ACCOUNT SETTINGS',
            viewName: 'account',
            settingsName: 'account',
            path: 'views/authenticated/settings/accountSettings.html'
        },
        {
            title: 'USERS',
            viewName: 'user',
            settingsName: 'users',
            path: 'views/authenticated/settings/users.html'
        },
        {
            title: 'BILLING HISTORY',
            viewName: 'billingHistory',
            settingsName: 'billingHistory',
            path: 'views/authenticated/settings/billingHistory.html'
        }
    ];

    $scope.selectedIndex = 0;

    $scope.tabInit = function () {
        for (var intIndex = 0; intIndex < $scope.tabs.length; intIndex++) {
            if ($scope.tabs[intIndex].settingsName === $stateParams.settingsName) {
                $scope.selectedIndex = intIndex;
            }
        }
    };

});
