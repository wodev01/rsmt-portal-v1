'use strict';
app.factory('InterceptorsService',
    function InterceptorsService($cookies, $q, $injector, $location, cookieName) {

        return {
            request: function (req) {
                var token = $cookies.get(cookieName);

                //If 'token'(cookie) not available ask to user login.
                var deferred = $q.defer();
                if (angular.isUndefined(token)) {
                    /*----- Resolve reset password page if resetpw token exist ----*/
                    if(CarglyPartner.queryParams != null && CarglyPartner.queryParams.resetpw != null
                        && CarglyPartner.queryParams.resetpw != '') {
                        $location.url('/reset-password');
                        deferred.resolve(req);
                    }else {
                        $location.url('/login');
                        deferred.resolve(req);
                    }
                }
                else {
                    //If user already login and trying to access Login or Reset Password screen.
                    if ($location.path() === '/login' || $location.path() === '/reset-password') {
                        var state = $injector.get('$state');
                        var stateParams = $injector.get('$stateParams');
                        if (state.current.name !== '') {
                            if (state.current.name === 'login' || state.current.name === 'resetPassword') {
                                $location.url('/dashboard');
                            } else {
                                state.go(state.current.name, stateParams);
                            }
                        } else {
                            $location.url('/dashboard');
                        }
                    } else {
                        deferred.resolve(req);
                    }
                }
                return deferred.promise;
            }
        };

    });
