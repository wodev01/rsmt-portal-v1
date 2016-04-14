'use strict';
app.factory('AuthService', ['$q', '$location', '$cookies', 'paymentService', 'cookieName', 'ErrorMsg',
    function ($q, $location, $cookies, paymentService, cookieName, ErrorMsg) {
        var AuthService = {};

        AuthService.fnGetUser = function (subscriptions) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            var hasSubscriptions = true;
            CarglyPartner._getUser(token, function (response) {
                if (response.verified === 'true') {
                    /*paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                $location.url('/payment');
                                defer.resolve(res);
                            }
                            else{*/
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
                                    $location.url('/locations');
                                    defer.resolve(response);
                                }
                            /*}
                        });*/
                } else {
                    $location.url('/verify');
                    defer.resolve();
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };

        AuthService.fnUserVerified = function () {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            CarglyPartner._getUser(token, function (response) {
                if (response.verified === 'true') {
                    /*paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                $location.url('/payment');
                                defer.resolve(res);
                            }
                            else{*/
                                var userSubscriptions = JSON.parse(response.subscriptions);
                                angular.forEach(userSubscriptions, function (obj) {
                                    if(obj.subscriptions.indexOf('realtime_dashboard') !== -1){
                                        $location.url('/dashboard');
                                    }else{
                                        $location.url('/locations');
                                    }
                                });
                                defer.resolve(response);
                            /*}
                        });*/
                } else {
                    $location.url('/verify');
                    defer.resolve();
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };

        AuthService.fnPaymentVerified = function () {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            CarglyPartner._getUser(token, function (response) {
                if (response.verified === 'true') {
                    /*paymentService.fetchUserPaymentInfo()
                        .then(function(res){
                            if(res.status === 404){
                                defer.resolve(res);
                            }
                            else{*/
                                var userSubscriptions = JSON.parse(response.subscriptions);
                                angular.forEach(userSubscriptions, function (obj) {
                                    if(obj.subscriptions.indexOf('realtime_dashboard') !== -1){
                                        $location.url('/dashboard');
                                    }else{
                                        $location.url('/locations');
                                    }
                                });
                                defer.resolve(response);
                            /*}
                        });*/
                } else {
                    $location.url('/verify');
                    defer.resolve();
                }
            },function(error){
                if (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                }
            });

            return defer.promise;
        };

        AuthService.fnResetPWTokenVerified = function () {
            var defer = $q.defer();
            /*----- Resolve reset password page if resetpw token exist ----*/
            if(CarglyPartner.queryParams != null && CarglyPartner.queryParams.resetpw != null
                && CarglyPartner.queryParams.resetpw != '') {
                defer.resolve();
            } else {
                $location.url('/login');
                defer.resolve();
            }
            return defer.promise;
        };
        return AuthService;
    }
]);
