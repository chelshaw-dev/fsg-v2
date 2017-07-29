(function(){
  'use strict';

  var login = angular.module('app.login', []);

  login.controller('loginCtrl', ['$scope', function($scope){
    console.log('login controller');

    $scope.logOut = function(){
      firebase.auth().signOut().then(function() {
        //$state.go('home');
        console.log('logged out');
      }, function(error) {
        console.error(error);
      });
    }
  }]);

})();
