'use strict';
app.controller('formDataCtrl', function ($scope, $mdDialog, crmFormDataObj){
    $scope.formData = {};
    $scope.formData = angular.copy(crmFormDataObj);

    $scope.fnCloseFormDataDialog = function(){
        $mdDialog.hide();
    };

    $scope.fnCheckFormData = function(data){
        return Object.keys(data).length;
    };

});