'use strict';

// Declare app level module which depends on views, and components
angular.module('fsgDirectives', [])
/* ------------ DIRECTIVES -------------- */
.directive('eventTitle', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/event-title-template.html'
  }
})
.directive('eventLocation', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/event-location-template.html'
  }
})
.directive('freeIcons', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/free-icons-template.html?version1226-1'
  }
})
.directive('cardPopout', ['$filter', function($filter) {
  return {
    restrict: 'E',
    templateUrl: 'views/card-popout-template.html?version=0310-1',
    controller: function($scope){
      var data = $scope.activeCard.data;
      $scope.dataYear = data;
      $scope.mapOptions = {
        draggable: false,
        scrollwheel: false,
        panControl: false,
        maxZoom: 16,
        minZoom: 16,
        zoom: 16,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }
      $scope.unescapeJson = function(snippet){
        if(snippet){
          snippet = snippet.replace(/<\s\//g, '</');
          snippet = snippet.replace(/\\"/g, '"');
        }
        return snippet;
      }
      $scope.defaultDescription = function(days){
        var output = '';
        //var dLength = 78;
        angular.forEach(days, function(value, key) {
          if(!output && value.description){
            output = value.description;
          }
        }, output);
        if (output.length < 1){
          output = 'More info coming soon!';
        }
        return output;
      }
      $scope.mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
      $scope.checkCoords = function(coord){
        if(typeof coord !== 'object'){
          return false;
        } else {
          return true;
        }
      }
      $scope.checkLength = function(days){
        if(typeof days == 'object' && Object.keys(days).length > 1){
          return true;
        } else {
          return false;
        }
      }
      $scope.popoutDateDisplay = function(key,day){
        var timeDisplay = 'time display';
        if(key === 'TBD'){
          timeDisplay = 'Time/Date TBD';
        } else {
          var date,start,end;
          var localDay = new Date(key);
          date = $filter('date')(key, 'MMMM d');
          if(day.end === 'AD'){
            timeDisplay = date + ' • All Day';
          } else {
            if(day.start && day.start != '?'){
              start = $filter('date')(day.start, 'h:mm a');
            } else {
              start = 'TBD';
            }
            if(day.end && day.end != '?'){
              end = $filter('date')(day.end, 'h:mm a');
            } else {
              end = 'TBD';
            }
            timeDisplay = date + ' • ' + start + ' – ' + end;
          }
        }
        return timeDisplay;
      }
      $scope.displayDate = function(days){
        var output;
        if(typeof days == 'object'){
          angular.forEach(days, function(value, key) {
            if(!output){
              var formatted;
              if(key === 'TBD'){
                formatted = '<strong>Date/Time TBD</strong>';
              } else {
                var local = new Date(key);
                var dateObj = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
                dateObj = dateObj.toISOString();
                var date = $filter('date')(dateObj, 'MMMM d');
                var startTime;
                if(value.start && value.start !== '?'){
                  startTime = $filter('date')(value.start, 'h:mm a');
                } else {
                  startTime = 'TBD';
                }
                var endTime;
                if(value.end && value.end !== '?'){
                  endTime = $filter('date')(value.end, 'h:mm a');
                } else {
                  endTime = 'TBD';
                }
                if ((value.start === '?' && value.end === '?') || (!value.start && !value.start)){
                  formatted = '<strong>' + date + '</strong> • Time TBD';
                } else if (startTime.length > 0){
                  formatted = '<strong>' + date + '</strong> • ' + startTime + ' – ' + endTime;
                } else if (value.end === 'AD'){
                  formatted = '<strong>' + date + '</strong> • All Day';
                } else {
                  formatted = '<strong>' + date + '</strong> • Time TBD';
                }
              }
              output = formatted;
            }
          });
        }
        return output;
      }
      $scope.oldDisplayDate = function(days){
        var output;
        if(typeof days == 'object'){
          angular.forEach(days, function(value, key) {
            if(!output){
              var formatted;
              if(data == '2016'){
                /* 2016 Data */
                var date = $filter('date')(value.start_0, 'MMMM d', '-0600');
                var startTime = $filter('date')(value.start_0, 'h:mm a', '-0600');
                var endTime = $filter('date')(value.end_0, 'h:mm a', '-0600');
                formatted = '<strong>' + date + '</strong> • ' + startTime + ' – ' + endTime;
              } else if (data == '2017'){
                /* 2017 Data */
                if(key === 'TBD'){
                  formatted = '<strong>Date/Time TBD</strong>';
                } else {
                  //var year = key.substring(0,4);
                  //var month = key.substring(4,6)-1;
                  //var day = key.substring(6);
                  var local = new Date(key);
                  var dateObj = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
                  //var dateObj = new Date(key);
                  var date = $filter('date')(dateObj, 'MMMM d');
                  var startTime = $filter('date')(value.start, 'h:mm a');
                  var endTime = $filter('date')(value.end, 'h:mm a');
                  if(startTime.length > 0){
                    formatted = '<strong>' + date + '</strong> • ' + startTime + ' – ' + endTime;
                  } else {
                    formatted = '<strong>' + date + '</strong> • Time TBD';
                  }
                }
              }
              output = formatted;
            }
          });
        }
        return output;
      }
      $scope.destroyPopout = function(evt){
        //console.log('destroying 2');
        var clickedElement = evt.currentTarget || evt.srcElement;
        //var _this = angular.element(clickedElement).parent().parent();
        var _this = clickedElement.parentNode.parentNode;
        //_this.remove();
        _this.style.display = 'none';
      }
    }
  }
}])

/*
.directive('eventDays', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/event-days-template.html',
    scope: {
      days: "=",
      first: "="
    },
    controller: function($scope){
      $scope.activeID = 0;
      $scope.activeIndex = 0;
      $scope.updateActive = function (id,index) {
        $scope.activeIndex = index;
        $scope.activeID = id;
      }
    }
  }
})
*/
.directive('skrollrTag', [ 'skrollrService',
   function(skrollrService){
       return {
           link: function(scope, element, attrs){
               skrollrService.skrollr().then(function(skrollr){
                   skrollr.refresh();
               });

              //This will watch for any new elements being added as children to whatever element this directive is placed on. If new elements are added, Skrollr will be refreshed (pulling in the new elements
              scope.$watch(
                  function () { return element[0].childNodes.length; },
                  function (newValue, oldValue) {
                  if (newValue !== oldValue) {
                      skrollrService.skrollr().then(function(skrollr){
                          skrollr.refresh();
                      });
                  }
              });
           }
       };
   }
])
