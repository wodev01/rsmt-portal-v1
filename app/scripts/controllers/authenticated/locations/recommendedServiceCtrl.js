'use strict';
app.controller('recommendedServiceCtrl',
	function ($scope, $http, $timeout, $mdSidenav, $log, $cookies, $state, $mdDialog, userService, locationService) {
		$scope.recommendedServiceFilterOptions = {
			filterText: '',
			useExternalFilter: false
		};

		$scope.recommendedServiceTotalServerItems = 0;
		$scope.pagingOptions = {
			pageSizes: [5, 10, 25, 50],
			pageSize: 500,
			currentPage: 1
		};

		$scope.getPagedDataAsync = function (pageSize, page) {
			setTimeout(function () {
				if(locationService.getLocationObj().id) {
					$scope.locationID = locationService.getLocationObj().id;
					locationService.recommendedService($scope.locationID)
						.then(function(data) {
							if (data.length !== 0) {
								$scope.isDataNotNull = true;
                                $scope.recommendedServicesData = data;
							} else {
								$scope.isDataNotNull = false;
								$scope.isMsgShow = true;
							}
						}, function(error) {
						});
				}
				$('.recommendedServiceGridStyle').trigger('resize');
			}, 100);
		};

		$scope.$on('refreshrecommendedServices', function () {
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		});

		$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

		$scope.recommendedServiceGridOptions = {
			data: 'recommendedServicesData',
			rowHeight: 50,
            multiSelect:false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
			columnDefs: [
				{field: 'text', displayName: 'Service', minWidth:'250', enableHiding: false},
                {field: 'recommended_date', displayName: 'Date', cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'', minWidth:'170', enableHiding: false},
				{field: 'due_date', displayName: 'Due Date', cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'', minWidth:'170', enableHiding: false},
				{field: 'recommendation_type', displayName: 'Type', width:'100', enableHiding: false},
				{field: 'customer.first_name', displayName: 'Customer Name',cellTemplate: '<div class="md-padding">{{row.entity.customer.first_name}} {{row.entity.customer.last_name}}</div>', minWidth:'200', enableHiding: false},
				{field: 'customer.phone_numbers', displayName: 'Phone Numbers',cellFilter: 'joinTelArray', minWidth:'190', enableHiding: false}
			],
			onRegisterApi: function (gridApi) {
				gridApi.selection.on.rowSelectionChanged($scope, function (row) {
					row.isSelected = true;
				});
			}
		};
	});
