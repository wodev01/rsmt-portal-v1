'use strict';
app.directive('dropdown', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'views/authenticated/dropdown.tmpl.html',
        scope: {
            placeholder: '@',
            list: '=',
            ddSelected: '=',
            selectedLabel: '=',
            optionValue: '@',
            optionText: '@',
            isSearchFilter: '=',
            isSort: '=',
            ddChange: '&'
        },
        link: function(scope, element) {
            scope.isPlaceholder = true;

            scope.select = function(item,intIndex) {
                var itemsArr = element.find('div.list-item');
                angular.element(itemsArr).each(function(index){
                    if(index!==intIndex){
                        $(this).removeClass('selected');
                    }
                });
                scope.isPlaceholder = false;
                scope.ddSelected = item[scope.optionValue];
                scope.selectedLabel = item[scope.optionText];
            };

            scope.fnInitDDOption = function($last){
                if($last){
                    var longest = scope.list.reduce(function (a, b) { return a.name.length > b.name.length ? a : b; });
                    if (longest.name.length > 30) {
                        element.css('width',longest.name.length * 10+'px');
                    }
                }
            };

            scope.show = function() {
                scope.listVisible = !scope.listVisible;
            };

            scope.$watch('selectedLabel', function(current) {
                scope.isPlaceholder = current === undefined;
                scope.display = current;
            });

            scope.$watch('ddSelected', function(current,old) {
                if(current!==old){
                    scope.ddChange();
                    angular.forEach(scope.list, function(obj) {
                        if (obj.value === current) {
                            scope.selectedLabel = obj.name;
                            return false;
                        }
                    });
                }
            });

            $rootScope.$on('EventListener', function (event, target) {
                event.preventDefault();
                scope.searchText = '';
                if($(target[0]).is('input')){return;}
                if (!$(target[0]).is('.dropdown-display') && !$(target[0]).parents('.dropdown-display').length > 0){
                    scope.$apply(function () {
                        scope.listVisible = false;
                    });
                }
            });

            element.on('keyup',function (e) {
                if (scope.listVisible) {
                    var selected = element.find('div.selected'), item = element.find('div.list-item');
                    if (e.keyCode === 40) { // key-down
                        e.preventDefault();
                        e.stopPropagation();
                        selected.removeClass('selected').next().addClass('selected').find('a').focus();
                        if (selected.next().length === 0) {
                            item.eq(0).addClass('selected');
                        }
                    } else if (e.keyCode === 38) { // key-up
                        e.preventDefault();
                        e.stopPropagation();
                        selected.removeClass('selected').prev().addClass('selected').find('a').focus();
                        if (selected.prev().length === 0) {
                            item.eq(-1).addClass('selected');
                        }
                    } else if (e.keyCode === 13) { // Enter
                        element.find('a.display-anchor').focus();
                    }
                }
            });
        }
    };
}]);

