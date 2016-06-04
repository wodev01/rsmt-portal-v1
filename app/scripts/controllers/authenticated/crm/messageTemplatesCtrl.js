'use strict';
app.controller('messageTemplatesCtrl',
    function ($scope, $mdDialog, toastr, locationService, crmInteractionService, crmTemplateService, $timeout) {

        $scope.locationOptions = [];
        $scope.isLocationsData = $scope.isLocationDataProcessing = false;

        $scope.crmSegmentsData = [];
        $scope.isCrmSegmentsData = $scope.isCrmSegmentsMsgShow = false;

        $scope.locationId = '';

        $scope.fnFilterByTemplateName = function (templateData) {
            angular.forEach($scope.crmSegmentsData, function (segmentsObj) {
                angular.forEach(templateData, function (templateObj) {
                    if (segmentsObj.template_name === templateObj.name) {
                        segmentsObj['html'] = templateObj.html;
                        segmentsObj['preview_values'] = templateObj.preview_values;
                        segmentsObj['subject'] = templateObj.subject;
                        return false;
                    }
                });
            });
        };

        /*---------- Get templates data from server ----------*/
        $scope.fnGetTemplatesData = function () {
            crmTemplateService.fetchClientTemplates($scope.locationId)
                .then(function (data) {
                    if (data.length !== 0) {
                        $scope.fnFilterByTemplateName(data);
                    }
                });
        };

        /*---------- Combined segments ----------*/
        $scope.fnGetCombinedSegments = function (segmentsData) {
            $scope.crmSegmentsData = [];
            angular.forEach(segmentsData, function (segmentObj) {
                if (segmentObj.sub_segments && segmentObj.sub_segments.length !== 0) {
                    angular.forEach(segmentObj.sub_segments, function (subSegmentObj) {
                        subSegmentObj.name = segmentObj.name + " \\ " + subSegmentObj.name;
                        $scope.crmSegmentsData.push(subSegmentObj);
                    });
                }
            });
            $scope.fnGetTemplatesData();
        };

        /*---------- Get segments data from server ----------*/
        $scope.fnGetSegmentsData = function () {
            $scope.isCrmSegmentsData = $scope.isCrmSegmentsMsgShow = false;

            if ($scope.locationId) {
                crmInteractionService.fetchShopLocationSegments($scope.locationId)
                    .then(function (data) {
                        if (data.length !== 0) {
                            $scope.isCrmSegmentsMsgShow = false;
                            $scope.isCrmSegmentsData = true;
                            $scope.fnGetCombinedSegments(data);
                        } else {
                            $scope.isCrmSegmentsMsgShow = true;
                            $scope.isCrmSegmentsData = false;
                        }
                    });

            } else {
                Toast.failure('Location ID not found...');
            }
        };

        $scope.crmSegmentsAction = '<div class="ui-grid-cell-contents padding-left-0">' +
            '   <md-button class="md-icon-button md-accent" aria-label="View" ' +
            '               ng-click="grid.appScope.fnOpenManageCrmSegments(row, $event);">' +
            '       <md-icon md-font-set="fa fa-lg fa-fw fa-external-link"></md-icon>' +
            '       <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
            '</md-button></div>';

        $scope.crmSegmentsGridOptions = {
            data: 'crmSegmentsData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'name', displayName: 'Segment Name', minWidth: 250, enableHiding: false},
                {
                    name: 'action',
                    displayName: '',
                    cellTemplate: $scope.crmSegmentsAction,
                    width: 50,
                    enableSorting: false,
                    enableColumnMenu: false,
                    enableColumnResize: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnGenerateIframe = function () {
            $timeout(function () {
                var createFrame = document.createElement("iframe");
                createFrame.setAttribute('frameBorder', 0);
                createFrame.style.width = '100%';
                createFrame.style.height = '100%';
                angular.element('#rendered-html').append(createFrame);

                var doc, html = '<html><head></head>' +
                    '<body style="padding: 8px 0;">' + $scope.rendered_template.html +
                    '</body></html>';
                if (createFrame.contentDocument) {
                    doc = createFrame.contentDocument;
                } else if (createFrame.contentWindow) {
                    doc = createFrame.contentWindow.document;
                } else {
                    doc = createFrame.document;
                }

                doc.open();
                doc.writeln(html);
                doc.close();

            }, 1000);
        };

        /*---------- Call for interpolation API for interpolating template variable ----------*/
        $scope.fnOpenManageCrmSegments = function (row, ev) {
            $scope.crmSubSegmentObj = row.entity;
            $scope.rendered_template = {};

            if ($scope.crmSubSegmentObj.html) {
                var interpolateObj = {};
                interpolateObj.data = JSON.parse($scope.crmSubSegmentObj.preview_values);
                interpolateObj.template = $scope.crmSubSegmentObj.html;

                crmTemplateService.interpolateClientTemplate(interpolateObj)
                    .then(function (data) {
                        $scope.rendered_template['html'] = data.rendered_template;
                        $scope.fnGenerateIframe();

                    }, function (error) {
                        if (error.status !== 401 && error.status !== 500) {
                            toastr.error('Error interpolating template. Please try again...', 'STATUS CODE: ' + error.status);
                        }
                    });
            } else {
                $scope.rendered_template['html'] = 'No template found.';
                $scope.fnGenerateIframe();
            }

            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                templateUrl: 'views/authenticated/crm/modals/manageMessageTemplates.html',
                targetEvent: ev
            }).then(function () {
            }, function () {
            });

        };

        $scope.fnCloseMessageTemplateDialog = function () {
            $mdDialog.hide();
        };

        /*--------------- Locations Filter --------------------------*/
        $scope.fnChangeLocation = function (locationId) {
            $scope.locationId = locationId;
            $scope.fnGetSegmentsData();
        };

        $scope.fnCreateLocationDD = function (data) {
            $scope.locationOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.locationOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.locationId = $scope.locationOptions[0].id;
            $scope.fnGetSegmentsData();
        };

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
        /*--------------- End Location Filter --------------------------*/

        $scope.fnInitCrmSegments = function () {
            $scope.fnGetLocationDetails();
        };

    });