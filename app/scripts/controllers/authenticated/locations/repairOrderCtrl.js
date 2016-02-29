'use strict';
app.controller('repairOrderCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog, userService, locationService) {
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

        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.repairOrdersData = pagedData;
            $scope.repairOrderTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (pageSize, page) {
            // repair Order call
            if($rootScope.editLocation) {
                $scope.locationID = $rootScope.editLocation.id;
                locationService.repairOrder($scope.locationID)
                    .then(function(data) {
                        if (data.length !== 0) {
                            $scope.isDataNotNull = true;
                            $scope.isMsgShow = false;
                            $scope.setPagingData(data, page, pageSize);
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

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    $scope.pagingOptions.currentPage = 1; //  this will also trigger this same watch
                } else {
                    // update the grid with new data
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.repairOrderFilterOptions.filterText);
                }
            }
        }, true);

        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.repairOrderFilterOptions.filterText);
            }
        }, true);

        $scope.roAction = '<div layout="row">' +
            '<md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnViewRODetails($event,row)">' +
            '<md-icon md-font-set="material-icons">launch</md-icon>' +
            '<md-tooltip md-direction="top">View</md-tooltip></md-button></div>';
        $scope.repairOrderGridOptions = {
            data: 'repairOrdersData',
            rowHeight: 50,
            multiSelect:false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableGridMenu:true,
            enableVerticalScrollbar: 0,
            totalServerItems: 'repairOrderTotalServerItems',
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
            ]
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

    });
