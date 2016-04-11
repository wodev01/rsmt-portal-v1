'use strict';
app.factory('GetUserService', ['$q', '$state','$cookies', 'paymentService', 'cookieName','localStorage', 'ErrorMsg', 'userObjKey',
    function ($q, $state, $cookies, paymentService, cookieName, localStorage, ErrorMsg, userObjKey) {
        var GetUserService = {};

        GetUserService.fetchUser = function (subscriptions) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            var hasSubscriptions = true;
            CarglyPartner._getUser(token, function (response) {
                localStorage.setItem(userObjKey,escape(JSON.stringify(response)));
                if (response.verified === 'true') {
                    paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                $state.go('payment');
                                defer.resolve(res);
                            }
                            else{
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
                                } else {
                                    $state.go('main.locations');
                                    defer.resolve(response);
                                }
                            }
                        });
                } else {
                    $state.go('verify');
                    defer.resolve();
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };

        GetUserService.fnUserVerified = function () {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            CarglyPartner._getUser(token, function (response) {
                localStorage.setItem(userObjKey,escape(JSON.stringify(response)));
                if (response.verified === 'true') {
                    paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                $state.go('payment');
                                defer.resolve(res);
                            }
                            else{
                                $state.go('main.locations');
                                defer.resolve(response);
                            }
                        });
                } else {
                    defer.resolve();
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };

        GetUserService.fnPaymentVerified = function () {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            CarglyPartner._getUser(token, function (response) {
                localStorage.setItem(userObjKey,escape(JSON.stringify(response)));
                if (response.verified === 'true') {
                    paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                defer.resolve(res);
                            }
                            else{
                                $state.go('main.locations');
                                defer.resolve(response);
                            }
                        });
                } else {
                    defer.resolve();
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
