'use strict';
app.factory('allCustomerService', ['$q', 'ErrorMsg',
    function($q, ErrorMsg) {
        var allCustomerService = {};
        var pagingCursor = '';

        //Get locations data
        allCustomerService.fetchShopLocations = function(group_id){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations'+ (group_id ? '?group_id=' + group_id : ''),
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error: function(error){
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //retrieve the clients using parameters for RLO
        allCustomerService.filterShopLocationsData = function(search){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations?filter='+(search ? search : ''),
                type: 'GET',
                success: function (data, status, headers) {
                    pagingCursor = headers['x-paging-cursor'];
                    var response = {};
                    response.data = data;
                    response.status = status;
                    response.headers = headers;
                    defer.resolve(response);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };
        //create or update locations
        allCustomerService.saveShopLocations = function(id,locationsData){
            var defer = $q.defer();
            if (id.length === 0) {id = null;}
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations' + (id ? '/' + id : '' ),
                type: 'POST',
                data: locationsData,
                success: function(data) {
                    defer.resolve(data);
                },
                error: function(error){
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //fetch locations events
        allCustomerService.fetchShopLocationEvents = function(id,pageNum){
            var defer = $q.defer();
            if (id.length === 0) {id = null;}
            CarglyPartner.ajax({
                url: '/partners/api/locations/' +id +'/events',
                type: 'GET',
                data: 'pageNum='+pageNum,
                success: function(data) {
                    defer.resolve(data);
                },
                error: function(error){
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //update client next config
        allCustomerService.updateShopLocationNextConfig = function(id,config){
            var defer = $q.defer();
            if (id.length === 0) {id = null;}
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations/' + id + '/next-config',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(config),
                success: function(data) {
                    defer.resolve(data);
                },
                error: function(error){
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //send daily email
        allCustomerService.sendDailyEmail = function(id){
            var defer = $q.defer();
            if (id.length === 0) {id = null;}
            CarglyPartner.ajax({
                url: '/partners/api/locations/'+id+'/email-reports/daily-email/send',
                type: 'GET',
                data: null,
                success: function(data) {
                    defer.resolve(data);
                },
                error: function(error){
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //get location recommened service
        allCustomerService.recommendedService = function(id){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/locations/'+ id +'/recommended',
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

        //Get repair order data
        allCustomerService.repairOrder = function(id){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/locations/'+ id +'/repair-orders', //events API
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

        //Get location log data
        allCustomerService.fetchLog = function(id){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/locations/' +id +'/logs',
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

        //by location id get next config data
        allCustomerService.fetchNextConfig = function(id){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations/'+id+'/next-config',
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

        //by location id save next config data
        allCustomerService.saveNextConfig = function(id,nextConfig){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations/'+id+'/next-config',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(nextConfig),
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

        //Get customers data
        allCustomerService.customersData = function(locId, searchText){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/locations/'+ locId +'/customers2' + (searchText ? '?filter=' + searchText : ''),
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

        //Get customers vehicles repair orders
        allCustomerService.customerVehiclesRO = function(vehicleId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/vehicles/'+ vehicleId +'/repair-orders',
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

        //Get customers vehicles recommended items
        allCustomerService.customerVehiclesRS = function(vehicleId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/vehicles/'+ vehicleId +'/recommended',
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

        /*---------- Get more locations using x-paging-cursor header ----------*/
        allCustomerService.fetchMoreShopLocations = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/agent/client-locations' + (pagingCursor ? '?cursor=' + pagingCursor : ''),
                type: 'GET',
                success: function (data, status, headers) {
                    pagingCursor = headers['x-paging-cursor'];
                    var response = {};
                    response.data = data;
                    response.status = status;
                    response.headers = headers;
                    defer.resolve(response);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*-------------- Getter and Setter Method ---------*/
        var locationsShopObj = {};
        allCustomerService.setShopLocationsObj = function(newObj){
            locationsShopObj = newObj;
        };
        allCustomerService.getShopLocationsObj = function(){
            return locationsShopObj;
        };

        var vehicleObj = {};
        allCustomerService.setVehicleObj = function(newObj){
            vehicleObj = newObj;
        };
        allCustomerService.getVehicleObj = function(){
            return vehicleObj;
        };

        return allCustomerService;
    }
]);