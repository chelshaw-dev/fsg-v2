(function(){
  'use strict';

  var home = angular.module('app.homepage', []);

  home.controller('homeCtrl', ['$scope','skrollrService', function($scope,skrollrService) {
    $scope.showFeature = 'map';
  }]);

  home.service('skrollrService', ['$document', '$q', '$rootScope', '$window',
    function($document, $q, $rootScope, $window){
      var defer = $q.defer();

      function onScriptLoad() {
          // Load client in the browser
          var winWidth = window.innerWidth;
          var mobile;
          $rootScope.$apply(function() {
              if(winWidth < 768 || (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)){
                mobile = true;
              } else {
                mobile = false;
              }
              var s = $window.skrollr.init({
                      forceHeight: mobile,
                      smoothScrolling: true,
                      mobileCheck: function() {
                        return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
                      },
                      mobileDeceleration: 1
                  });
              if(mobile){ s.destroy(); }
              defer.resolve(s);
          });
      }

      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'lib/skrollr.min.js';

      scriptTag.onreadystatechange = function () {
          if (this.readyState === 'complete') onScriptLoad();
      };

      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
          skrollr: function() { return defer.promise; }
      };
    }
  ]);

})();
