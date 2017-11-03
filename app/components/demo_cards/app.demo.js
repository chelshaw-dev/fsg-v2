(function(){
  'use strict';

  var demo = angular.module('app.demo', ['app.cards','demo.data','data.fetch']);

  demo.controller('demoCardController', ['$scope','formattedData','$log', function($scope,formattedData,$log){
    $log.debug('demo controller');
    var $ctrl = this;
    $scope.bootStatus = false;

    $scope.testFn = function(id){
      $log.debug('eid' + id);
    };
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

    /* OLD FIND COL/ROW
    $scope.findRow = function(num){
      var numPerRow = windowService >= 768 ? 3 : 1;
      return (Math.floor(num/numPerRow))+1;
    }
    $scope.findCol = function(num){
      var numPerRow = windowService >= 768 ? 3 : 1;
      return (num%numPerRow)+1;
    }
    */
    $ctrl.findRow = function(index){
      var numPerRow = 3
      return (Math.floor(index/numPerRow))+1;
    }
    $ctrl.findCol = function(index){
      var numPerRow = 3
      return (index%numPerRow)+1;
    }

    formattedData.getData().then(function(data){
      $log.debug('done getting data');
      $scope.events = data;
      $scope.bootStatus = true;
    });

    $scope.toggleFilter = function(evt,className){
      $log.warn('TO-DO: FILTER TOGGLE');
    }

  }]);

})();
