'use strict';
app.factory('AuthService', ['$q', '$location', '$cookies', 'paymentService', 'cookieName', 'ErrorMsg',
    function ($q, $location, $cookies, paymentService, cookieName, ErrorMsg) {
        var AuthService = {};

        function fnCheckSubscription(res, subscription){
            var hasSubscriptions = true;
            if(res.subscriptions !== null && res.subscriptions !== "") {
                var userSubscriptions = JSON.parse(res.subscriptions);
                angular.forEach(userSubscriptions, function (obj) {
                    if (hasSubscriptions) {
                        if (obj.subscriptions.indexOf(subscription) === -1) {
                            hasSubscriptions = false;
                        }
                    }
                });
            }else{
                hasSubscriptions = false;
            }
            return hasSubscriptions;
        }

        AuthService.fnGetUser = function (subscription) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            if(token) {
                CarglyPartner._getUser(token, function (response) {
                    if (response.verified === 'true') {
                        /*paymentService.fetchUserPaymentInfo()
                            .then(function (res) {
                                if (res.status === 404) {
                                    $location.url('/payment');
                                    defer.resolve(res);
                                }
                                else {*/
                                    if (fnCheckSubscription(response, subscription)) {
                                        defer.resolve(response);
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
                }, function (error) {
                    if (error) {
                        ErrorMsg.CheckStatusCode(error.status);
                    }
                });
            } else {
                if(CarglyPartner.queryParams != null && CarglyPartner.queryParams.resetpw != null
                    && CarglyPartner.queryParams.resetpw != '') {
                    defer.resolve();
                } else {
                    $location.url('/login');
                    defer.resolve();
                }
            }

            return defer.promise;
        };

        return AuthService;
    }
]);
