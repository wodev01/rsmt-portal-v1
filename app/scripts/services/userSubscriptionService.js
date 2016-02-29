'use strict';
app.factory('userSubscriptionService', ['$q',
    function ($q) {
        var userSubscriptionService = {};

        userSubscriptionService.checkSubscriptions = function (subscriptions) {
            var defer = $q.defer();
            var hasSubscription = true;
            var userData = JSON.parse(localStorage.getItem('userObj'));
            if (userData) {
                var data = userData.subscriptions;
                angular.forEach(subscriptions, function (value) {
                    if (hasSubscription) {
                        if (data.indexOf(value) === -1) {
                            hasSubscription = false;
                            if ($state.current.name !== '') {
                                $state.go($state.current.name, $stateParams);
                            } else {
                                $location.url('/locations');
                            }
                        }
                    }
                });
                defer.resolve(hasSubscription);
            }
            defer.resolve(hasSubscription);
            return defer.promise;
        };
        return userSubscriptionService;
    }
]);
