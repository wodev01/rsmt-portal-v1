'use strict';
app.controller('LocationInfoCtrl',
    function ($scope, $rootScope, globalTimeZone, locationService, toastr) {

        $scope.location = {};
        $scope.timeZoneDDOptions = [];
        $scope.timeZoneDDOptions = globalTimeZone;

        $scope.location = locationService.getLocationObj().id ? angular.copy(locationService.getLocationObj()) : {timezone:'US/Central'};

        $scope.saveLocation = function (location) {
            var id = null;
            if (location.id){id = location.id;}
            locationService.saveLocation(id, location).then(function(res){
                if(res === null || res.location_id){
                    $rootScope.$broadcast('refreshLocations');
                    toastr.success('Location saved successfully.');
                }else{
                    toastr.error('Location can\'t saved.Invalid information.');
                }

                if (location.id) {
                    $scope.$parent.fnCloseLocationManageSwap();
                } else {
                    $scope.$parent.closeNewLocationSwap();
                }
            });
        };

        $scope.fnResetForm = function () {
            $scope.location = {timezone: 'US/Central'};
            $scope.locationForm.$setUntouched();
        };

    });
