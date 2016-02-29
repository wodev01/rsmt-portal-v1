'use strict';
app.factory('Toast',['$mdToast',
    function($mdToast) {
        var toastService = {};

        /*-------------- Getter and Setter Method ---------*/
        toastService.success = function(msg){
            $mdToast.show({
                template: '<md-toast class="tr-toast-msg-success"><span flex>'+msg+'</span></md-toast>',
                hideDelay: 2000,
                position: 'top right'
            });
        };

        toastService.failure = function(msg){
            $mdToast.show({
                template: '<md-toast class="tr-toast-msg-error"><span flex>'+msg+'</span></md-toast>',
                hideDelay: 2000,
                position: 'top right'
            });
        };

        return toastService;
    }
]);
