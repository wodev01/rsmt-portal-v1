'use strict';
app.controller('scheduledMessagesCtrl',
    function ($scope, cookieName, $filter, $cookies, $mdDialog,$timeout,
              encodeParamService, locationService, crmInteractionService) {

        $scope.isLocationsData = $scope.isSegmentsData = false;
        $scope.isCrmInteractionData = $scope.isMoreCrmInteractions = false;
        $scope.isCrmMsgGridShow = false;
        $scope.crmInteractionData = $scope.filter = {};
        $scope.locationOptions = [];
        $scope.segmentsOptions = [];
        $scope.idsObj = {locationId:'', segmentId:''};
        $scope.isPagingData = true;

        $scope.pagingOptions = {
            pageSize: 20,
            currentPage: 1
        };

        $scope.filter = {
            'page_num' : $scope.pagingOptions.currentPage,
            'page_size' : $scope.pagingOptions.pageSize,
            'status': '',
            'deliveryType': ''
        };

        $scope.getPagedDataAsync = function (idsObj, paramsObj) {
            $scope.isCrmInteractionData = false;
            $scope.isCrmMsgGridShow = false;

            crmInteractionService.fetchCrmInteraction(idsObj, paramsObj)
                .then(function(data){
                    if(data.length !== 0){
                        $scope.isCrmMsgGridShow = false;
                        $scope.isCrmInteractionData = true;
                        $scope.crmInteractionData = data;
                    }else{
                        $scope.isCrmMsgGridShow = true;
                        $scope.isCrmInteractionData = false;
                    }
                });
        };

        $scope.nameTmpl = '<div layout="row" class="md-padding">'
            + '<span>'
            + '{{row.entity.customer.first_name}}&nbsp;{{ row.entity.customer.last_name}}'
            + '</span></div>';

        $scope.infoTmpl = '<div layout="row" class="md-padding">'
            + '<div>'
            + '     <div> Email: {{row.entity.customer.email_addresses | joinArray}} </div>'
            + '     <div> Phone: {{row.entity.customer.phone_numbers | tel | joinTelArray}} </div>'
            + '     <div> Address: {{row.entity.customer.address1}} </div>'
            + '</div></div>';

        $scope.crmInteractionAction = '<div layout="row">' +
            '<md-button class="md-icon-button md-accent" ng-click="grid.appScope.fnOpenCrmInteraction(row)">' +
            '<md-icon md-font-set="material-icons">visibility</md-icon>' +
        '<md-tooltip md-direction="top">Open</md-tooltip></md-button>' +
            '</div>';


        $scope.crmInteractionGridOptions = {
            data: 'crmInteractionData',
            enableSorting: false,
            rowHeight: 80,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                { name:'Action', displayName:'', cellTemplate: $scope.crmInteractionAction, width: 50, enableSorting:false, enableColumnMenu: false},
                { field: 'due_date', displayName: 'Due Date',
                    cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth:150 },
                { name:'name', cellTemplate: $scope.nameTmpl, displayName: 'Customer Name', minWidth:150 },
                { name:'customerInfo', cellTemplate: $scope.infoTmpl, displayName: 'Customer Info', minWidth:250 },
                { field: 'delivery_type', displayName: 'Delivery', width: 100 },
                { field: 'status', displayName: 'Status', width: 120 },
                { field: 'repair_order.closed', displayName: 'Closed',
                    cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth:180 }
            ]
        };

        $scope.fnRefreshGrid = function() {
            fnGetDateRange();
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
                locals:  {idsObj : idsObj, filterObj: $scope.filter } ,
                controller: DialogController,
                template: '<md-dialog aria-label="Alert Dialog">' +
                '  <md-content style="padding: 20px 20px 0 20px !important;">' +
                '      <h3> Download Interaction CSV </h3>' +
                '      This could take some time. Are you sure..?' +
                '  </md-content>' +
                '  <md-dialog-actions>' +
                '       <md-button aria-label="download" ' +
                '           class="md-raised md-accent" ng-click="fnDownload();">Download</md-button>' +
                '       <md-button aria-label="cancel" class="md-raised" ng-click="fnHide();">Cancel</md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                targetEvent: event
            }).then(function () {},
                function (err) {});
        };

        $scope.fnOpenCrmInteraction = function(row) {
            $scope.fnOpenCrmInteractionModal(row.entity);
        };

        $scope.fnOpenCrmInteractionModal = function(obj){
            $mdDialog.show({
                controller: 'manageScheduledMessagesCtrl',
                templateUrl: 'views/authenticated/CRM/manageScheduledMessages.html',
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

            locationService.fetchLocation().then(function (data) {
                if(data.length!=0){
                    $scope.isLocationsData = true;
                    $scope.fnCreateLocationDD(data);
                }
            });
        };

        $scope.fnCreateLocationDD = function(data) {
            $scope.locationOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.locationOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.idsObj.locationId = $scope.locationOptions[0].id;
            $scope.fnGetSegmentsDetails($scope.idsObj.locationId);
        };

        $scope.fnChangeLocation = function(locationId) {
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

            crmInteractionService.fetchShopLocationSegments(locationId).then(function (data) {
                if(data.length!=0){
                    $scope.isSegmentsData = true;
                    $scope.fnCreateSegmentsDD(data);
                }
            });
        };

        $scope.fnCreateSegmentsDD = function(data) {
            $scope.segmentsOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.segmentsOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.idsObj.segmentId = $scope.segmentsOptions[0].id;
            $scope.getPagedDataAsync($scope.idsObj, $scope.filter);
        };

        $scope.fnChangeSegment = function(idsObj) {
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
        $scope.fnLoadMoreCrmInteractions = function(idsObj) {
            $scope.filter.page_num += 1;
            $scope.isMoreCrmInteractions = true;
            $scope.isPagingData = true;

            crmInteractionService.fetchCrmInteraction(idsObj, $scope.filter)
                .then(function(data){
                    if (data.length != 0) {
                        $scope.crmInteractionData = $scope.crmInteractionData.concat(data);
                        $scope.isMoreCrmInteractions = false;
                    } else {
                        $scope.isMoreCrmInteractions = $scope.isPagingData = false;
                    }
                });

        };

        $scope.fnChangeFilter = function (filter) {
            filter.page_num = 1;
            $scope.isPagingData = true;

           /* if (filter['status'] === '') {
                delete filter['status'];
            }

            if (filter['deliveryType'] === '') {
                delete filter['deliveryType'];
            }*/

            $scope.getPagedDataAsync($scope.idsObj, filter);
        };

        function fnGetDateRange() {
            var dateRangeObj = $('#scheduled-messages-tab #pickDateRange').daterangepicker('getRange');

            if (dateRangeObj) {
                $scope.filter['from'] = $filter('date')(dateRangeObj.start, 'yyyy-MM-dd');
                $scope.filter['to'] = $filter('date')(dateRangeObj.end, 'yyyy-MM-dd');
            } else {
                delete $scope.filter['from'];
                delete $scope.filter['to'];
            }

            $scope.fnChangeFilter($scope.filter);
        }

        $scope.fnCreateDateRangePicker = function () {
            $timeout(function () {
                $('#scheduled-messages-tab #pickDateRange').daterangepicker({
                    datepickerOptions: {
                        numberOfMonths: 2,
                        maxDate: null
                    },
                    presetRanges: [],
                    initialText: 'Select Date period...',
                    onChange: function () {
                        $scope.fnRefreshGrid();
                    }
                });
            }, 1000);

            $scope.getPagedDataAsync($scope.idsObj, $scope.filter);
        };

        $scope.fnInitScheduledMessages = function() {
            $scope.fnGetLocationDetails();
        };
    });
