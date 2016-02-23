'use strict';
app.factory('userService',['$q', '$rootScope',
    function($q, $rootScope) {
        var userService = {};

        //Get users data
        userService.fetchUsers = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/users',
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    $rootScope.fnCheckStatus(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //delete user by row id
        userService.deleteUser = function(rowID){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/users/' + rowID,
                type: 'DELETE',
                data: null,
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    $rootScope.fnCheckStatus(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //save and update user
        userService.saveUser = function(id, newUser){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/users' + (id ? '/' + id : '' ),
                type: 'POST',
                data: newUser,
                success: function (data, status) {
                    var dataObj = {};
                    dataObj.data = data;
                    dataObj.status = status;
                    defer.resolve(dataObj);
                },
                error:function(error) {
                    $rootScope.fnCheckStatus(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*-------------- Getter and Setter Method ---------*/
        var userObj = {};
        userService.setUserObj = function(newObj){
            userObj = newObj;
        };
        userService.getUserObj = function(){
            return userObj;
        };

        return userService;
    }
]);
