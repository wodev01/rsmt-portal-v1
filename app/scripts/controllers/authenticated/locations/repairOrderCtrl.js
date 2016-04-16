'use strict';
app.controller('repairOrderCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $cookies, $state, $mdDialog, userService, locationService) {

        var _paginationPageSize = 5;

        $scope.repairOrderFilterOptions = {
            filterText: '',
            useExternalFilter: false
        };

        $scope.repairOrderTotalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 5,
            currentPage: 1
        };

        $scope.getPagedDataAsync = function () {
            // repair Order call
            if(locationService.getLocationObj().id) {
                $scope.locationID = locationService.getLocationObj().id;
                locationService.repairOrder($scope.locationID)
                    .then(function(data) {
                        if (data.length !== 0) {
                            $scope.isDataNotNull = true;
                            $scope.isMsgShow = false;
                            $scope.repairOrdersData =  data;
                            var tempData = angular.copy(data);
                            if ($scope.gridApi) {
                                $scope.filteredData = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
                            } else {
                                $scope.filteredData = tempData.slice(0, _paginationPageSize);
                            }
                        } else {
                            $scope.isDataNotNull = false;
                            $scope.isMsgShow = true;
                        }
                    }, function (error) {
                    });
            }
        };

        $scope.$on('refreshrepairOrders', function () {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        });

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.roAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '   <md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnViewRODetails($event,row);">' +
            '       <md-icon md-font-set="material-icons">launch</md-icon>' +
            '       <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
            '   </md-button></div>';

        $scope.repairOrderGridOptions = {
            data: 'repairOrdersData',
            rowHeight: 50,
            multiSelect:false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableGridMenu:true,
            enableVerticalScrollbar: 0,
            paginationPageSize: 5,
            paginationPageSizes: [5, 10, 25, 50],
            columnDefs: [
                {displayName:'',"name":"Action", cellTemplate: $scope.roAction, width:50, enableSorting:false, enableColumnMenu: false},
                {field: 'closed', displayName: 'Closed', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 180},
                {field: 'inspection', displayName: 'Inspection', cellFilter: 'inspection', minWidth: 100},
                {field: 'order_number', displayName: 'RO #', minWidth: 100},
                {field: 'customer.last_name', displayName: 'Customer', minWidth: 180},
                {field: 'customer.phone_numbers', displayName: 'Phone', cellFilter: 'joinTelArray', minWidth: 200},
                {field: 'customer.email_addresses', displayName: 'Email', cellFilter: 'joinArray', minWidth: 200},
                {field: 'customer.postal_code', displayName: 'Postal Code', minWidth: 100},
                {field: 'vehicle.year', displayName: 'Year', minWidth: 80},
                {field: 'vehicle.make', displayName: 'Make', minWidth: 100},
                {field: 'vehicle.model', displayName: 'Model', minWidth: 100},
                {field: 'total_sold_price_cents', displayName: 'Total RO $', cellFilter: 'CentToDollar',  minWidth: 100},
                {field: 'labor', displayName: 'Sold', cellFilter: 'sumOfValue:"sold_seconds" | toHHMMSS', visible: false, minWidth: 100},
                {field: 'labor', displayName: 'Actual', cellFilter: 'sumOfValue:"actual_seconds" | toHHMMSS', visible: false, minWidth: 100}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });

                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    $scope.filteredData = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
                });
            }
        };

        $scope.fnViewRODetails = function (ev, row) {
            $scope.fnOpenRepairOrderModal(ev, row.entity);
        };

        /*---------- Repair Order Dialog --------------------*/
        $scope.fnOpenRepairOrderModal = function (ev, repairOrder) {
            $mdDialog.show({
                controller: 'repairOrderModalCtrl',
                templateUrl: 'views/authenticated/locations/modals/roDetailsDialog.html',
                targetEvent: ev,
                resolve: {
                    repairOrder: function () {
                        return repairOrder;
                    },
                    repairOrders: function () {
                        return $scope.repairOrdersData;
                    }
                }
            });
        };
        /*---------------------- End Repair Orders -----------------------------*/

        $scope.setClickedRow = function (groupIndex, rowIndex) {
            $scope.selectedGroup = groupIndex;
            $scope.selectedRow = rowIndex;
        };

    });
