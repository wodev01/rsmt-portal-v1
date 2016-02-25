'use strict';
app.controller('UsersCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog, userService) {
        $scope.rightView = 'views/authenticated/settings/manageUser.html';

        $scope.fnNewUserView = function () {
            $scope.isUserEditable = false;
            $scope.fnOpenSwap();
        };

        $scope.userFilterOptions = {
            useExternalFilter: false
        };
        $scope.userTotalServerItems = 0;

        $scope.setPagingData = function (data) {
            var pagedData = data;
            $scope.usersData = pagedData;
            $scope.userTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();

            }
        };
        $scope.getPagedDataAsync = function () {

                    userService.fetchUsers().then(function(data){
                        if(data.length !== 0){
                            $scope.isDataNotNull = true;
                            $scope.isMsgShow = false;
                            CarglyPartner.users = data;
                            $scope.setPagingData(data);
                        }else{
                            $scope.isDataNotNull = false;
                            $scope.isMsgShow = true;
                        }
                    });
        };

        $scope.$on('refreshUsers', function () {
            $scope.getPagedDataAsync();
        });

        $scope.fnInitUsers = function () {
            $scope.getPagedDataAsync();
        };


        $scope.userAction = '<div layout="row"> ' +
            '<md-button class="md-icon-button md-warn md-hue-2" ng-click="fnUserDelete(row,$event)">' +
            '    <md-icon md-font-set="material-icons">delete</md-icon>' +
            '   <md-tooltip md-direction="top">Delete</md-tooltip>' +
            '</md-button> ' +
            '<md-button class="md-icon-button md-accent" ng-click="fnUserEdit(row,$event)">' +
            '   <md-icon md-font-set="material-icons">edit</md-icon>' +
            '   <md-tooltip md-direction="top">Edit</md-tooltip></md-button>' +
            '</md-button></div>';


        $scope.userGridOptions = {
            data: 'usersData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'name', displayName: 'Name', minWidth:100, enableHiding: false},
                {field: 'email', displayName: 'Email', minWidth:100, enableHiding: false},
                {field: 'role', displayName: 'Role', minWidth: 100, enableHiding: false},
                {field: 'verified', displayName: 'Verified', minWidth: 100, enableHiding: false},
                {
                    name: 'action',
                    displayName: '',
                    cellTemplate: $scope.userAction,
                    width: 100,
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

        $scope.fnUserDelete = function (row, event) {
            var confirm = $mdDialog.confirm()
                .title('Delete')
                .content('Would you like to delete this user?')
                .ariaLabel('Delete')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                userService.deleteUser(row.entity.id).then(function(){
                    $scope.getPagedDataAsync();
                });
            });
        };

        $scope.fnUserEdit = function (row) {
            $scope.isUserEditable = true;
            userService.setUserObj(row.entity);
            $scope.fnOpenSwap();
        };

        //Swapping view open function
        $scope.fnOpenSwap = function() {
            setTimeout(function(){
                $scope.rightView = '';
                $scope.$apply();
                $scope.rightView = 'views/authenticated/settings/manageUser.html';
                $scope.$apply();
                $mdSidenav('userSwap').open()
                    .then(function(){
                        //$log.debug("open RIGHT is done");
                    });
            });
        };

        //Swapping view close function
        $scope.fnCloseSwap = function() {
            $mdSidenav('userSwap').close()
                .then(function(){
                    //$log.debug("close RIGHT is done");
                });
        };

    });
