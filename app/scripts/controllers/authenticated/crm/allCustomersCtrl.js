'use strict';
app.controller('allCustomersCtrl',
    function ($scope, cookieName, $cookies, $mdDialog, locationService, allCustomerService) {

        $scope.isLocationsData = false;
        $scope.locationOptions = [];
        $scope.idsObj = {locationId: '', segmentId: ''};

        var locId = '';
        $scope.customerIndex = 0;
        $scope.vehicleObj = null;
        $scope.selectedRow = null;
        $scope.breadcrumbArr = [{name: 'Customers'}];
        $scope.searchCustomerFilter = '';
        $scope.isMsgShow = false;
        $scope.customerFilter = {};

        $scope.fnFilterKeyEvent = function (searchCustomerFilter) {
            $scope.getPagedDataAsync(searchCustomerFilter, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.customersFilterOptions = {
            filterText: '',
            useExternalFilter: false
        };

        $scope.customersTotalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 5,
            currentPage: 1
        };

        $scope.setPagingData = function (data) {
            var pagedData = data; //data.slice((page - 1) * pageSize, page * pageSize);
            $scope.customersData = pagedData;
            $scope.customersTotalServerItems = pagedData.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (searchText, pageSize, page) {
            $scope.isDataNotNull = false;
            $scope.isMsgShow = false;

            if (locId) {
                allCustomerService.customersData(locId, searchText).then(function (data) {
                    if (data.length !== 0) {
                        $scope.isDataNotNull = true;
                        $scope.isMsgShow = false;
                        $scope.setPagingData(data, page, pageSize);
                    } else {
                        $scope.isDataNotNull = false;
                        $scope.isMsgShow = true;
                    }
                });
            }
        };

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    $scope.pagingOptions.currentPage = 1; //  this will also trigger this same watch
                } else {
                    // update the grid with new data
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.customersFilterOptions.filterText);
                }
            }
        }, true);

        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.customersFilterOptions.filterText);
            }
        }, true);

        $scope.customerAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '   <md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnViewCustomerDetails($event,row);">' +
            '       <md-icon md-font-set="material-icons">visibility</md-icon>' +
            '       <md-tooltip ng-if="$root.isMobile == null" md-direction="top">Open</md-tooltip>' +
            '   </md-button></div>';

        $scope.customersGridOptions = {
            data: 'customersData',
            rowHeight: 50,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            enableFiltering: true,
            multiSelect: false,
            columnDefs: [
                {
                    displayName: '',
                    name: 'Action',
                    cellTemplate: $scope.customerAction,
                    minWidth: 50,
                    width: '50',
                    enableSorting: false,
                    enableColumnMenu: false,
                    enableFiltering: false
                },
                {field: 'first_name', displayName: 'First Name', minWidth: 200, enableHiding: false},
                {field: 'last_name', displayName: 'Last Name', minWidth: 200, enableHiding: false},
                {field: 'company', displayName: 'Company', minWidth: 200, enableHiding: false},
                {
                    field: 'phone_numbers',
                    displayName: 'Phone',
                    cellFilter: 'joinTelArray',
                    minWidth: 200,
                    enableHiding: false
                },
                {
                    field: 'email_addresses',
                    displayName: 'Email',
                    cellFilter: 'joinArray',
                    minWidth: 200,
                    enableHiding: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnOnSelectBreadcrumb = function (customerIndex) {
            $scope.customerIndex = customerIndex;
            $scope.breadcrumbArr.splice(customerIndex + 1, $scope.breadcrumbArr.length);
        };

        $scope.fnViewCustomerDetails = function (ev, row) {
            $scope.intGridIndex = row.rowIndex;
            $scope.customerIndex = 1;
            $scope.customer = row.entity;
            $scope.breadcrumbArr.push({name: row.entity.first_name + ' ' + row.entity.last_name});
        };

        $scope.fnViewVehicleDetails = function (obj) {
            $scope.customerIndex = 2;
            $scope.vehicleObj = obj;
            $scope.breadcrumbArr.push({
                name: obj.year + ' ' + obj.make + ' ' + obj.model
            });
        };

        $scope.setClickedRow = function (index) {
            $scope.selectedRow = index;
        };

        $scope.fnChangeFilter = function (customerFilter) {
            $scope.getPagedDataAsync(customerFilter, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        /*--------------- Locations Filter --------------------------*/
        $scope.fnGetLocationDetails = function () {
            $scope.isLocationsData = false;

            locationService.fetchLocation().then(function (data) {
                if (data.length != 0) {
                    $scope.isLocationsData = true;
                    $scope.fnCreateLocationDD(data);
                }
            });
        };

        $scope.fnCreateLocationDD = function (data) {
            $scope.locationOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.locationOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            locId = $scope.idsObj.locationId = $scope.locationOptions[0].id;
            $scope.fnFilterKeyEvent($scope.searchCustomerFilter);
        };

        $scope.fnChangeLocation = function (locationId) {
            locId = locationId;
            angular.element('#crm-pane #customerTab form input.filterBox').val('');
            $scope.fnOnSelectBreadcrumb(0);
            $scope.getPagedDataAsync($scope.searchCustomerFilter, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };
        /*--------------- Locations Filter End --------------------------*/

        $scope.fnInitAllCustomers = function () {
            $scope.fnGetLocationDetails();
        };

    });
