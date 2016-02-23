'use strict';

/**
 * @ngdoc function
 * @name rsmtPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rsmtPortalApp
 */
angular.module('rsmtPortalApp')
  .controller('MainCtrl', function ($scope, $location) {

      $scope.fnToggleSideNav = function(componentId) {
          $mdSidenav(componentId).toggle();
      };

      $scope.fnIsActive = function (viewLocation) {
          return viewLocation === $location.path() ? 'md-accent' : '';
      };

      $scope.fnLogout = function () {
          CarglyPartner.logout(function () {
              $cookies.remove(cookieName);
              $state.go('login');
          }, function () {});
      };

      $scope.fnStateSettings = function () {
          $state.go('main.settings', { 'settingsName' : 'account'});
      };

      $scope.fnInitMain = function(){
          if(localStorage.getItem('userObj')){
              $scope.userObj = JSON.parse(localStorage.getItem('userObj'));
          }
      };
  });
