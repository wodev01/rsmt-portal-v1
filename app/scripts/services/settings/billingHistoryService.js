'use strict';
app.factory('billingHistoryService',['$q', 'ErrorMsg',
    function($q, ErrorMsg) {
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
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        return billingHistoryService;
    }
]);
