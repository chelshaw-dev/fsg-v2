angular.module('app.cards', [])
.controller('eventsCardsController', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])
.directive('fsgCard', function() {
  return {
    restrict: 'E',
    scope: {
      card: '=event'
    },
    templateUrl: 'views/directives/event-card.html'
  };
});

/*
angular.module('app.cardDirective', [])
.controller('cardController', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])
.directive('fsgCard', function() {
  return {
    restrict: 'E',
    //scope: {
    //  eventInfo: '=info'
    //},
    templateUrl: 'directives/event-card.html'
  };
});
*/