app.directive('recommendedGrid', function($mdDialog, allCustomerService) {
    return {
        restrict: 'EA',
        scope: {
            locId: '=',
            vehicleId: '='
        },
        templateUrl:'views/authenticated/crm/shopLocationsRS.html',
        link : function($scope){
            $scope.isRSDataNotNull = $scope.isRSMsgShow = false;

            var vehicleId = null,locId = null;
            $scope.$watch('vehicleId',function(current){
                vehicleId = current;
                if(current) {
                    $scope.fnSetWatchOnGrid(current);
                    $scope.fnSetGridOptions(current);
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.recommendedServiceFilterOptions.filterText);
                }
            });

            $scope.$watch('locId',function(current){
                locId = current;
                if(current) {
                    $scope.fnSetGridOptions();
                    $scope.getPagedDataAsync();
                }
            });

            $scope.recommendedServiceFilterOptions = {
                filterText: '',
                useExternalFilter: false
            };

            $scope.recommendedServiceTotalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [5, 10, 25, 50],
                pageSize: 5,
                currentPage: 1
            };

            $scope.setPagingData = function (data,page, pageSize) {
                var pagedData = vehicleId ? data.slice((page - 1) * pageSize, page * pageSize) : data;
                $scope.recommendedServicesData = pagedData;
                $scope.recommendedServiceTotalServerItems = data.length;
            };

            $scope.getPagedDataAsync = function (pageSize, page) {
                if(locId){
                    allCustomerService.recommendedService(locId).then(function (data) {
                        if (data.length !== 0) {
                            $scope.isRSDataNotNull = true;
                            $scope.isRSMsgShow = false;
                            $scope.setPagingData(data, page, pageSize);
                        } else {
                            $scope.isRSDataNotNull = false;
                            $scope.isRSMsgShow = true;
                        }
                    });
                }else if(vehicleId) {
                    allCustomerService.customerVehiclesRS(vehicleId).then(function (data) {
                        if (data.length !== 0) {
                            $scope.isRSDataNotNull = true;
                            $scope.isRSMsgShow = false;
                            $scope.setPagingData(data, page, pageSize);
                        } else {
                            $scope.isRSDataNotNull = false;
                            $scope.isRSMsgShow = true;
                        }
                    });
                }
            };

            $scope.fnSetWatchOnGrid = function(id) {
                if (id) {
                    $scope.$watch('pagingOptions', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                            if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                                $scope.pagingOptions.currentPage = 1; //  this will also trigger this same watch
                            } else {
                                // update the grid with new data
                                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.recommendedServiceFilterOptions.filterText);
                            }
                        }
                    }, true);

                    $scope.$watch('filterOptions', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.recommendedServiceFilterOptions.filterText);
                        }
                    }, true);
                }
            };

            $scope.fnSetGridOptions = function(id) {
                var colDffArr = [{field: 'text', displayName: 'Service', minWidth: 200, enableHiding: false},
                    {field: 'recommended_date',displayName: 'Date',cellFilter: 'date:\'MM/dd/yyyy h:mm a\'',minWidth: 200, enableHiding: false},
                    {field: 'due_date',displayName: 'Due Date',cellFilter: 'date:\'MM/dd/yyyy h:mm a\'',minWidth: 200, enableHiding: false},
                    {field: 'recommendation_type', displayName: 'Type', minWidth: 100, enableHiding: false}
                ];
                $scope.tooltip = '<div class="grid-tooltip custom-table" add-tooltip obj="row"></div>';
                if(!id) {
                    colDffArr.unshift({cellTemplate: $scope.tooltip, displayName: 'Recent Labor', minWidth: 50, width:120, sortable:false});
                    colDffArr.push(
                        {field: 'customer.first_name',displayName: 'Customer Name',
                            cellTemplate: '<div class="ngCellText">' +
                            '{{row.getProperty(col.field)}} {{row.entity.customer.last_name}}</div>',minWidth: 220, enableHiding: false},
                        {field: 'customer.phone_numbers',displayName: 'Phone Numbers',
                            cellFilter: 'joinArray',minWidth: 100, enableHiding: false}
                    );
                }
                $scope.recommendedServiceGridOptions = {
                    data: 'recommendedServicesData',
                    rowHeight: 50,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableVerticalScrollbar: 0,
                    filterOptions: $scope.recommendedServiceFilterOptions,
                    multiSelect: false,
                    columnDefs: colDffArr,
                    onRegisterApi: function (gridApi) {
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            row.isSelected = true;
                        });
                    }
                };
            };
        }
    };
});

