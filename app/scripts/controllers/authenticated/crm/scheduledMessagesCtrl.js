'use strict';
app.controller('scheduledMessagesCtrl',
    function ($scope, cookieName, $filter, $cookies, $mdDialog, $timeout,
              encodeParamService, locationService, crmInteractionService) {

        $scope.isLocationDataProcessing = $scope.isSegmentsDataProcessing = false;

        $scope.isLocationsData = $scope.isSegmentsData = false;
        $scope.isCrmInteractionData = $scope.isMoreCrmInteractions = false;
        $scope.isCrmMsgGridShow = false;
        $scope.crmInteractionData = $scope.filter = {};
        $scope.locationOptions = [];
        $scope.segmentsOptions = [];
        $scope.idsObj = {locationId: '', segmentId: ''};
        $scope.isPagingData = true;

        $scope.isProcessingCrmData = false;
        $scope.dateRangeObj = {};

        $scope.pagingOptions = {
            pageSize: 20,
            currentPage: 1
        };

        $scope.filter = {
            'page_num': $scope.pagingOptions.currentPage,
            'page_size': $scope.pagingOptions.pageSize,
            'status': '',
            'deliveryType': ''
        };

        $scope.getPagedDataAsync = function (idsObj, paramsObj) {
            $scope.isCrmInteractionData = false;
            $scope.isCrmMsgGridShow = false;
            $scope.isProcessingCrmData = true;
            $scope.fnToggleDateRange();

            crmInteractionService.fetchCrmInteraction(idsObj, paramsObj)
                .then(function (data) {
                    if (data.length !== 0) {
                        $scope.isCrmMsgGridShow = false;
                        $scope.isCrmInteractionData = true;
                        $scope.crmInteractionData = data;
                    } else {
                        $scope.isCrmMsgGridShow = true;
                        $scope.isCrmInteractionData = false;
                    }
                    $scope.isProcessingCrmData = false;
                    $scope.fnToggleDateRange();
                }, function (error) {
                    toastr.error('Failed retrieving scheduled data.', 'STATUS CODE: ' + error.status);
                    $scope.isProcessingCrmData = false;
                    $scope.fnToggleDateRange();
                });
        };

        $scope.nameTmpl = '<div class="ui-grid-cell-contents">' +
            '   {{row.entity.customer.first_name}}&nbsp;{{ row.entity.customer.last_name}}' +
            '</div>';

        $scope.infoTmpl = '<div layout="row" class="overflow-auto" layout-padding layout-fill>' +
            '<div class="padding-0"><div> Email: {{row.entity.customer.email_addresses | joinArray}} </div>' +
            '     <div> Phone: {{row.entity.customer.phone_numbers | tel | joinTelArray}} </div>' +
            '     <div> Address: {{row.entity.customer.address1}} </div>' +
            '</div></div>';

        $scope.crmInteractionAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '<md-button class="md-icon-button md-accent" aria-label="View" ' +
            '           ng-click="grid.appScope.fnOpenCrmInteraction(row, $event);">' +
            '   <md-icon md-font-set="fa fa-lg fa-fw fa-external-link"></md-icon>' +
            '   <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
            '</md-button></div>';

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
                    cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 160, enableHiding: false
                },
                {
                    name: 'name',
                    cellTemplate: $scope.nameTmpl,
                    displayName: 'Customer Name',
                    minWidth: 150,
                    enableHiding: false
                },
                {
                    name: 'customerInfo',
                    cellTemplate: $scope.infoTmpl,
                    displayName: 'Customer Info',
                    minWidth: 250,
                    enableHiding: false
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

        $scope.fnRefreshGrid = function (dateRangeObj) {
            fnGetDateRange(dateRangeObj);
        };

        $scope.fnDownloadInteractionCSV = function (event, idsObj) {
            var token = $cookies.get(cookieName);

            var DialogController = ['$scope', '$window', 'idsObj', 'filterObj',
                function ($scope, $window, idsObj, filterObj) {
                    var filter = angular.copy(filterObj);
                    angular.forEach(filter, function (val, key) {
                        if (key === 'page_num' || key === 'page_size')
                            delete filter[key];
                    });

                    filter.oauth_token = token;

                    $scope.fnDownload = function () {
                        $mdDialog.hide();
                        $scope.downloadLink = 'https://carglyplatform.appspot.com/partners/api/crm/' +
                            idsObj.locationId + '/segments/' + idsObj.segmentId + '/interactions.csv' +
                            encodeParamService.getEncodedParams(filter);
                        $window.open($scope.downloadLink, '_blank');
                    };

                    $scope.fnHide = function () {
                        $mdDialog.hide();
                    };

                }];

            $mdDialog.show({
                locals: {idsObj: idsObj, filterObj: $scope.filter},
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

        $scope.fnOpenCrmInteractionModal = function (obj, ev) {
            $mdDialog.show({
                controller: 'manageScheduledMessagesCtrl',
                targetEvent: ev,
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
                if (data.length !== 0) {
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
            delete $scope.filter['from'];
            delete $scope.filter['to'];
            $scope.filter['status'] = '';
            $scope.filter['deliveryType'] = '';
            $("#scheduled-messages-tab #pickDateRange").daterangepicker("clearRange");
            $scope.fnGetSegmentsDetails(locationId);
        };
        /*--------------- Locations Filter End --------------------------*/

        /*--------------- Segments Filter --------------------------*/
        $scope.fnGetSegmentsDetails = function (locationId) {
            $scope.isSegmentsData = false;
            $scope.isSegmentsDataProcessing = true;

            crmInteractionService.fetchShopLocationSegments(locationId).then(function (data) {
                if (data.length !== 0) {
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
        };

        $scope.fnChangeSegment = function (idsObj) {
            $scope.filter.page_num = 1;
            $scope.isPagingData = true;
            delete $scope.filter['from'];
            delete $scope.filter['to'];
            $scope.filter['status'] = '';
            $scope.filter['deliveryType'] = '';
            $("#scheduled-messages-tab #pickDateRange").daterangepicker("clearRange");
            $scope.getPagedDataAsync(idsObj, $scope.filter);
        };
        /*--------------- Segments Filter End --------------------------*/

        /*-------------- Load More CRM Interactions ---------------*/
        $scope.fnLoadMoreCrmInteractions = function (idsObj) {
            if (!$scope.isMoreCrmInteractions) {
                $scope.filter.page_num += 1;
                $scope.isMoreCrmInteractions = $scope.isProcessingCrmData = true;
                $scope.isPagingData = true;
                $scope.fnToggleDateRange();

                crmInteractionService.fetchCrmInteraction(idsObj, $scope.filter)
                    .then(function (data) {
                        if (data.length != 0) {
                            $scope.crmInteractionData = $scope.crmInteractionData.concat(data);
                        } else {
                            $scope.isPagingData = false;
                        }
                        $scope.isMoreCrmInteractions = $scope.isProcessingCrmData = false;
                        $scope.fnToggleDateRange();
                    }, function (error) {
                        toastr.error('Failed retrieving scheduled data.', 'STATUS CODE: ' + error.status);
                        $scope.isProcessingCrmData = false;
                        $scope.fnToggleDateRange();
                    });
            }
        };

        $scope.fnChangeFilter = function (filter) {
            filter.page_num = 1;
            $scope.isPagingData = true;
            $scope.getPagedDataAsync($scope.idsObj, filter);
        };

        function fnGetDateRange(dateRangeObj) {
            if (dateRangeObj && Object.keys(dateRangeObj).length !== 0) {
                $scope.filter['from'] = $filter('date')(dateRangeObj.start, 'yyyy-MM-dd');
                $scope.filter['to'] = $filter('date')(dateRangeObj.end, 'yyyy-MM-dd');
            } else {
                delete $scope.filter['from'];
                delete $scope.filter['to'];
            }
            $scope.fnChangeFilter($scope.filter);
        }

        $scope.fnToggleDateRange = function () {
            if ($scope.isProcessingCrmData) {
                $('.comiseo-daterangepicker-triggerbutton.ui-button').css('cursor', 'wait');
                $('.comiseo-daterangepicker-triggerbutton.ui-button').attr('disabled', 'true');
            } else {
                $('.comiseo-daterangepicker-triggerbutton.ui-button').css('cursor', '');
                $('.comiseo-daterangepicker-triggerbutton.ui-button').removeAttr('disabled');
            }
        };

        $scope.fnCreateDateRangePicker = function () {
            $timeout(function () {
                $('.comiseo-daterangepicker-triggerbutton.ui-button').css('cursor', 'wait');
                $('.comiseo-daterangepicker-triggerbutton.ui-button').attr('disabled', 'true');
            });
            $scope.getPagedDataAsync($scope.idsObj, $scope.filter);
        };

        $scope.fnInitScheduledMessages = function () {
            $scope.fnGetLocationDetails();
        };

    });
