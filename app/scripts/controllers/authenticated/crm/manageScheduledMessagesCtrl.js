'use strict';
app.controller('manageScheduledMessagesCtrl',
    function ($scope, $mdDialog, $filter, crmInteractionObj) {

        $scope.crmInteraction = $scope.repairOrder = undefined;
        $scope.crmInteraction = angular.copy(crmInteractionObj);
        $scope.isProcessing = false;
        $scope.item = {};

        if ($scope.crmInteraction) {
            $scope.crmInteraction.due_date =
                $filter('date')($scope.crmInteraction.due_date, 'MM/dd/yyyy h:mm a');

            $scope.repairOrder = $scope.crmInteraction.repair_order;
        }

        $scope.fnInitInspectedItems = function (itemName, inspectedItems) {
            //find object By Name in inspected items.
            $scope.item[itemName] = $.grep(inspectedItems, function (e) {
                return e.name === itemName;
            })[0];
        };

        $scope.fnCloseDialog = function() {
            $mdDialog.hide();
        };

    });