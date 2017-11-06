(function() {
  'use strict';

  angular.module('app.core', [
    'app.users',
    'data.fetch',
    'core.helper',
    'app.homepage'
  ])

  .config(function($logProvider){
    $logProvider.debugEnabled(true);
  })

  .run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 70;   // always scroll by 50 extra pixels
  }])

  .run(['$log','$rootScope','$state','getReferralCode','userStatus','fetchService', function ($log,$rootScope,$state,getReferralCode,userStatus,fetchService) {
    // Set Referral for visit
    $rootScope.globalError = false;
    $rootScope.taor = getReferralCode;
    var updateRootUser = function(user){
      $rootScope.currentUser = user;
      console.log($rootScope.currentUser);
    }
    var currentUser = {},
        isAdmin = false,
        tryCount = 0;

    // function to fetch info for current user
    function getCurrentUserData(){
      var user;
      userStatus.getCurrent().then(function(result){
        if(result !== 'anonymous' && result.uid){
          formattedData.getData().then(function(data){
            console.log('formatted data acquired');
          });
          user = {
            uid: result.uid,
            isPaid: false,
            isAdmin: false
          };
          userStatus.isAdmin(result.uid).then(function(res){
            isAdmin = true;
            user.isAdmin = true;
          }).catch(function(res){
            isAdmin = false;
            user.isAdmin = false;
          });
        } else {
          fetchService.clearCache();
          user = {
            uid: 'anonymous',
            isPaid: false,
            isAdmin: false
          }
        }
        currentUser = user;
        updateRootUser(user);
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

})();
