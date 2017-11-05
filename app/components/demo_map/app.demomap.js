(function(){
  'use strict';

  var demo = angular.module('app.demomap', [
    'demo.data',
    'data.fetch',
    'ngMap',
    'app.helper'
  ]);

  demo.controller('demoMapController', ['$scope','NgMap','mapOptions', function($scope,NgMap,mapOptions){
    var $ctrl = this;

    $scope.userFaves = [];
    $scope.userRSVP = [];
    $scope.userLocation = false;
    $scope.mapStatus = "Fetching events…";
    $ctrl.mapOptions = mapOptions.stdOptions;
    $ctrl.mapStyle = mapOptions.style;
    $ctrl.map;
    $ctrl.userPosition = mapOptions.defaultCenter;
  }]);
})();
