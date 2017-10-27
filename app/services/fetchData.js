'use strict';

var data = angular.module('data.fetch', []);

data.factory('firebaseFetch', ['$q', function($q){
  var cachedData;

  function getDemoData() {
    if(cachedData) {
      console.log('data is cached:');
      console.log(cachedData);
      deferred.resolve(cachedData);
    } else {
      var deferred = $q.defer();
      var ref = firebase.database().ref('2017/events/');
      ref.once('value').then(function(snapshot) {
        events = snapshot.val();
        cachedData = events;
        deferred.resolve(events);
      }).catch(function(err){
        deferred.reject(err);
      });
    }
    return deferred.promise;
  }
  /*
  function getDemoData(callback) {
    if(cachedData) {
      console.log('data is cached:');
      console.log(cachedData);
      callback(cachedData);
    } else {
      var ref = firebase.database().ref('2017/events/');
      ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        cachedData = data;
        callback(data);
      });
    }
  }
  */

  return {
    getDemoData: getDemoData
  }
}]);
