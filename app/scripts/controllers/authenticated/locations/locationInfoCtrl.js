'use strict';
app.controller('LocationInfoCtrl',
    function ($scope, $rootScope, globalTimeZone, locationService, toastr) {

        $scope.location = {};
        $scope.timeZoneDDOptions = [];
        $scope.timeZoneDDOptions = globalTimeZone;

        if ($rootScope.editLocation) {
            $scope.location = angular.copy($rootScope.editLocation);
        } else {
            $scope.location = {
                locationId: '',
                name: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                timezone: 'US/Central',
                zip: ''
            };
        }

        $scope.saveLocation = function (location) {
            var id = null;
            if (location.id){id = location.id;}
            $scope.isSaveBtnDisabled = true;
            $scope.isProcessing = true;
            locationService.saveLocation(id, location).then(function(res){
                $scope.isSaveBtnDisabled = false;
                $scope.isProcessing = false;
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
