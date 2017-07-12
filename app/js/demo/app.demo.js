(function(){
  'use strict';

  var demo = angular.module('app.demo', []);

  demo.controller('demoCtrl', ['$scope', function(){
    console.log('demo controller');
  }]);

})();
