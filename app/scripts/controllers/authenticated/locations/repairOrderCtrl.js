'use strict';
app.controller('repairOrderCtrl',
    function ($scope, $mdDialog, locationService) {

        var _paginationPageSize = 5;

        $scope.getPagedDataAsync = function () {
            // repair Order call
            if (locationService.getLocationObj().id) {
                var locationID = locationService.getLocationObj().id;
                locationService.repairOrder(locationID)
                    .then(function (data) {
                        if (data.length !== 0) {
                            $scope.isDataNotNull = true;
                            $scope.isMsgShow = false;
                            $scope.repairOrdersData = data;
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
                        toastr.error('Failed retrieving repair order data.', 'STATUS CODE: ' + error.status);
                    });
            }
        };

        $scope.roAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '   <md-button class="md-icon-button md-accent" aria-label="View" ' +
            '              ng-click="grid.appScope.fnViewRODetails($event,row);">' +
            '       <md-icon md-font-set="fa fa-lg fa-fw fa-external-link"></md-icon>' +
            '       <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
            '   </md-button></div>';

        $scope.repairOrderGridOptions = {
            data: 'repairOrdersData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableGridMenu: true,
            enableVerticalScrollbar: 0,
            paginationPageSize: 5,
            paginationPageSizes: [5, 10, 25, 50],
            columnDefs: [
                {
                    name: 'action',
                    displayName: '',
                    cellTemplate: $scope.roAction,
                    width: 50,
                    enableSorting: false,
                    enableColumnMenu: false,
                    enableColumnResize: false
                },
                {field: 'closed', displayName: 'Closed', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 160},
                {field: 'inspection', displayName: 'Inspection', cellFilter: 'inspection', minWidth: 100},
                {field: 'order_number', displayName: 'RO #', minWidth: 100},
                {field: 'customer.last_name', displayName: 'Customer', minWidth: 150},
                {field: 'customer.phone_numbers', displayName: 'Phone', cellFilter: 'joinTelArray', minWidth: 150},
                {field: 'customer.email_addresses', displayName: 'Email', cellFilter: 'joinArray', minWidth: 200},
                {field: 'customer.postal_code', displayName: 'Postal Code', minWidth: 100},
                {field: 'vehicle.year', displayName: 'Year', minWidth: 100},
                {field: 'vehicle.make', displayName: 'Make', minWidth: 100},
                {field: 'vehicle.model', displayName: 'Model', minWidth: 150},
                {field: 'total_sold_price_cents', displayName: 'Total RO $', cellFilter: 'CentToDollar', minWidth: 100},
                {
                    field: 'labor',
                    displayName: 'Sold',
                    cellFilter: 'sumOfValue:"sold_seconds" | toHHMMSS',
                    visible: false,
                    minWidth: 100
                },
                {
                    field: 'labor',
                    displayName: 'Actual',
                    cellFilter: 'sumOfValue:"actual_seconds" | toHHMMSS',
                    visible: false,
                    minWidth: 100
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });

                gridApi.pagination.on.paginationChanged($scope, function () {
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
                templateUrl: 'views/authenticated/dashboard/modals/roDetailsDialog.html',
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

        $scope.fnInitRepairOrders = function () {
            $scope.getPagedDataAsync();
        };

    });