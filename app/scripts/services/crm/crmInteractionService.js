'use strict';
app.factory('crmInteractionService',['$q', 'encodeParamService','ErrorMsg',
    function($q, encodeParamService,ErrorMsg) {

        var crmInteractionService = {};

        crmInteractionService.fetchShopLocationSegments = function(locId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + locId + '/segments',
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        crmInteractionService.fetchCrmInteraction = function(idsObj, paramsObj){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + idsObj.locationId + '/segments/' + idsObj.segmentId + '/interactions'
                            + encodeParamService.getEncodedParams(paramsObj),
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        crmInteractionService.saveCrmInteraction = function(locId, interactionId, segmentInteractionObj){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/crm/' + locId + '/interactions/' + interactionId,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(segmentInteractionObj),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*-------------- Getter and Setter Method ---------*/
        var crmInteractionObj = {};
        crmInteractionService.setShopLocSegmentObj = function(newObj){
            crmInteractionObj = newObj;
        };
        crmInteractionService.getShopLocSegmentObj = function(){
            return crmInteractionObj;
        };

        return crmInteractionService;
    }
]);
