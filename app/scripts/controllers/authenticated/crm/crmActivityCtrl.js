'use strict';
app.controller('crmActivityCtrl',
    function ($scope, locationService, crmActivityService) {

        var partnerId;

        $scope.isMsgShow = $scope.isDataNotNull = false;
        $scope.marketingSessionsData = [];
        $scope.sessionActivities = [];
        $scope.isActivityDataProcessing = false;
        $scope.isProcessing = false;

        $scope.getPagedDataAsync = function () {
            $scope.isMsgShow = $scope.isDataNotNull = false;
            $scope.isProcessing = true;

            crmActivityService.fetchMarketingSessions(partnerId)
                .then(function (data) {
                    if (data.results.length !== 0) {
                        $scope.marketingSessionsData = data.results;
                        $scope.isProcessing = $scope.isMsgShow = false;
                        $scope.isDataNotNull = true;
                    } else {
                        $scope.isProcessing = $scope.isDataNotNull = false;
                        $scope.isMsgShow = true;
                    }
                }, function (error) {
                    toastr.error('Failed retrieving marketing sessions data.', 'STATUS CODE: ' + error.status);
                });
        };

        var collapseAnother = function (index) {
            for (var i = 0; i < $scope.marketingSessionsData.length; i++) {
                if (i != index) {
                    $scope.marketingSessionsData[i].active = false;
                }
            }
        };

        $scope.fnGetActivities = function (index, sessionId) {
            $scope.marketingSessionsData[index].active = !$scope.marketingSessionsData[index].active;
            collapseAnother(index);
            $scope.isActivityDataProcessing = true;

            crmActivityService.fetchSessionActivities(partnerId, sessionId)
                .then(function (data) {
                    if (data.length !== 0) {
                        $scope.isActivityDataProcessing = true;
                        $scope.sessionActivities = data;
                    }
                    $scope.isActivityDataProcessing = false;
                }, function (error) {
                    toastr.error('Failed retrieving session activities data.', 'STATUS CODE: ' + error.status);
                    $scope.isActivityDataProcessing = false;
                });
        };

        $scope.fnInitCrmActivity = function () {
            var user = CarglyPartner.user;
            if (user) {
                partnerId = user.partnerId;
                $scope.getPagedDataAsync();
            }
        };

    });