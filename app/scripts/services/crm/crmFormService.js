'use strict';
app.factory('crmFormService', ['$q', 'ErrorMsg',
    function ($q, ErrorMsg) {
        var crmFormService = {};

        // Fetch forms details
        crmFormService.fetchFormsDetails = function(partnerId, activityType){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + partnerId + '/activities?activityType=' + activityType,
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error: function (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        return crmFormService;
    }
]);