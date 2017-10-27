(function(){
  'use strict';

  var demo = angular.module('app.demo', ['app.cards','demo.data']);

  demo.controller('demoCardController', ['$scope','demoDataService', function($scope,demoDataService){
    console.log('demo controller');
    $scope.testEvents = [
      { name: 'Naomi', address: '1600 Amphitheatre' },
      { name: 'Igor', address: '123 Somewhere' }
    ];
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

    demoDataService.demoData(function(data){
      console.log('done!');
    });
  }]);

})();
