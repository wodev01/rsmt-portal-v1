'use strict';
app.factory('GetUserService', ['$q', '$state','$cookies', 'cookieName','localStorage', 'ErrorMsg', 'userObjKey',
    function ($q, $state, $cookies, cookieName, localStorage, ErrorMsg, userObjKey) {
        var GetUserService = {};

        GetUserService.fetchUser = function (subscriptions) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            var hasSubscriptions = true;
            CarglyPartner._getUser(token, function (response) {
                localStorage.setItem(userObjKey,escape(JSON.stringify(response)));
                var userSubscriptions = JSON.parse(response.subscriptions);
                angular.forEach(userSubscriptions, function (obj) {
                    angular.forEach(subscriptions, function (value) {
                        if (hasSubscriptions) {
                            if (obj.subscriptions.indexOf(value) === -1) {
                                hasSubscriptions = false;
                            }
                        }
                    });
                });
                if (hasSubscriptions) {
                    defer.resolve(hasSubscriptions);
                } else{
                    $state.go('main.locations');
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };
        return GetUserService;
    }
]);
