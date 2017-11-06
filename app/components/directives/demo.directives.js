(function(){
  'use strict';

  angular.module('demo.directives', ['core.helper'])
  .directive('dateDisplay',[function(){
    return {
      restrict: 'E',
      scope: {
        days: '='
      },
      controller: ['$scope', function($scope){
        $scope.displayDate = function(daysObject){
          var display;
          var first = true;
          angular.forEach(daysObject, function(value, key) {
            //this.push(key + ': ' + value);
            if(first === true){
              display = value.start || 'Date TBD';
              first = false;
            }
          });
          return display;
        }
      }],
      templateUrl: 'views/directives/demo-date-display-template.html'
    };
  }])
  .directive('cardUserButtons', [function(){
    return {
      restrict: 'E',
      scope: {
        rsvp: '=',
        eid: '='
      },
      templateUrl: 'views/directives/card-user-buttons-template.html',
    };
  }]);
})();