app.directive('repairOrderGrid', function($mdDialog,allCustomerService) {
    return {
        restrict: 'EA',
        scope: {
            locId: '=',
            vehicleId: '='
        },
        templateUrl:'views/authenticated/crm/shopLocationsRO.html',
        link : function($scope){
            $scope.isRODataNotNull = $scope.isROMsgShow = false;

            var vehicleId = null,locId = null;
            $scope.$watch('vehicleId',function(current){
                vehicleId = current;
                if(current) {
                    $scope.fnSetGridOptions();
                    $scope.getPagedDataAsync();
                }
            });

            $scope.$watch('locId',function(current){
                locId = current;
                if(current) {
                    $scope.fnSetWatchOnGrid(current);
                    $scope.fnSetGridOptions(current);
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.repairOrderFilterOptions.filterText);
                }
            });

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
                var pagedData = locId ? data.slice((page - 1) * pageSize, page * pageSize) : data;
                $scope.repairOrdersData = pagedData;
                $scope.repairOrderTotalServerItems = data.length;
            };

            $scope.getPagedDataAsync = function (pageSize, page) {
                $scope.isRODataNotNull = $scope.isROMsgShow = false;

                if(locId){
                    allCustomerService.repairOrder(locId).then(function (data) {
                        if (data.length !== 0) {
                            $scope.isRODataNotNull = true;
                            $scope.isROMsgShow = false;
                            $scope.setPagingData(data, page, pageSize);
                        } else {
                            $scope.isRODataNotNull = false;
                            $scope.isROMsgShow = true;
                        }
                    });
                }else if(vehicleId) {
                    allCustomerService.customerVehiclesRO(vehicleId).then(function (data) {
                        if (data.length !== 0) {
                            $scope.isRODataNotNull = true;
                            $scope.isROMsgShow = false;
                            $scope.setPagingData(data, page, pageSize);
                        } else {
                            $scope.isRODataNotNull = false;
                            $scope.isROMsgShow = true;
                        }
                    });
                }
            };

            $scope.fnSetWatchOnGrid = function(id) {
                if (id) {
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
                }
            };

            $scope.fnSetGridOptions = function(id) {
                $scope.roAction = '<div layout="row">' +
                    '<md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnViewRODetails($event,row)">' +
                    '<md-icon md-font-set="material-icons">launch</md-icon>' +
                    '<md-tooltip md-direction="top">View</md-tooltip></md-button>' +
                    '</div>';
                var colDffArr = [];
                var intRowHeight = 50;
                if(!id) {
                    intRowHeight = 80;

                    $scope.laborTmpl = '<div class="highLight ui-grid-cell-contents overflow-auto" layout="column" ' +
                        'layout-fill add-description arr="row.entity.labor"></div>';
                    $scope.partsTmpl = '<div class="highLight ui-grid-cell-contents overflow-auto" layout="column" ' +
                        'layout-fill add-description arr="row.entity.parts"></div>';

                    colDffArr = [
                        {name:'action', displayName: '',cellTemplate: $scope.roAction, minWidth: 50, enableColumnMenu: false},
                        {field: 'closed', displayName: 'Closed', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 200},
                        {field: 'inspection', displayName: 'Inspection', cellFilter: 'inspection', minWidth: 110},
                        {field: 'order_number', displayName: 'RO #', minWidth: 100},
                        {name:'labor', cellTemplate: $scope.laborTmpl, displayName: 'Labor', minWidth: 400},
                        {name:'parts', cellTemplate: $scope.partsTmpl, displayName: 'Parts', minWidth: 400},
                        {field: 'total_sold_price_cents', displayName: 'Total RO $', minWidth: 100},
                        {field: 'labor', displayName: 'Sold', cellFilter: 'sumOfValue:"sold_seconds" | toHHMMSS', visible: false, minWidth: 100},
                        {field: 'labor', displayName: 'Actual', cellFilter: 'sumOfValue:"actual_seconds" | toHHMMSS', visible: false, minWidth: 100}
                    ];
                }else{
                    colDffArr =  [
                        {name:'action', displayName: '',cellTemplate: $scope.roAction, minWidth: 50,groupable:false, sortable:false},
                        {field: 'closed', displayName: 'Closed', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 200,groupable:false},
                        {field: 'inspection', displayName: 'Inspection', cellFilter: 'inspection', minWidth: 110,groupable:false},
                        {field: 'order_number', displayName: 'RO #', minWidth: 100,groupable:false},
                        {field: 'customer.last_name', displayName: 'Customer', minWidth: 180,groupable:false},
                        {field: 'customer.phone_numbers', displayName: 'Phone', cellFilter: 'joinTelArray', minWidth: 200,groupable:false},
                        {field: 'customer.email_addresses', displayName: 'Email', cellFilter: 'joinArray', minWidth: 200,groupable:false},
                        {field: 'customer.postal_code', displayName: 'Postal Code', minWidth: 120,groupable:false},
                        {field: 'vehicle.year', displayName: 'Year', minWidth: 80,groupable:false},
                        {field: 'vehicle.make', displayName: 'Make', minWidth: 100,groupable:false},
                        {field: 'vehicle.model', displayName: 'Model', minWidth: 100,groupable:false},
                        {field: 'total_sold_price_cents', displayName: 'Total RO $', cellFilter: 'CentToDollar',  minWidth: 100,groupable:false},
                        {field: 'labor', displayName: 'Sold', cellFilter: 'sumOfValue:"sold_seconds" | toHHMMSS', visible: false, minWidth: 100, groupable:false},
                        {field: 'labor', displayName: 'Actual', cellFilter: 'sumOfValue:"actual_seconds" | toHHMMSS', visible: false, minWidth: 100, groupable:false}
                    ];
                }
                $scope.repairOrderGridOptions = {
                    data: 'repairOrdersData',
                    rowHeight: intRowHeight,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableVerticalScrollbar: 0,
                    multiSelect: false,
                    enableSorting: false,
                    enableGridMenu: true,
                    columnDefs: colDffArr,
                    onRegisterApi: function (gridApi) {
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            row.isSelected = true;
                        });
                    }
                };
            };

            $scope.fnViewRODetails = function (ev, row) {
                $scope.intGridIndex = row.rowIndex;
                $scope.fnOpenRepairOrderModal(ev, row.entity);
            };

            /*---------- Repair Order Dialog --------------------*/
            $scope.fnOpenRepairOrderModal = function (ev, repairOrder) {
                $mdDialog.show({
                    controller: 'repairOrderModalCtrl',
                    templateUrl: 'views/authenticated/locations/modals/roDetailsDialog.html',
                    targetEvent: ev,
                    resolve: {
                        repairOrder: function() {
                            return repairOrder;
                        },
                        repairOrders: function() {
                            return $scope.repairOrdersData;
                        }
                    }
                });
            };
            /*---------------------- End Repair Orders -----------------------------*/
        }
    };
});

app.directive('addDescription', function() {
    return {
        restrict: 'A',
        scope: {
            arr:'='
        },
        link: function (scope, iElement) {
            var html = '';
            angular.forEach(scope.arr, function (objVal) {
                html += '<div style="white-space: normal; line-height: normal;" layout-margin>'
                    + objVal.description + '</div>';
            });
            iElement.append(html);
        }
    };
});
