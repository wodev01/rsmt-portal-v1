'use strict';
app.factory('crmActivityService', ['$q','ErrorMsg',
    function ($q, ErrorMsg) {
        var crmActivityService = {};

        // Fetch marketing sessions.
        crmActivityService.fetchMarketingSessions = function (partnerId) {
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + partnerId + '/sessions',
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


        // Fetch activities for specific marketing sessions.
        crmActivityService.fetchSessionActivities = function(partnerId,sessionId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + partnerId + '/sessions/' + sessionId + '/activities',
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

        return crmActivityService;
    }

]);
