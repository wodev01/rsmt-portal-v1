'use strict';
app.factory('crmTemplateService', ['$q','ErrorMsg',
    function ($q, ErrorMsg) {
        var crmTemplateService = {};

        // Fetch client templates
        crmTemplateService.fetchClientTemplates = function (partnerId) {
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/' + partnerId + '/email-templates',
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

        // Interpolate client template
        crmTemplateService.interpolateClientTemplate = function (template) {
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/interpolate',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(template),
                success: function (data) {
                    defer.resolve(data);
                },
                error: function (error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.reject(error);
                }
            });
            return defer.promise;
        };

        return crmTemplateService;
    }

]);
