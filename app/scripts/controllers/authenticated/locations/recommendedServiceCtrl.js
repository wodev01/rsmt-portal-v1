'use strict';
app.controller('recommendedServiceCtrl',
	function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog, userService, locationService) {
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

		$scope.setPagingData = function (data, page, pageSize) {
			var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
			$scope.recommendedServicesData = pagedData;
			$scope.recommendedServiceTotalServerItems = data.length;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};

		$scope.getPagedDataAsync = function (pageSize, page) {
			setTimeout(function () {
				if($rootScope.editLocation) {
					$scope.locationID = $rootScope.editLocation.id;
					locationService.recommendedService($scope.locationID)
						.then(function(data) {
							if (data.length !== 0) {
								$scope.isDataNotNull = true;
								$scope.setPagingData(data, page, pageSize);
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

		$scope.$watch('pagingOptions', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				//was there a page change? if not make sure to reset the page to 1 because it must have been a size change
				if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
					$scope.pagingOptions.currentPage = 1; //  this will also trigger this same watch
				} else {
					// update the grid with new data
					$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.recommendedServiceFilterOptions.filterText);
				}
			}
		}, true);

		$scope.$watch('filterOptions', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.recommendedServiceFilterOptions.filterText);
			}
		}, true);

		$scope.recommendedServiceGridOptions = {
			data: 'recommendedServicesData',
			rowHeight: 50,
            multiSelect:false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
			totalServerItems: 'recommendedServiceTotalServerItems',
			columnDefs: [
				{field: 'text', displayName: 'Service', minWidth:'250'},
                {field: 'recommended_date', displayName: 'Date', cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'', minWidth:'170'},
				{field: 'due_date', displayName: 'Due Date', cellFilter: 'date:\'MM/dd/yyyy, h:mm a\'', minWidth:'170'},
				{field: 'recommendation_type', displayName: 'Type', width:'100'},
				{field: 'customer.first_name', displayName: 'Customer Name',cellTemplate: '<div class="md-padding">{{row.entity.customer.first_name}} {{row.entity.customer.last_name}}</div>', minWidth:'200'},
				{field: 'customer.phone_numbers', displayName: 'Phone Numbers',cellFilter: 'joinTelArray', minWidth:'190'}
			]
		};
	});
