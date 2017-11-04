(function(){
  'use strict';

  var mc = angular.module('app.mailingList', ['ui.bootstrap']);
  mc.controller('registerWidgetController', ['$scope', function($scope){
    $scope.register = {};

    // ERROR HANDLING
    $scope.formError = {
      show: false,
      message: '',
    }
    $scope.showForm = function(msg) {
      $scope.formError = {
        show: true,
        message: msg || 'Hey friend, no need to register again! That email already has an account.'
      }
    }

    $scope.registerUser = function(reg){
      console.log('TO DO: app.mailingList registerUser');
    }

  }]);

  mc.controller('signupModalController', ['$rootScope','$http', function($rootScope,$http){
    var ctrl = this;
    ctrl.results = false;
    var userInfo = $rootScope.currentUser;
    ctrl.subscribe = function(email){
      var pLoad = {
      email_address: email,
      f_name: '',
      l_name: '',
      list_id: '8107224622'
      };
      //Call the services
      $http({
        url: 'https://fsg.pythonanywhere.com/mailchimp_subscribe_json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: pLoad
      }).success(function(data, status, headers, config){
        ctrl.results = 'Sweet! Be on the lookout for updates.';
      }).error(function(err){
        ctrl.results = 'Uh-oh! Something went wrong. Please try again';
      });
    }
  }]);

  mc.controller('mailingListWidgetController', ['$uibModal', function($uibModal){
    var $ctrl = this;
    var user = {}; // $rootScope.currentUser;

    $ctrl.open = function () {
      //var email = user.email || '';
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'components/directives/mailchimp-weekly-list.html',
        controller: registerModalController,
        controllerAs: 'ctrl',
        size: 'sm',
        resolve: {
          email: function () {
            return 'email';
          }
        }
      });
    }
  }]);

  mc.controller('mailchimpCtrl', ['$uibModal','$rootScope','$http', function($uibModal,$rootScope,$http){
    var $ctrl = this;
    var user = $rootScope.currentUser;

    $ctrl.open = function () {
      //var email = user.email || '';
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'components/directives/mailchimp-weekly-list.html',
        controller: function($rootScope){
          var ctrl = this;
          ctrl.results = false;
          var userInfo = $rootScope.currentUser;
          ctrl.subscribe = function(email){
            var pLoad = {
            email_address: email,
            f_name: '',
            l_name: '',
            list_id: '8107224622'
            };
            //Call the services
            $http({
              url: 'https://fsg.pythonanywhere.com/mailchimp_subscribe_json',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              data: pLoad
            }).success(function(data, status, headers, config){
              //console.log(status);
              ctrl.results = 'Sweet! Be on the lookout for updates.';
            }).error(function(err){
              ctrl.results = 'Uh-oh! Something went wrong. Please try again';
            });
          }
        },
        controllerAs: 'ctrl',
        size: 'sm',
        resolve: {
          email: function () {
            return 'email';
          }
        }
      });
    }
  }])

})();
