'use strict';
app.controller('newLocationsCtrl',
    function ($scope, $rootScope, toastr, globalTimeZone, locationService) {

        $scope.location = {timezone: 'US/Central'};

        $scope.fnSaveLocation = function (location) {
            locationService.saveLocation('',location)
                .then(function (response) {
                    toastr.success('Location save successfully.');
                    $scope.location = {timezone: 'US/Central'};
                    $scope.locationForm.$setUntouched();
                    $rootScope.$broadcast('RefreshLocationsGrid');

                }, function (error) {
                    toastr.error('Can\'t be saved, repeated email or invalid information.',
                        'STATUS CODE: ' + error.status);
                });

            $scope.closeNewLocationSwap();
        };

        $scope.fnInitLocation = function () {
            $scope.timeZoneDDOptions = globalTimeZone;
        };

    });
