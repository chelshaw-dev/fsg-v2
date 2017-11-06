(function(){
  'use strict';

  var demo = angular.module('demo.map', [
    //'demo.data',
    'demo.directives',
    'data.fetch',
    'ngMap',
    'core.helper',
    'demo.filters'
  ]);

  demo.controller('demoMapController', ['$scope','NgMap','mapOptions','formattedData','filterService', function($scope,NgMap,mapOptions,formattedData,filterService){
    var $ctrl = this;
    $scope.bootStatus = false;
    $scope.mapStatus = "Fetching events…";
    // DATA
    formattedData.getData().then(function(data){
      $scope.events = data;
      $scope.bootStatus = true;
      $scope.mapStatus = "Loading events…";
    });
    // USER DATA
    $scope.userFaves = [];
    $scope.userRSVP = [];
    $scope.userLocation = false;
    // MAP OPTIONS
    $ctrl.mapOptions = mapOptions.stdOptions;
    $ctrl.mapStyle = mapOptions.style;
    $ctrl.map;
    $ctrl.userPosition = mapOptions.defaultCenter;
    // FILTERS
    $scope.showFilterMenu = false;
    $scope.sortEventsBy = '';
    $scope.filter = {};
    $scope.filterReset = function(){
      $scope.filter = filterService.filterDefaults('demo');
    }
    $scope.filterReset();
    $scope.toggleFilter = filterService.toggleFilterGroup;
    $scope.demoDates = filterService.demoDates;
    $scope.genres = filterService.demoGenres;

    $scope.selectedEvent = '';
    $scope.updateSelectedEvent = function(eid){
      if($scope.selectedEvent === eid){
        $scope.selectedEvent = ''
      } else {
        $scope.selectedEvent = eid;
      }
    }
    $scope.toggleFavorite = function(evt,eid){
      evt.stopPropagation();
      var fIndex = $scope.userFaves.indexOf(eid);
      if(fIndex >= 0){
        $scope.userFaves.splice(fIndex,1);
      } else {
        $scope.userFaves.push(eid);
      }
      $scope.playedCount++;
      $scope.playedFaves++;
    }
    $scope.toggleRSVP = function(evt,eid,link,evtTitle){
      evt.stopPropagation();
      var rIndex = $scope.userRSVP.indexOf(eid);
      if(rIndex >= 0){
        $scope.userRSVP.splice(rIndex,1);
      } else {
        console.log('TO-DO: open RSVP modal');
        //$scope.openRsvpModal(eid,evtTitle);
        //$window.open(link, '_blank');
      }
      $scope.playedCount++;
      $scope.playedFaves++;
    }

  }]);

})();
