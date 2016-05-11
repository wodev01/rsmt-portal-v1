'use strict';
app.factory('AuthService', ['$q', '$state', '$location', '$timeout', '$cookies', 'paymentService', 'cookieName', 'ErrorMsg',
    function ($q, $state ,$location, $timeout, $cookies, paymentService, cookieName, ErrorMsg) {
        var AuthService = {};

        function fnCheckSubscription(res, subscription) {
            var hasSubscriptions = true;
            if (res.subscriptions !== null && res.subscriptions !== "") {
                var userSubscriptions = JSON.parse(res.subscriptions);
                angular.forEach(userSubscriptions, function (obj) {
                    if (hasSubscriptions) {
                        if (obj.subscriptions.indexOf(subscription) === -1) {
                            hasSubscriptions = false;
                        }
                    }
                });
            } else {
                hasSubscriptions = false;
            }
            return hasSubscriptions;
        }

        function fnStateGo(stateName, defer){
            if ($state.current.name === '') {
                $timeout(function () {
                    $state.go(stateName);
                });
                defer.resolve();
            } else {
                defer.reject();
            }
        }

        AuthService.fnGetUser = function (subscription) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            if (!angular.isUndefined(token)) {
                CarglyPartner._getUser(token, function (response) {
                    /*---- Check User is verified or not ----*/
                    if (response.verified === 'true') {
                        /*----- if User is verified then check it's payment info available or not ----*/
                        /*paymentService.fetchUserPaymentInfo()
                            .then(function (res) {
                                if (res.status === 404) {
                                    if($location.path() === '/payment' && $state.current.name === 'login'){
                                        defer.resolve(res);
                                    } else {
                                        fnStateGo('payment', defer);
                                    }
                                }
                                else {*/
                                    /*---- Check subscription if define in ui route ----*/
                                    if (!angular.isUndefined(subscription)) {
                                        if (fnCheckSubscription(response, subscription)) {
                                            defer.resolve(response);
                                        } else {
                                            fnStateGo('main.locations', defer);
                                        }
                                    } else {
                                        /*---- If User already login and it's payment or verify information available then verify and payment page not access ---*/
                                        if ($location.path() === '/verify' ||
                                            $location.path() === '/payment') {
                                            if (fnCheckSubscription(response, subscription)) {
                                                defer.resolve(response);
                                            } else {
                                                fnStateGo('main.locations', defer);
                                            }
                                        } else {
                                            defer.resolve(response);
                                        }
                                    }
                                /*}
                            });*/
                    } else {
                        if($location.path() === '/verify' && $state.current.name === 'login'){
                            defer.resolve(response);
                        } else {
                            fnStateGo('verify', defer);
                        }
                    }
                }, function (error) {
                    if (error) {
                        ErrorMsg.CheckStatusCode(error.status);
                    }
                });
            } else {
                if (CarglyPartner.queryParams != null && CarglyPartner.queryParams.resetpw != null
                    && CarglyPartner.queryParams.resetpw != '') {
                    fnStateGo('resetPassword', defer);
                } else {
                    fnStateGo('login', defer);
                }
            }

            return defer.promise;
        };

        return AuthService;
    }
]);
