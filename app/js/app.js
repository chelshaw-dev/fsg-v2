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
