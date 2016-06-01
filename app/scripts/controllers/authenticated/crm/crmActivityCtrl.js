'use strict';
app.controller('crmActivityCtrl',
    function ($scope, $location, $timeout, $anchorScroll, locationService, crmActivityService) {

        var partnerId;

        $scope.isMsgShow = $scope.isDataNotNull = false;
        $scope.marketingSessionsData = [];
        $scope.sessionActivities = [];

        $scope.isActivityDataProcessing = false;
        $scope.isMoreActivities = false;
        $scope.activityCursor;

        var filterObj = {};

        $scope.getPagedDataAsync = function () {
            $scope.isMsgShow = $scope.isDataNotNull = false;

            crmActivityService.fetchMarketingSessions(partnerId)
                .then(function (data) {
                    if (data.cursor) {
                        $scope.activityCursor = data.cursor;
                        filterObj.cursor = $scope.activityCursor;
                    } else {
                        $scope.activityCursor = "";
                    }

                    if (data.results.length !== 0) {
                        $scope.marketingSessionsData = data.results;
                        $scope.isMsgShow = false;
                        $scope.isDataNotNull = true;
                    } else {
                        $scope.isDataNotNull = false;
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

            if($scope.marketingSessionsData[index].active) {
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
            }
        };

        // Load more sessions functionality.
        $scope.fnLoadMoreSessions = function () {
            if ($scope.activityCursor) {
                if(!$scope.isMoreActivities){
                    $scope.isMoreActivities = true;
                    crmActivityService.fetchMoreSessions(partnerId, filterObj)
                        .then(function (data) {
                            if (data.cursor) {
                                $scope.activityCursor = data.cursor;
                                filterObj.cursor = $scope.activityCursor;
                            } else {
                                $scope.activityCursor = "";
                            }

                            if (data.results.length !== 0) {
                                $scope.marketingSessionsData = $scope.marketingSessionsData.concat(data.results);
                            }
                            $scope.isMoreActivities = false;
                        }, function (error) {
                            toastr.error('Failed retrieving more sessions data.', 'STATUS CODE: ' + error.status);
                            $scope.isMoreActivities = false;
                        });
                }
            }
        };

        $scope.fnInitCrmActivity = function () {
            var user = CarglyPartner.user;
            if (user) {
                partnerId = user.partnerId;
                $scope.getPagedDataAsync();
            }
        };

    });