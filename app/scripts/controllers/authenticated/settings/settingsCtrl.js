'use strict';
app.controller('SettingsCtrl', function ($scope, $stateParams) {
    $scope.tabs = [
        { title: 'ACCOUNT SETTINGS', viewName:'accountSettings', settingsName:'accountSettings', path:'views/authenticated/settings/accountSettings.html'},
        { title: 'USERS', viewName:'user', settingsName:'users', path:'views/authenticated/settings/users.html'},
        { title: 'BILLING HISTORY', viewName:'billingHistory', settingsName:'billingHistory', path:'views/authenticated/settings/billingHistory.html'}
    ];

    $scope.tabInit = function(){
        for(var intIndex = 0;intIndex<$scope.tabs.length    ;intIndex++){
            if($scope.tabs[intIndex].settingsName === $stateParams.settingsName){
                $scope.selectedIndex = intIndex;
            }
        }
    };

    $scope.clearView = function(){
        if(!$scope.$$phase) {
            $('.tabView').empty();
        }
    };
});
