'use strict';
app.controller('paymentInfoCtrl', function ($scope, $state, $rootScope, $mdDialog, paymentService) {
	$scope.hide = function () {
		$mdDialog.hide();
	};

	$scope.paymentInfo = {
		'type':'',
		'number':'',
		'exp_month':'',
		'exp_year':'',
		'cvv':''
	};

	ChargeIO.init({
		public_key: 'm_zuT9A5oAQTilLxkc_PWanQ'
	});

	$scope.updateUserPaymentInfo = function () {
		ChargeIO.create_token($scope.paymentInfo, chargeIOResponseHandler,function(response) {
			// Show the errors on the form
			console.log(response.error.message);
		});
	};

	function chargeIOResponseHandler(response) {
		paymentService.savePaymentInfo(response).then(function(){
			if($state.current.name === 'accountsettings'){
				$rootScope.$broadcast('refreshFetchAccount');
				$scope.hide();
			}
			else{
				$state.go('dashboard');
			}
		});
	}


	/*Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
	 $scope.updateUserPaymentInfo = function () {
	 Stripe.createToken($scope.paymentInfo, stripeResponseHandler);
	 };
	 function stripeResponseHandler(status, response) {
	 $scope.paymentInfo.id = response.id;
	 $scope.paymentInfo.created = response.created;
	 $scope.paymentInfo.modified = Date.now();
	 $scope.paymentInfo.type = response.type;
	 console.log($scope.paymentInfo);
	 paymentService.savePaymentInfo($scope.paymentInfo).then(function(res){
	 console.log(res);
	 });
	 }*/
});
