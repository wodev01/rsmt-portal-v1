'use strict';
app.controller('CrmCtrl', function ($scope,$rootScope) {
    $scope.selectedCrmTab = 0;

    $scope.$watch('selectedCrmTab', function(current){
        $scope.selectedCrmTab = current;
        $rootScope.selectedTabIndex = $scope.selectedCrmTab;
    });
});
