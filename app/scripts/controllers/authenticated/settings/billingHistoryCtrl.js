'use strict';
app.controller('BillingHistoryCtrl',
    function ($scope, $stateParams, $state, $rootScope, billingHistoryService) {

        $scope.billingHistoryFilterOptions = {
            useExternalFilter: false
        };
        $scope.billingHistoryTotalServerItems = 0;


        $scope.setPagingData = function (data) {
            $scope.billingHistoryData = data;
            $scope.billingHistoryTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function () {
                billingHistoryService.fetchBillingHistory().then(function(data){
                    if(data.length !== 0){
                        $scope.isDataNotNull = true;
                        $scope.isMsgShow = false;
                        $scope.setPagingData(data);
                    }else{
                        $scope.isDataNotNull = false;
                        $scope.isMsgShow = true;
                    }
                });
        };


        $scope.fnInitBillingHistory= function (){
            $scope.getPagedDataAsync();
        };

        $scope.billingHistoryGridOptions = {
            data: 'billingHistoryData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'date', displayName: 'Date', minWidth:150,cellFilter: 'date:\'dd-MM-yyyy\'', enableHiding: false},
                {field: 'reference', displayName: 'Invoice #', minWidth:100, enableHiding: false},
                {field: 'description', displayName: 'Description', minWidth:250, enableHiding: false},
                {field: 'amount', displayName: 'Amount', minWidth:100, enableHiding: false}
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnBillingHistoryDelete = function (row, event, $mdDialog) {
            var confirm = $mdDialog.confirm()
                .title('Delete')
                .content('Would you like to delete this billingHistory?')
                .ariaLabel('Delete')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
//            delete api call here
            });
        };

        $scope.fnBillingHistoryEdit = function () {
        };
    });
