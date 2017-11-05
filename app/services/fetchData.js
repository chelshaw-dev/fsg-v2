'use strict';

var data = angular.module('data.fetch', []);
/*
data.factory('firebaseFetch', ['$q', function($q){
  var cachedData;
  var deferred = $q.defer();
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

  return {
    getDemoData: getDemoData
  }
}]);

data.factory('fetchFactory', ['$q', function($q){
  var cachedData;
  console.log('fetchFactory begin');

  function getData() {
    var deferred = $q.defer();
    if(cachedData) {
      console.log('fetchFactory data is cached:');
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

  return {
    getData: getData
  }
}]);
*/
data.service('fetchService', ['$q', function($q){
  var cachedData;

  this.getData = function(){
    var deferred = $q.defer();
    if(cachedData) {
      console.log('fetchService data is cached:');
      deferred.resolve(cachedData);
    } else {
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

  this.clearCache = function(){
    cachedData = null;
    return true;
  }
}]);

data.service('formattedData', ['$q','fetchService', function($q,fetchService){
  var cachedData;

  this.getData = function(){
    var deferred = $q.defer();
    if(cachedData) {
      console.log('formatted data is cached:');
      console.log(cachedData);
      deferred.resolve(cachedData);
    } else {
      fetchService.getData().then(function(data){
        var eventsArray = [];
        angular.forEach(data, function(value, key){
          var thisEvent = {'eid': key};
          angular.forEach(value, function(val,k){
            thisEvent[k] = val;
          });
          eventsArray.push(thisEvent);
        }, function(error){
          console.error(error);
        });
        console.log(eventsArray);
        cachedData = eventsArray;
        deferred.resolve(eventsArray);
      }).catch(function(err){
        deferred.reject(err);
      })
    }

    return deferred.promise;
  }

  this.getDemo = function(){
    var deferred = $q.defer();
    if(cachedData) {
      console.log('formatted data is cached:');
      console.log(cachedData);
      deferred.resolve(cachedData);
    } else {
      fetchService.getData().then(function(data){
        var eventsArray = [];
        angular.forEach(data, function(value, key){
          var thisEvent = {'eid': key};
          angular.forEach(value, function(val,k){
            thisEvent[k] = val;
          });
          eventsArray.push(thisEvent);
        }, function(error){
          console.error(error);
        });
        console.log(eventsArray);
        cachedData = eventsArray;
        deferred.resolve(eventsArray);
      }).catch(function(err){
        deferred.reject(err);
      })
    }

    return deferred.promise;
  }

  this.clearCache = function(){
    cachedData = null;
    return true;
  }
}]);
