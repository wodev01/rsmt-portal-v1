'use strict';
app.controller('LocationsCtrl',
    function ($scope, $mdSidenav, $rootScope, $mdDialog, $timeout, locationService) {

        $rootScope.editLocation = '';
        $scope.rightView = 'views/authenticated/locations/newLocation.html';
        $scope.rightEditView = 'views/authenticated/locations/manageLocation.html';

        $scope.isTabsLoad = false;
        $scope.locationData = [];
        $scope.selectedLocationTab = 0;

        // Swapping view open function.
        $scope.fnOpenNewLocationSwap = function () {
            $timeout(function () {
                $scope.rightView = '';
                $scope.$apply();
                $scope.rightView = 'views/authenticated/locations/newLocation.html';
                $scope.$apply();
                $mdSidenav('newLocationView').open().then(function () {
                });
            });
        };

        // Create new location.
        $scope.newLocationView = function () {
            $scope.islocationEditable = false;
            $scope.fnOpenNewLocationSwap();
        };

        // Close new location swap-view.
        $scope.closeNewLocationSwap = function () {
            $mdSidenav('newLocationView').close().then(function () {
            });
        };

        /*--------------- Manage Location Swapping View ---------------*/
        // Swapping view open function.
        $scope.fnOpenLocationManageSwap = function () {
            $timeout(function () {
                $scope.rightEditView = '';
                $scope.$apply();
                $scope.rightEditView = 'views/authenticated/locations/manageLocation.html';
                $scope.$apply();
                $mdSidenav('manageLocationView').open().then(function () {
                    $scope.isTabsLoad = true;
                });
            });
        };

        // Swapping view close function
        $scope.fnCloseLocationManageSwap = function () {
            $mdSidenav('manageLocationView').close().then(function () {
                $scope.isTabsLoad = false;
                locationService.setLocationObj({});
            });
        };
        /*--------------- End Manage Location Swapping View ---------------*/

        // Retrieving data from server

        $scope.fnFetchLocationData = function () {
            $scope.isLocationMsgShow = $scope.isLocationDataNotNull = false;
            locationService.fetchLocation().then(function (data) {
                if (data.length !== 0) {
                    $scope.isLocationDataNotNull = true;
                    $scope.isLocationMsgShow = false;
                    $scope.locationData = data;
                } else {
                    $scope.isLocationDataNotNull = false;
                    $scope.isLocationMsgShow = true;
                }

            }, function (error) {
                toastr.error('Failed retrieving location data.', 'STATUS CODE: ' + error.status);
            });
        };


        /*--------------- Location Grid Options ---------------*/
        $scope.locationAction = '<div layout="row">' +
            '<md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnLocationEdit(row)">' +
            '   <md-icon md-font-set="material-icons">visibility</md-icon>' +
            '   <md-tooltip md-direction="top">Open</md-tooltip></md-button>' +
            '<md-button class="md-icon-button md-warn md-hue-2" ng-click="grid.appScope.fnLocationDelete(row,$event);">' +
            '   <md-icon md-font-set="material-icons">delete</md-icon>' +
            '   <md-tooltip md-direction="top">Delete</md-tooltip>' +
            '</md-button>' +
            '</div>';

        $scope.locationGridOptions = {
            data: 'locationData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'name', displayName: 'Name', minWidth: 100, enableHiding: false},
                {field: 'address', displayName: 'Address', minWidth: 100, enableHiding: false},
                {field: 'city', displayName: 'City', minWidth: 100, enableHiding: false},
                {field: 'state', displayName: 'State', minWidth: 100, enableHiding: false},
                {field: 'zip', displayName: 'Zip', minWidth: 100, enableHiding: false},
                {
                    name: 'action',
                    displayName: '',
                    cellTemplate: $scope.locationAction,
                    width: 100,
                    enableSorting: false,
                    enableColumnMenu: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };
        /*--------------- End location Grid Options ---------------*/

        /*--------------- Location grid actions ---------------*/

        $scope.fnLocationDelete = function (row, event) {
            var confirm = $mdDialog.confirm()
                .title('Delete')
                .content('Would you like to delete this location?')
                .ariaLabel('Delete')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                locationService.deleteLocation(row.entity.id).then(function () {
                    $scope.fnFetchLocationData();
                });
            }, function () {
            });
        };

        $scope.fnLocationEdit = function (row) {
            $scope.editLocationName = row.entity.name;
            locationService.setLocationObj(row.entity);
            $scope.fnOpenLocationManageSwap();
        };
        /*--------------- End location grid actions ---------------*/

        // Grid listener for data change events.
        $scope.$on('RefreshLocations', function () {
            $scope.fnFetchLocationData();
        });

        // Initialization
        $scope.fnInitLocations = function () {
            $scope.fnFetchLocationData();
        };

        $rootScope.rightView = 'views/authenticated/locations/newLocation.html';
        $rootScope.rightEditView = 'views/authenticated/locations/manageLocation.html';

    });

