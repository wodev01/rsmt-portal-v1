'use strict';
app.factory('billingHistoryService',['$q', '$rootScope',
    function($q, $rootScope) {
        var billingHistoryService = {};

        billingHistoryService.fetchBillingHistory = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/' + CarglyPartner.user.partnerId + '/payments',
                type: 'GET',
                success: function(data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    $rootScope.fnCheckStatus(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        return billingHistoryService;
    }
]);
