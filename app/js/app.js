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


  var fsgApp = angular.module('app', [
    'ui-router'
  ]);

  fsgApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
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

  }]);

})();

// Declare app level module which depends on views, and components
angular.module('app', [
  //'ngRoute',
  //'app.view1',
  //'app.view2'
  'app.core'
]);

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
