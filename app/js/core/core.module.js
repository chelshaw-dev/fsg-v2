(function() {
  'use strict';

  angular.module('app.core', ['app.users'])

  .config(function($logProvider){
    $logProvider.debugEnabled(true);
  })

  .factory('getReferralCode', ['$location',function($location){
    var taor = $location.search().taor;
    if(undefined !== taor){
      return taor.toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');
    } else {
      return false;
    }
  }])

  .run(['$log','$rootScope','$state','getReferralCode','userStatus', function ($log,$rootScope,$state,getReferralCode,userStatus) {
    // Set Referral for visit
    $rootScope.taor = getReferralCode;

    var currentUser = false,
        isAdmin = false,
        tryCount = 0;

    // function to fetch info for current user
    function getCurrentUserData(){
      var user;
      userStatus.getCurrent().then(function(result){
        if(result !== 'anonymous' && result.uid){
          user = {
            uid: result.uid,
            isPaid: false,
            isAdmin: false
          };
          userStatus.isAdmin(result.uid).then(function(res){
            isAdmin = true;
            currentUser.isAdmin = true;
          }).catch(function(res){
            isAdmin = false;
            currentUser.isAdmin = false;
          });
        } else {
          user = {
            uid: 'anonymous',
            isPaid: false,
            isAdmin: false
          }
        }
        currentUser = user;
      }).catch(function(err){
        $rootScope.globalError = 'Cannot get user data at the moment. Please try again later';
        console.error(err);
      });
    }

    // on state change, check if current user info loaded
    // if so, proceed with checks
    function goToPage(name){
      $state.go(name);
      $rootScope.page = name;
    }
    function checkCreds(page,reqLogin,reqAdmin,reqPayment){
      if(!currentUser){
        setTimeout(checkCreds(),300);
      } else {
        if(currentUser.isAdmin){
          goToPage(page);
        } else if(reqAdmin){
          goToPage('404');
        } else if (reqPayment && !currentUser.paid) {
          goToPage('register');
        } else if (reqLogin && currentUser.uid == 'anonymous') {
          goToPage('login');
        } else {
          $log.debug('State error - scenario not found');
        }
      }
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      $log.debug('state change start');
      var reqLogin = toState.data.requireLogin || false,
          reqAdmin = toState.data.requireAdmin || false,
          reqPayment = toState.data.requirePayment || false;

      if(reqLogin || reqAdmin || reqPayment){
        event.preventDefault();
        checkCreds(toState,reqLogin,reqAdmin,reqPayment);
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() {
     document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    // Watch for auth changes and update current user
    firebase.auth().onAuthStateChanged(function(user) {
      $log.debug('state changed');
      getCurrentUserData();
    });

  }]);
  /* end core.module.js */
})();
