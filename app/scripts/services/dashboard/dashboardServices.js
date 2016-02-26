'use strict';
app.factory('dashboardService',['$q', 'ErrorMsg', 'encodeParamService',
    function($q, ErrorMsg, encodeParamService) {
        var dashboardService = {};
        //Get DailySummary data
        dashboardService.fetchDailySummary = function(partnerId, locationId, year){
            var defer = $q.defer();

            var filterObj = {};
            filterObj.location_id = locationId;
            filterObj.year = year;

            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/daily_summary'+  encodeParamService.getEncodedParams(filterObj),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get Daily summary with specific date
        dashboardService.fetchDailySummarySpecificDate = function(partnerId,date){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/daily_summary/'+date,
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get Daily summary with date
        dashboardService.fetchMonthlyData = function(partnerId,locationId,yyyy_mm){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/monthly/'+yyyy_mm+'/details'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get MonthlySummary data
        dashboardService.fetchMonthlySummary = function(partnerId,locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/monthly_summary'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get MonthlySummary data using from and to date
        dashboardService.fetchMonthlySummaryWithDate = function(partnerId,from,to){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/monthly_summary?from='+ from +'&to='+to,
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get "Month-to-date"
        dashboardService.fetchMonthToDate = function(partnerId,from){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/monthly_summary?from='+ from,
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        dashboardService.fetchMonthlySummaryWithDateAndLoc = function(partnerId,locationId,from,to){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/monthly_summary'+(locationId ? '?location_id='+locationId + '&' : '?')+'from='+ from +'&to='+to,
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //To fetch ROs now supports a date range using the "startDate" and "endDate" parameters. The date params use the format: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        dashboardService.fetchRepairOrderWithDate = function(locationID,startDate,endDate){
            var defer = $q.defer();
            CarglyPartner.ajax({                            // /events
                url: '/partners/api/locations/'+ locationID +'/repair-orders'+(startDate ? '?startDate='+startDate + '&' : '')+(endDate ? 'endDate='+endDate : ''),
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

        //top customer data can be retrieved via:
        dashboardService.fetchTopCustomers = function(partnerId,locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+partnerId+'/reports/top_customers'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        // Customer report over the prior 24 months:
        dashboardService.fetchCustomerReport = function(pId, locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/reports/customers_by_month'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        // service writer report over the prior 12 months:
        dashboardService.fetchWriterStatsByMonth = function(pId, locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/reports/writer_stats_by_month'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        // tech report over the prior 12 months:
        dashboardService.fetchTechStatsByMonth = function(pId, locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/reports/tech_stats_by_month'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        // Marketing source report over the prior 12 months:
        dashboardService.fetchMarketingSourceByMonth = function(pId, locationId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/reports/marketing_sources_by_month'+(locationId ? '?location_id='+locationId : ''),
                type: 'GET',
                success: function (res) {
                    defer.resolve(res);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        return dashboardService;

    }

]);
