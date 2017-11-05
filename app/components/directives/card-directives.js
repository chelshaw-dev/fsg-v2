angular.module('app.cards', ['ngMap','app.helper'])
.controller('eventsCardsController', ['$scope','$log', function($scope,$log) {

  $scope.toggleRSVP = function(evt,eid,RSVPLink,title){
    $log.warn('TO DO: RSVP TOGGLE');
  }
  $scope.toggleFavorite = function(evt,eid){
    $log.warn('TO DO: FAVORITE TOGGLE');
  }
  $scope.activatePopout = function(){
    $log.warn('TO DO: POPOUT');
  }

}])
.controller('cardBottomController', ['$scope', '$log', function($scope, $log){
  $scope.credentialsDisplay = function(level){
    if(level == 20){
      return 'Wristband/badge priority';
    } else if (level == 30){
      return 'Wristband/badge only';
    } else if (level == 40){
      return 'Badge only';
    } else {
      return 'See notes for entry rules';
    }
  }

  $scope.ageDisplay = function(age){
    if(age == 0){
      return 'All ages';
    } else if (age == 18){
      return '18+';
    } else if (age == 21){
      return '21+';
    }
  }

}])
.controller('cardUserButtonsController', ['$scope','$log', function($scope,$log){
  $log.debug('TO DO: CARD USER BUTTONS CTRL');
}])
.directive('fsgCard', function() {
  // DEFUNCT
  return {
    restrict: 'E',
    scope: {
      card: '=event',
      index: '='
      //transclude: true,
      //popout: '&onPopout'
    },
    templateUrl: 'views/directives/event-card-template.html'
  };
})
.directive('freeIcons',[function(){
  return {
    restrict: 'E',
    scope: {
      food: '=',
      drink: '=',
      swag: '=',
      recharge: '=',
      music: '='
    },
    templateUrl: 'views/directives/free-icons-template.html'
  };
}])
.directive('cardLocation',[function(){
  return {
    restrict: 'E',
    scope: {
      name: '=',
      addr: '='
    },
    templateUrl: 'views/directives/event-location-template.html'
  };
}])
.directive('cardDisclaimer', [function(){
  return {
    restrict: 'E',
    scope: {
      age: '=',
      credential: '='
    },
    templateUrl: 'views/directives/card-disclaimer-template.html'
  };
}])
.directive('cardUserButtons', [function(){
  return {
    restrict: 'E',
    scope: {
      rsvp: '=',
      eid: '='
    },
    templateUrl: 'views/directives/card-user-buttons-template.html'
  };
}])
.directive('cardDateDisplay',[function(){
  return {
    restrict: 'E',
    scope: {
      start: '=',
      end: '='
    }
  };
}])
.directive('cardPopout',[function(){
  return {
    restrict: 'E',
    scope: true,
    controller: ['$scope','NgMap','mapOptions', function($scope,NgMap,mapOptions){
      $ctrl = this;
      $ctrl.checkCoords = function(coord){
        console.log(coord);
        if(typeof coord !== 'object'){
          return false;
        } else {
          return true;
        }
      };
      $scope.mapOptions = mapOptions.standard;
      $scope.mapStyle = mapOptions.style;
    }],
    controllerAs: '$popCtrl',
    templateUrl: 'views/directives/card-popout-template.html'
  }
}]);
