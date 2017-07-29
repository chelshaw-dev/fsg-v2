(function(){
  'use strict';

  var demo = angular.module('app.demo', []);

  demo.controller('demoCardController', ['$scope', function($scope){
    console.log('demo controller');
    $scope.bootStatus = false;
    var $ctrl = this;
    // Filters
    $scope.filter = {};
    $scope.sortEventsBy = '';
    $ctrl.filterReset = function(){
      $scope.filter = {
        search: '',
        food: false,
        drink: false,
        recharge: false,
        swag: false,
        music:false,
        today: 'all',
        badge: '-1',
        faves: 'all',
        rsvp: 'all',
        date: 'all',
        musicTags: []
      }
    }

    $ctrl.filterReset();

    setTimeout(function(){
      $scope.bootStatus = true;
      console.log('boot status');
    },2000)
  }]);

})();
