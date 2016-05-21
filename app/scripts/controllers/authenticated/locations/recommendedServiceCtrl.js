'use strict';
app.controller('recommendedServiceCtrl',
    function ($scope, locationService) {

        $scope.getPagedDataAsync = function () {
            if (locationService.getLocationObj().id) {
                var locationID = locationService.getLocationObj().id;
                locationService.recommendedService(locationID)
                    .then(function (data) {
                        if (data.length !== 0) {
                            $scope.isDataNotNull = true;
                            $scope.recommendedServicesData = data;
                        } else {
                            $scope.isDataNotNull = false;
                            $scope.isMsgShow = true;
                        }
                    }, function (error) {
                        toastr.error('Failed retrieving recommended service data.', 'STATUS CODE: ' + error.status);
                    });
            }
        };

        $scope.recommendedServiceGridOptions = {
            data: 'recommendedServicesData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'text', displayName: 'Service', minWidth: '250', enableHiding: false},
                {
                    field: 'recommended_date',
                    displayName: 'Date',
                    cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'',
                    minWidth: '160',
                    enableHiding: false
                },
                {
                    field: 'due_date',
                    displayName: 'Due Date',
                    cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'',
                    minWidth: '160',
                    enableHiding: false
                },
                {field: 'recommendation_type', displayName: 'Type', minWidth: '100', enableHiding: false},
                {
                    field: 'customer.first_name',
                    displayName: 'Customer Name',
                    cellTemplate: '<div class="ui-grid-cell-contents">' +
                    '{{row.entity.customer.first_name}} {{row.entity.customer.last_name}}</div>',
                    minWidth: '150',
                    enableHiding: false
                },
                {
                    field: 'customer.phone_numbers',
                    displayName: 'Phone Numbers',
                    cellFilter: 'joinTelArray',
                    minWidth: '150',
                    enableHiding: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnInitRecommendedService = function () {
            $scope.getPagedDataAsync();
        };

    });