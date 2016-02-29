'use strict';
app.controller('crmSegmentsCtrl',
    function ($scope, $mdDialog, Toast, locationService, crmInteractionService, crmTemplateService) {

        $scope.locationOptions = [];
        $scope.isLocationsData = false;

        $scope.crmSegmentsData = [];
        $scope.isCrmSegmentsData = $scope.isCrmSegmentsMsgShow = false;

        $scope.locationId = '';

        $scope.fnFilterByTemplateName = function (templateData) {
            angular.forEach($scope.crmSegmentsData, function (segmentsObj) {
                angular.forEach(templateData, function (templateObj) {
                    if (segmentsObj.template_name === templateObj.name) {
                        segmentsObj['html'] = templateObj.html;
                        segmentsObj['preview_values'] = templateObj.preview_values;
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

        $scope.crmSegmentsAction = '<div layout="row">' +
            '<md-button class="md-icon-button md-accent"' +
            'ng-click="grid.appScope.fnOpenManageCrmSegments(row, ev);">' +
            '<md-icon md-font-set="material-icons">visibility</md-icon>' +
            '<md-tooltip md-direction="top">Open</md-tooltip></md-button>' +
            '</div>';
        $scope.crmSegmentsGridOptions = {
            data: 'crmSegmentsData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [
                {name:'Action', field: 'name', displayName: 'Segment Name', minWidth: 100},
                {name:'action', cellTemplate: $scope.crmSegmentsAction, width: 100, enableSorting:false}
            ]
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

                    }, function (error) {
                        if (error.status !== 401 && error.status !== 500) {
                            Toast.failure('Error interpolating template. Please try again...');
                        }
                    });
            } else {
                $scope.rendered_template['html'] = 'No template found.';
            }

            $mdDialog.show({
                scope: $scope.$new(),
                templateUrl: 'views/authenticated/CRM/manageCrmSegments.html',
                targetEvent: ev
            }).then(function () {
            }, function () {
            });

        };

        $scope.fnCloseCrmDialog = function () {
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

            locationService.fetchLocation().then(function (data) {
                if (data.length != 0) {
                    $scope.isLocationsData = true;
                    $scope.fnCreateLocationDD(data);
                }
            });
        };
        /*--------------- End Location Filter --------------------------*/

        $scope.fnInitCrmSegments = function () {
            $scope.fnGetLocationDetails();
        };

    });
