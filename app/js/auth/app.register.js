(function(){
  'use strict';

  var reg = angular.module('app.register', []);

  reg.controller('signupFormController', ['$log','$scope','$state', function($log,$scope,$state){
    var $ctrl = this;
    $ctrl.status = 'ready';

    /* PART 1 -- EMAIL/TWITTER/FACEBOOK SIGNUP */
    var sendMailchimp = function(user){
      var pLoad = {
      email_address: user.email,
      f_name: user.fname,
      l_name: user.lname,
      list_id: '695fa0275a'
      };
      $log.debug('Mailing list signup deactivated');
      /* Custom mailchimp subscribe server
      $http({
        url: 'https://my.url.com',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: pLoad
      }).success(function(data, status, headers, config){
        $log.debug(status);
      }).error(function(err){
        $log.err(err);
      });
      */
    }

    $ctrl.registerUserEmail = function(regObject){
      $ctrl.status = 'processing';
      var fname = regObject.firstname || '',
          lname = regObject.lastname || '',
          p = regObject.password || '',
          email = regObject.email || '',
          userID,
          subscriber = {
            email: email,
            fname: fname,
            lname: lname
          },
          newUser = {
            email: email,
            displayName: fname + ' ' + lname
          };

      sendMailchimp(subscriber);
      if(2 === 3){
        fbq('track', 'CompleteRegistration');
      }
      $log.debug('creating auth for '+email);
      firebase.auth().createUserWithEmailAndPassword(email, p).then(function(result){
        $log.debug(result);
        userID = result.uid;
        //$scope.user = result;
        // updated profile with displayName
        firebase.auth().currentUser.updateProfile({ displayName: fname + ' ' + lname }).then(function(result) { /* Update successful */ }, function(error) { /* Error happened */ });
        $scope.register.processing = false;
        $state.go('register');
      }).catch(function(error) {
        console.error(error);
        if(error.code = 'auth/email-already-in-use'){
          $scope.$apply( $scope.errMessage.loginRedirect = true);
          $ctrl.status = 'error';
        } else {
          $scope.$apply( $scope.errMessage.generic = error.message);
          $ctrl.status = 'error';
        }
      });
    }

  }]);

  reg.controller('registerController', ['$scope', 'userStatus', function($scope, userStatus){
    var $ctrl = this;
    $scope.regState = 0;

    var goToStep = function(step){
      console.log(step);
      $scope.regState = step;
    }
    //var step = $location.search().step || 'none';
    //$scope.regStep = step;
    userStatus.getCurrent().then(function(result){
      if(result == 'anonymous'){
        goToStep(1);
        console.log('stay step 1');
      } else {
        console.log(result);
        userStatus.getInfo(result.uid).then(function(data){
          if(null == data){
            goToStep(2);
            console.log('go to step 2');
          } else {
            goToStep(3);
            console.log('go to step 3');
          }
          console.log(data);
        }).catch(function(err){
          console.log(err);
        });
      }
    }).catch(function(err){
      console.error(err);
    })
  }]);

  reg.controller('oldRegisterCtrl', ['$rootScope', '$document', '$scope', '$http', 'stripe', 'promoFactory','userService','$state', '$stateParams', function($rootScope, $document, $scope, $http, stripe, promoFactory, userService,$state,$stateParams){
    var rc = this;
    var taor = $rootScope.taor || false;

    $scope.showRegForm = false;
    var page = $rootScope.page;
    $scope.errMessage = {
      loginRedirect: false,
      generic: false
    };
    $scope.register = {
      processing: false
    };
    $scope.payment = {
      expected_charge: 10,
      promo_code: '',
      processing:false
    };
    $scope.cardError = {
      count: 0,
      message: ''
    }
    $scope.user = {};
    var saveUserInfo = function(data){
      $scope.user.info = data;
    }
    // Watch currentUser for changes so we can update the page
    $rootScope.$watch('currentUser', function(newVal,oldVal){
      $scope.user = newVal;
      if(newVal && newVal.email){
        $scope.payment.email = newVal.email;
        $scope.payment.uid = newVal.uid;
      }
      //Finds user data from db -- do we need this?
      if(newVal && newVal.uid){
        var userRef = firebase.database().ref('users/' + newVal.uid);
        userRef.on('value', function(snapshot) {
          saveUserInfo(snapshot.val());
        });
      }
    })

    /* PART 1 -- EMAIL/TWITTER/FACEBOOK SIGNUP */
    var sendMailchimp = function(user){
      var pLoad = {
      email_address: user.email,
      f_name: user.fname,
      l_name: user.lname,
      list_id: '695fa0275a'
      };
      //Call the services
      $http({
        url: 'https://fsg.pythonanywhere.com/mailchimp_subscribe_json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: pLoad
      }).success(function(data, status, headers, config){
        //console.log(status);
      }).error(function(err){
        //console.error(err);
      });
    }

    $scope.registerUser = function(regObject){
      $scope.register.processing = true;
      var fname = regObject.firstname;
      var lname = regObject.lastname;
      var p = regObject.password;
      var email = regObject.email;
      var subscriber = {
        email: email,
        fname: fname,
        lname: lname
      };
      var newUser = {
        email: email,
        displayName: fname + ' ' + lname
      };
      var userID;
      sendMailchimp(subscriber);
      if(2 === 3){
        fbq('track', 'CompleteRegistration');
      }
      firebase.auth().createUserWithEmailAndPassword(email, p).then(function(result){
        userID = result.uid;
        $scope.user = result;
        // updated profile with displayName
        firebase.auth().currentUser.updateProfile({ displayName: fname + ' ' + lname }).then(function(result) { /* Update successful */ }, function(error) { /* Error happened */ });
        $scope.user.info = userService.createUser(userID,newUser);
        $scope.register.processing = false;
        if(page !== 'register'){
          $state.go('register');
        }
      }).catch(function(error) {
        console.error(error);
        if(error.code = 'auth/email-already-in-use'){
          $scope.$apply( $scope.errMessage.loginRedirect = true);
          $scope.register.processing = false;
        } else {
          $scope.$apply( $scope.errMessage.generic = error.message);
          $scope.$apply( $scope.register.processing = false );
        }
      });
    }
    $scope.logInFB = function(){
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        var subscriber = {
          email: '',
          fname: '',
          lname: ''
        };
        user.providerData.forEach(function (profile) {
          var name = profile.displayName;
          subscriber.email = profile.email;
          var split = name.indexOf(' ');
          subscriber.fname = name.substring(0,split);
          subscriber.lname = name.substring(split+1,name.length);
        });
        if(subscriber.email !== ''){
          sendMailchimp(subscriber);
        }
        userService.userExists(user.uid).then(function(result){
          // User exists! continue as normal
        })
        .catch(function(userID){
          // User does not yet exist in DB. Create...
          userService.createUser(userID,user);
        });
        if(2 === 3){
          fbq('track', 'CompleteRegistration');
        }
        $scope.user = user;
        if(page !== 'register'){
          $state.go('register');
        }
      }).catch(function(error) {
        $scope.$apply( $scope.errMessage.generic = error.message);
      });
    }

    $scope.logInTwitter = function(){
      var provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        var subscriber = {
          email: '',
          fname: '',
          lname: ''
        };
        user.providerData.forEach(function (profile) {
          var name = profile.displayName;
          subscriber.email = profile.email;
          var split = name.indexOf(' ');
          subscriber.fname = name.substring(0,split);
          subscriber.lname = name.substring(split+1,name.length);
        });
        if(subscriber.email !== ''){
          sendMailchimp(subscriber);
        }
        userService.userExists(user.uid).then(function(result){
          // User exists! continue as normal
          }).catch(function(userID){
            // User does not yet exist in DB. Create...
            userService.createUser(userID,user);
          });
        if(2 === 3){
          fbq('track', 'CompleteRegistration');
        }
        $scope.user = user;
        if(page !== 'register'){
          $state.go('register');
        }
      }).catch(function(error) {
        console.error(error);
        $scope.$apply( $scope.errMessage.generic = 'Uh-oh, something went wrong.');
      });
    }

    /* PART 2 -- PAYMENT */
    $scope.findPromo = function(code){
      code = code.toUpperCase();
      promoFactory.getDiscount(code).then(function(result){
        $scope.payment.expected_charge = result.price;
        $scope.payment.message = result.message;
      }).catch(function(err){
        $scope.payment.message = err;
      });
    }
    $scope.paymentBypass = function(){
      var info = $scope.payment;
      var uid = $scope.user.uid;
      var ref = firebase.database().ref('/users/'+uid);
      ref.once('value').then(function(snapshot) {
        ref.child('paid').set(info.promo_code);
        promoFactory.applyDiscount(info.promo_code);
        $scope.$apply($scope.user.info.paid = info.promo_code);
      }).catch(function(err){
        console.error(err);
      })
    }
    $scope.charge = function () {
      $scope.payment.processing = true;

      stripe.card.createToken($scope.payment.card)
        .then(function (response) {
          var payment = angular.copy($scope.payment);
          delete payment.card; // = void 0;
          delete payment.error;
          payment.livemode = response.livemode;
          payment.stripe_token = response.id;
          payment.promo_code = payment.promo_code.toUpperCase();
          // SEND PAYMENT TO SERVER
          $http({
              url: 'https://fsg.pythonanywhere.com/complete_payment',
              method: "POST",
              data: payment
              //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (response) {
            if(false === response.data.error){
              promoFactory.applyDiscount(payment.promo_code);
              if(taor){
                var refer = {
                  referredBy: taor,
                  paid: payment.expected_charge,
                  uid: payment.uid
                };
                promoFactory.postReferral(refer).then(function(result){ /* successful referral */ })
              }
              if(2 === 3){
                fbq('track', 'Purchase', {
                  value: payment.price,
                  currency: 'USD'
                });
              }
              delete $scope.payment.card;
              $scope.payment.processing = false;
            } else {
              $scope.cardError.message = response.data.error.message || 'There was a problem processing the payment. Please double-check your card info';
              $scope.payment.processing = false;
            }
          }, function (err) { //data, status, headers, config
            $scope.cardError.message = response.data.error || 'There was a problem processing the payment. Please try again later';
            $scope.payment.processing = false;
          });
          //delete $scope.payment.card;
        }).catch(function(err){
          $scope.cardError.count++;
          $scope.cardError.message = err.message;
          $scope.payment.processing = false;
        });
    };
  }]);

})();
