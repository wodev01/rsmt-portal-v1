'use strict';
app.controller('messageHistoryCtrl',
    function ($scope, cookieName, $cookies, $mdDialog, locationService, crmInteractionService) {

        $scope.isLocationsData = $scope.isSegmentsData = false;
        $scope.isLocationDataProcessing = $scope.isSegmentsDataProcessing = false;

        $scope.isCrmInteractionData = $scope.isMoreCrmInteractions = false;
        $scope.isCrmMsgGridShow = false;
        $scope.crmInteractionData = $scope.filter = {};
        $scope.locationOptions = [];
        $scope.segmentsOptions = [];
        $scope.idsObj = {locationId: '', segmentId: ''};
        $scope.isPagingData = true;

        $scope.isProcessingCrmData = true;

        $scope.pagingOptions = {
            pageSize: 20,
            currentPage: 1
        };

        $scope.filter = {
            'page_num': $scope.pagingOptions.currentPage,
            'page_size': $scope.pagingOptions.pageSize,
            'from': moment().format('YYYY-MM-DD'),
            'to': moment().add(1, 'months').format('YYYY-MM-DD')
        };

        $scope.getPagedDataAsync = function (idsObj, paramsObj) {
            $scope.isCrmInteractionData = false;
            $scope.isCrmMsgGridShow = false;
            $scope.isProcessingCrmData = true;

            crmInteractionService.fetchCrmInteraction(idsObj, paramsObj)
                .then(function (data) {
                    var tmpData = [];
                    data.filter(function (obj) {
                        if (obj.status !== 'SCHEDULED')
                            tmpData.push(obj);
                    });

                    data = tmpData;
                    if (data.length !== 0) {
                        $scope.isCrmMsgGridShow = false;
                        $scope.isCrmInteractionData = true;
                        $scope.crmInteractionData = data;
                    } else {
                        $scope.isCrmMsgGridShow = true;
                        $scope.isCrmInteractionData = false;
                    }
                    $scope.isProcessingCrmData = false;
                }, function (error) {
                    toastr.error('Failed retrieving history data.', 'STATUS CODE: ' + error.status);
                    $scope.isProcessingCrmData = false;
                });
        };

        $scope.nameTmpl = '<div class="ui-grid-cell-contents">' +
            '   {{row.entity.customer.first_name}}&nbsp;{{ row.entity.customer.last_name}}' +
            '</div>';

        $scope.infoTmpl = '<div layout="row" class="overflow-auto" layout-padding layout-fill>' +
            '   <div class="padding-0">' +
            '       <div> Email: {{row.entity.customer.email_addresses | joinArray}} </div>' +
            '       <div> Phone: {{row.entity.customer.phone_numbers | tel | joinTelArray}} </div>' +
            '       <div> Address: {{row.entity.customer.address1}} </div>' +
            '   </div></div>';

        $scope.crmInteractionAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '   <md-button class="md-icon-button md-accent" aria-label="View" ' +
            '               ng-click="grid.appScope.fnOpenCrmInteraction(row, $event);">' +
            '       <md-icon md-font-set="fa fa-lg fa-fw fa-external-link"></md-icon>' +
            '       <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
            '   </md-button></div>';

        $scope.crmInteractionGridOptions = {
            data: 'crmInteractionData',
            rowHeight: 80,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {
                    name: 'action',
                    displayName: '',
                    cellTemplate: $scope.crmInteractionAction,
                    width: 50,
                    enableSorting: false,
                    enableColumnMenu: false,
                    enableColumnResize: false
                },
                {
                    field: 'due_date', displayName: 'Due Date',
                    cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 160,
                    enableHiding: false
                },
                {
                    name: 'customer name',
                    cellTemplate: $scope.nameTmpl,
                    displayName: 'Customer Name',
                    minWidth: 150,
                    enableHiding: false
                },
                {
                    name: 'customer info',
                    cellTemplate: $scope.infoTmpl,
                    displayName: 'Customer Info',
                    minWidth: 200,
                    width: 250, enableHiding: false
                },
                {field: 'delivery_type', displayName: 'Delivery', minWidth: 100, enableHiding: false},
                {field: 'status', displayName: 'Status', minWidth: 100, enableHiding: false},
                {
                    field: 'repair_order.closed', displayName: 'Closed',
                    cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 160, enableHiding: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnRefreshGrid = function (idsObj) {
            $scope.filter.page_num = 1;
            $scope.isPagingData = true;
            $scope.getPagedDataAsync(idsObj, $scope.filter);
        };

        $scope.fnDownloadInteractionCSV = function (event, idsObj) {
            var token = $cookies.get(cookieName);

            var DialogController = ['$scope', '$window', 'locationId', 'segmentId',
                function ($scope, $window, locationId, segmentId) {
                    $scope.fnDownload = function () {
                        $mdDialog.hide();
                        $scope.downloadLink = 'https://carglyplatform.appspot.com/partners/api/crm/' +
                            locationId + '/segments/' + segmentId + '/interactions.csv?oauth_token=' + token;
                        $window.open($scope.downloadLink, '_blank');
                    };

                    $scope.fnHide = function () {
                        $mdDialog.hide();
                    };

                }];

            $mdDialog.show({
                locals: idsObj,
                controller: DialogController,
                template: '<md-dialog aria-label="Alert Dialog">' +
                '  <md-dialog-content class="md-padding" layout-padding>' +
                '      <div class="md-title"> Download Interaction CSV </div>' +
                '      <p class="margin-0">This could take some time. Are you sure..?</p>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions layout-margin>' +
                '       <md-button aria-label="download" ' +
                '           class="md-raised md-accent" ng-click="fnDownload();">Download</md-button>' +
                '       <md-button aria-label="cancel" class="md-raised" ng-click="fnHide();">Cancel</md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                targetEvent: event
            }).then(function () {
            }, function (err) {
            });
        };

        $scope.fnOpenCrmInteraction = function (row, event) {
            $scope.fnOpenCrmInteractionModal(row.entity, event);
        };

        $scope.fnOpenCrmInteractionModal = function (obj, event) {
            $mdDialog.show({
                controller: 'manageScheduledMessagesCtrl',
                targetEvent: event,
                templateUrl: 'views/authenticated/crm/modals/manageScheduledMessages.html',
                resolve: {
                    crmInteractionObj: function () {
                        return obj;
                    }
                }
            });
        };

        /*--------------- Locations Filter --------------------------*/
        $scope.fnGetLocationDetails = function () {
            $scope.isLocationsData = false;
            $scope.isLocationDataProcessing = true;

            locationService.fetchLocation().then(function (data) {
                if (data.length != 0) {
                    $scope.isLocationsData = true;
                    $scope.fnCreateLocationDD(data);
                }
                $scope.isLocationDataProcessing = false;
            }, function (error) {
                toastr.error('Failed retrieving locations.', 'STATUS CODE: ' + error.status);
                $scope.isLocationDataProcessing = false;
            });
        };

        $scope.fnCreateLocationDD = function (data) {
            $scope.locationOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.locationOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.idsObj.locationId = $scope.locationOptions[0].id;
            $scope.fnGetSegmentsDetails($scope.idsObj.locationId);
        };

        $scope.fnChangeLocation = function (locationId) {
            $scope.filter.page_num = 1;
            $scope.isPagingData = true;
            $scope.fnGetSegmentsDetails(locationId);
        };
        /*--------------- Locations Filter End --------------------------*/

        /*--------------- Segments Filter --------------------------*/
        $scope.fnGetSegmentsDetails = function (locationId) {
            $scope.isSegmentsData = false;
            $scope.isSegmentsDataProcessing = true;

            crmInteractionService.fetchShopLocationSegments(locationId).then(function (data) {
                if (data.length != 0) {
                    $scope.isSegmentsData = true;
                    $scope.fnCreateSegmentsDD(data);
                }
                $scope.isSegmentsDataProcessing = false;
            }, function (error) {
                toastr.error('Failed retrieving segments.', 'STATUS CODE: ' + error.status);
                $scope.isSegmentsDataProcessing = false;
            });
        };

        $scope.fnCreateSegmentsDD = function (data) {
            $scope.segmentsOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.segmentsOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.idsObj.segmentId = $scope.segmentsOptions[0].id;
            $scope.getPagedDataAsync($scope.idsObj, $scope.filter);
        };

        $scope.fnChangeSegment = function (idsObj) {
            $scope.getPagedDataAsync(idsObj, $scope.filter);
        };
        /*--------------- Segments Filter End --------------------------*/

        /*-------------- Load More CRM Interactions ---------------*/
        $scope.fnLoadMoreCrmInteractions = function (idsObj) {
            if (!$scope.isMoreCrmInteractions) {
                $scope.filter.page_num += 1;
                $scope.isMoreCrmInteractions = $scope.isProcessingCrmData = true;
                $scope.isPagingData = true;

                crmInteractionService.fetchCrmInteraction(idsObj, $scope.filter)
                    .then(function (data) {
                        data = data.filter(function (obj) {
                            if (obj.status !== 'SCHEDULED') {
                                return obj;
                            }
                        });

                        if (data.length != 0) {
                            $scope.crmInteractionData = $scope.crmInteractionData.concat(data);
                        } else {
                            $scope.isPagingData = false;
                        }
                        $scope.isMoreCrmInteractions = $scope.isProcessingCrmData = false;
                    }, function (error) {
                        toastr.error('Failed retrieving scheduled data.', 'STATUS CODE: ' + error.status);
                        $scope.isProcessingCrmData = false;
                    });
            }
        };

        $scope.fnInitMessageHistory = function () {
            $scope.fnGetLocationDetails();
        };

    });