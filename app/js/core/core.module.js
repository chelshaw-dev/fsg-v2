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
