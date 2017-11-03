(function(){
  'use strict';

  var demo = angular.module('demo.data', ['ngSanitize','data.fetch']);

  demo.factory('demoDataService', ['$q', 'fetchService', function($q, fetchService){
    var cachedData;

    function postNewEvent(data){
      console.log('post event...');
      var deferred = $q.defer(),
          evt = {};
      evt.title;
      // TO-DO: finish
    }

    function demoData(callback) {
      var deferred = $q.defer(),
          data;
      fetchService.getData().then(function(data){
        console.log('getData successful')
        console.log(data);
      });
      var ref = firebase.database().ref('2017/events/');
      ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        cachedData = data;
        callback(data);
      });
    }

    return {
      postNewEvent: postNewEvent,
      demoData: demoData
    }
  }]);

  demo.controller('demoAddController', ['$scope', 'demoDataService', function($scope, demoDataService){
    $scope.newEvent = {
      dates: [{ date: new Date('Wed Mar 07 2018 00:00:00 GMT-0600 (CST)') }]
    }
    $scope.sxswDates = [{
        day: 'Wednesday',
        date: '07'
    },{
        day: 'Thursday',
        date: '08'
    },{
        day: 'Friday',
        date: '09'
    },{
        day: 'Saturday',
        date: '10'
    },{
        day: 'Sunday',
        date: '11'
    },{
        day: 'Monday',
        date: '12'
    },{
        day: 'Tuesday',
        date: '13'
    },{
        day: 'Wednesday',
        date: '14'
    },{
        day: 'Thursday',
        date: '15'
    },{
        day: 'Friday',
        date: '16'
    },{
        day: 'Saturday',
        date: '17'
    },{
        day: 'Sunday',
        date: '18'
    },{
        day: 'Monday',
        date: '19'
    }];

    console.log($scope.newEvent);
    $scope.speak = function(input){
      console.log(input);
    }

    $scope.getDate = function(day){
      return new Date('2017', '02', day, '0', '0', '0', '0');
    }
  }]);


})();
