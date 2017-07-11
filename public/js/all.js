// Declare app level module which depends on views, and components
angular.module('app', [
  //'ngRoute',
  //'app.view1',
  //'app.view2'
  'app.core'
]);
/*
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});

  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}]);
*/

var myApp = angular.module('app', ['ui.router']);

myApp.config(function($stateProvider) {
  var helloState = {
    name: 'hello',
    url: '/hello',
    template: '<h3>hello world!</h3>'
  }

  var aboutState = {
    name: 'about',
    url: '/about',
    template: '<h3>Its the UI-Router hello world app!</h3>'
  }

  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
});

(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        //'ngAnimate', 'ngRoute', 'ngSanitize',

        /*
         * Our reusable cross app code modules
         */
        //'blocks.exception', 'blocks.logger', 'blocks.router',
        /*
         * 3rd Party modules
         */
        //'ngplus'
    ])
    .controller('view1Ctrl', ['$scope', function($scope){
      console.log('view1');
    }]);
})();

(function() {
    'use strict';

    angular.module('app.map', [])

    .controller('MapController', ['$scope', function($scope){
      console.log('app.map controller');
    }]);
})();
