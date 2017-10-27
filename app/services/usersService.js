(function(){
  'use strict';

  angular.module('app.users', [])

  .factory('userStatus', ['$q', function($q){
    function getCurrent(){
      var deferred = $q.defer();
      var user = {};

      firebase.auth().onAuthStateChanged(function(result) {
         if (result) {
           user = {
             displayName: result.displayName,
             email: result.email,
             uid: result.uid,
             info: false
           }
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

    function getInfo(uid){
      var deferred = $q.defer();
      if(typeof uid == 'string'){
        var ref = firebase.database().ref('users/' + uid);
        ref.once('value').then(function(snapshot) {
          console.log(snapshot.val());
          deferred.resolve(snapshot.val());
        }).catch(function(err){
          deferred.reject(err);
        });
      } else {
        deferred.reject('Error: ID is not a string');
      }
      return deferred.promise;
    };

    return {
      getCurrent: getCurrent,
      isAdmin: isAdmin,
      getInfo: getInfo
    }
  }]);

})();
