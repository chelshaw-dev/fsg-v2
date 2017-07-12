(function(){
  'use strict';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDp0tenVtXevo5vAjYQECgH7uJOtg8cuDE",
    authDomain: "free-shit-guide.firebaseapp.com",
    databaseURL: "https://free-shit-guide.firebaseio.com",
    projectId: "free-shit-guide",
    storageBucket: "free-shit-guide.appspot.com",
    messagingSenderId: "978642497086"
  };
  firebase.initializeApp(config);

  var myApp = angular.module('app', [
    'app.core',
    'app.homepage',
    'app.register',
    'app.demo'
  ]);

})();

(function(){
  'use strict';

  var reg = angular.module('app.register', []);

  reg.controller('registerCtrl', ['$scope', function(){
    console.log('register controller');
  }]);
  
})();

(function(){
  'use strict';

  var demo = angular.module('app.demo', []);

  demo.controller('demoCtrl', ['$scope', function(){
    console.log('demo controller');
  }]);

})();

(function(){
  'use strict';

  var home = angular.module('app.homepage', []);

  home.service('skrollrService', ['$document', '$q', '$rootScope', '$window',
    function($document, $q, $rootScope, $window){
      var defer = $q.defer();

      function onScriptLoad() {
          // Load client in the browser
          var winWidth = window.innerWidth;
          var mobile;
          $rootScope.$apply(function() {
              if(winWidth < 768 || (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)){
                mobile = true;
              } else {
                mobile = false;
              }
              var s = $window.skrollr.init({
                      forceHeight: mobile,
                      smoothScrolling: true,
                      mobileCheck: function() {
                        return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
                      },
                      mobileDeceleration: 1
                  });
              if(mobile){ s.destroy(); }
              defer.resolve(s);
          });
      }

      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'bower_components/skrollr/dist/skrollr.min.js';

      scriptTag.onreadystatechange = function () {
          if (this.readyState === 'complete') onScriptLoad();
      };

      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
          skrollr: function() { return defer.promise; }
      };
    }
  ]);

  home.controller('homeCtrl', ['$scope','skrollrService', function($scope,skrollrService) {
   $scope.showFeature = 'events';
  }]);

})();

(function() {
    'use strict';

    angular.module('app.map', [])

    .controller('MapController', ['$scope', function($scope){
      console.log('app.map controller');
    }]);
})();

(function() {
  'use strict';

  angular.module('app.core', [
    'ui.router'
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

  .config(["$locationProvider", function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    var homeState = {
      name: 'home',
      url: '/',
      templateUrl: "views/home.html",
      controller: 'homeCtrl',
      data: {
        requireLogin: false,
        requirePayment:false,
        requireAdmin:false
      }
    }
    var demoEvents = {
      name: 'demoEvents',
      url: "/demo/events",
      templateUrl: "views/demo-events.html",
      controller: 'demoCtrl',
      controllerAs: "e",
      data: {
        requireLogin: false,
        requirePayment:false,
        requireAdmin:false
      }
    }

    $urlRouterProvider.otherwise("/");
    $stateProvider.state(homeState);
    $stateProvider.state(demoEvents);
    /*
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "views/home.html",
        controller: 'homeCtrl',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('login', {
        url: '/signin',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'lc',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('register', {
        url: '/register?taor',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl',
        controllerAs: 'rc',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('events', {
        url: "/events?data",
        templateUrl: "views/events.html?version1112",
        controller: 'eventsCtrl',
        controllerAs: "e",
        data: {
          requireLogin: true,
          requirePayment:true,
          requireAdmin:false
        }
      })
      .state('demoEvents', {
        url: "/demo/events",
        templateUrl: "views/demo-events.html",
        controller: 'demoCtrl',
        controllerAs: "e",
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'views/blog.html',
        controller: 'blogCtrl',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('newPost',{
        url:'/new-blog',
        templateUrl: 'views/new-blog-post.html?version1108',
        controller: 'newBlogCtrl',
        data: {
          requireLogin:true,
          requirePayment:false,
          requireAdmin:true
        }
      })
      .state('404',{
        url: '/404',
        templateUrl: 'views/404.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('terms',{
        url: '/terms',
        templateUrl: 'views/terms.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('privacy',{
        url: '/privacy',
        templateUrl: 'views/privacy.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('demoMap', {
        url: "/demo/map",
        templateUrl: "views/demo-map.html",
        controller: 'demoMapCtrl',
        controllerAs: "mc",
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('map', {
        url: "/map?data",
        templateUrl: "views/map.html",
        controller: 'mapCtrl',
        controllerAs: "mc",
        data: {
          requireLogin: true,
          requirePayment:true,
          requireAdmin:false
        }
      })
    */
  }])

  .controller('appController', ['$scope', function($scope){
    console.log('app controller');
  }])

})();
