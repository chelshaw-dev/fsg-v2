'use strict';

angular.module('app.users', [])

.factory('userStatus', ['$q', function($q){
  function getCurrent(){
    var deferred = $q.defer();
    firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         deferred.resolve(user);
       } else {
         deferred.resolve('anonymous');
       }
     });
    return deferred.promise;
  }
  function isAdmin(uid){
    var deferred = $q.defer();
    var adminRef = firebase.database().ref('admin/');
    adminRef.once('value').then(function(snapshot) {
      var admins = snapshot.val();
      if(admins[uid]){
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
    }).catch(function(err){
      deferred.reject(false);
    });
    return deferred.promise;
  }

  return {
    getCurrent: getCurrent,
    isAdmin: isAdmin
  }
}]);
