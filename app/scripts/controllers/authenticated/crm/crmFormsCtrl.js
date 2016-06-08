'use strict';
app.controller('crmFormsCtrl', function ($scope, crmFormService, $mdDialog) {
    var partnerId;
    var activityType = 'WEB_FORM';

    $scope.isFormsDetails = false;
    $scope.isCrmFormsGridShow = false;

    $scope.crmFormsDetails = [];

    $scope.getPagedDataAsync = function () {
        $scope.isFormsDetails = false;
        $scope.isCrmFormsGridShow = false;

        crmFormService.fetchFormsDetails(partnerId, activityType)
            .then(function (data) {
                if (data.length !== 0) {
                    $scope.isCrmFormsGridShow = false;
                    $scope.isFormsDetails = true;
                    $scope.crmFormsDetails = data;
                } else {
                    $scope.isCrmFormsGridShow = true;
                    $scope.isFormsDetails = false;
                }

            }, function (error) {
                toastr.error('Failed retrieving forms data.', 'STATUS CODE: ' + error.status);
            })
    };

    $scope.crmFormsAction = '<div class="ui-grid-cell-contents padding-left-0">' +
        '<md-button class="md-icon-button md-accent" aria-label="View" ' +
        '           ng-click="grid.appScope.fnOpenCrmForm(row, $event);">' +
        '   <md-icon md-font-set="fa fa-lg fa-fw fa-external-link"></md-icon>' +
        '   <md-tooltip ng-if="$root.isMobile == null" md-direction="top">View</md-tooltip>' +
        '</md-button></div>';

    $scope.crmFormsGridOptions = {
        data: 'crmFormsDetails',
        rowHeight: 50,
        multiSelect: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {
                name: 'action',
                displayName: '',
                cellTemplate: $scope.crmFormsAction,
                width: 50,
                minWidth: 50,
                enableSorting: false,
                enableColumnMenu: false,
                enableColumnResize: false
            },
            {
                field: 'occurred', displayName: 'Date',
                cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', width: 150, minWidth: 150, enableHiding: false
            },
            {
                field: 'form_name',
                displayName: 'Form Name',
                width: 150,
                minWidth: 150,
                enableHiding: false
            },
            {
                field: 'source',
                cellTooltip: true,
                displayName: 'Source',
                minWidth: 700,
                enableHiding: false,
                enableSorting: false,
                enableColumnMenu: false
            }
        ],
        onRegisterApi: function (gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                row.isSelected = true;
            });
        }
    };

    $scope.fnOpenCrmFormsModal = function (obj, ev) {
        $mdDialog.show({
            controller: 'formDataCtrl',
            templateUrl: 'views/authenticated/crm/modals/formData.html',
            targetEvent: ev,
            resolve: {
                crmFormDataObj: function () {
                    return obj;
                }
            }
        });
    };

    $scope.fnOpenCrmForm = function (row, event) {
        $scope.fnOpenCrmFormsModal(row.entity, event);
    };

    $scope.fnInitCrmForms = function () {
        var user = CarglyPartner.user;
        if (user) {
            partnerId = user.partnerId;
            $scope.getPagedDataAsync();
        }
    };

});