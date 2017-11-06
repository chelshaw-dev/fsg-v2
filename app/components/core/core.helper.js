(function(){
  'use strict';

  var helper = angular.module('core.helper', []);

  helper.factory('getReferralCode', ['$location',function($location){
    var taor = $location.search().taor;
    if(undefined !== taor){
      return taor.toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');
    } else {
      return false;
    }
  }]);

  helper.factory('mapOptions', [function(){
    var style = [
      {"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}
    ];
    var standardOptions = {
      draggable: true,
      scrollwheel: true,
      panControl: false,
      maxZoom: 20,
      minZoom: 1,
      zoom: 16,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    var defaultCenter = {
      // 6th and Lamar
      latitude: 30.266219,
      longitude: -97.743466
    };

    return {
      style: style,
      standard: standardOptions,
      defaultCenter: defaultCenter
    }
  }])

  helper.factory('filterService', [function(){
    var toggleFilterGroup = function(evt){
      var _this = evt.currentTarget || evt.srcElement;
      var clickedElement = angular.element(_this);
      var group = clickedElement.parent();
      group.toggleClass('filters-closed');
    }
    var demoDates = [
      {
        name: 'date-307',
        value: '2017-03-07',
        pretty: 'Tuesday 3/07'
      },
      {
        name: 'date-308',
        value: '2017-03-08',
        pretty: 'Wednesday 3/08'
      },
      {
        name: 'date-309',
        value: '2017-03-09',
        pretty: 'Thursday 3/09'
      },
      {
        name: 'date-310',
        value: '2017-03-10',
        pretty: 'Friday 3/10'
      },
      {
        name: 'date-311',
        value: '2017-03-11',
        pretty: 'Saturday 3/11'
      },
      {
        name: 'date-312',
        value: '2017-03-12',
        pretty: 'Sunday 3/12'
      },
      {
        name: 'date-313',
        value: '2017-03-13',
        pretty: 'Monday 3/13'
      },
      {
        name: 'date-314',
        value: '2017-03-14',
        pretty: 'Tuesday 3/14'
      },
      {
        name: 'date-315',
        value: '2017-03-15',
        pretty: 'Wednesday 3/15'
      },
      {
        name: 'date-316',
        value: '2017-03-16',
        pretty: 'Thursday 3/16'
      },
      {
        name: 'date-317',
        value: '2017-03-17',
        pretty: 'Friday 3/17'
      },
      {
        name: 'date-318',
        value: '2017-03-18',
        pretty: 'Saturday 3/18'
      },
      {
        name: 'date-319',
        value: '2017-03-19',
        pretty: 'Sunday 3/19'
      },
      {
        name: 'date-320',
        value: '2017-03-20',
        pretty: 'Monday 3/20'
      },
      {
        name: 'date-321',
        value: '2017-03-21',
        pretty: 'Tuesday 3/21'
      },
      {
        name: 'date-322',
        value: '2017-03-22',
        pretty: 'Wednesday 3/22'
      }
    ];
    var filterDefaults = function(type){
      var filters;
      switch (type) {
        case 'demo':
          filters = {
            search: '',
            food: false,
            drink: false,
            recharge: false,
            swag: false,
            music:false,
            today: 'all',
            badge: '-1',
            faves: 'all',
            rsvp: 'all',
            date: 'all',
            musicTags: []
          }
          break;
        default:
          filters = {
            search: '',
            food: false,
            drink: false,
            recharge: false,
            swag: false,
            music:false,
            today: 'all',
            badge: '-1',
            faves: 'all',
            rsvp: 'all',
            date: 'all',
            musicTags: []
          }
      }
      return filters;
    }
    var demoGenres = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
    return {
      toggleFilterGroup: toggleFilterGroup,
      demoDates: demoDates,
      filterDefaults: filterDefaults,
      demoGenres: demoGenres
    }
  }])

})();
