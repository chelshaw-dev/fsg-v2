(function(){
  'use strict';

  var demo = angular.module('app.demo', ['app.cards','demo.data','data.fetch']);

  demo.controller('demoCardController', ['$scope','formattedData','$log','$compile', function($scope,formattedData,$log,$compile){
    $log.debug('demo controller');
    var $ctrl = this;
    $scope.bootStatus = false;

    $scope.testFn = function(id){
      $log.debug('eid' + id);
    };
    // Filters
    $scope.showFilterMenu = false;
    $scope.filter = {};
    $scope.sortEventsBy = '';
    $scope.filterReset = function(){
      $scope.filter = {
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
    $scope.filterReset();

    /* OLD FIND COL/ROW
    $scope.findRow = function(num){
      var numPerRow = windowService >= 768 ? 3 : 1;
      return (Math.floor(num/numPerRow))+1;
    }
    $scope.findCol = function(num){
      var numPerRow = windowService >= 768 ? 3 : 1;
      return (num%numPerRow)+1;
    }
    */
    $scope.findRow = function(index){
      var numPerRow = 3
      return (Math.floor(index/numPerRow))+1;
    }
    $scope.findCol = function(index){
      var numPerRow = 3
      return (index%numPerRow)+1;
    }

    formattedData.getData().then(function(data){
      $log.debug('done getting data');
      $scope.events = data;
      $scope.bootStatus = true;
    });

    $scope.toggleFilter = function(evt,className){
      $log.warn('TO-DO: FILTER TOGGLE');
    }
    $scope.toggleFilter = function(evt){
      var _this = evt.currentTarget || evt.srcElement;
      var clickedElement = angular.element(_this);
      var group = clickedElement.parent();
      $log.debug('group',group);
      group.toggleClass('filters-closed');
    }

    $scope.demoDates =
    [
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

    // Popout Functions
    $scope.destroyPopout = function(){
      var oldPopout = document.getElementById('pop-down');
      if(oldPopout){
        oldPopout.style.display = 'none';
      }
    }
    // Get data for event selected and open popout
    var updatePopout = function(info,row,col){
      //var days = info.days;
      //var selected = getFirstKey(days);
      var numPerRow = 3; // windowService >= 768 ? 3 : 1;
      var arrowClass = 'arrow__'+col+'-'+numPerRow;

      $scope.activeCard = {
        eventInfo: info,
        eid: info.eid,
        title: info.title,
        //days: days,
        //daySelected: selected,
        col: col,
        row: row,
        arrow: arrowClass,
        //data: data
      };
    }

    $ctrl.firstCompile = true;
    $ctrl.popout;

    // Open Popout
    $scope.expandCard = function(row,col,info){
      $log.debug('expanding');
      $log.debug(row,col);

      var eventId = info.eid;
      $log.debug(eventId);
      // Destroy all other popout instances
      $scope.destroyPopout();

      if($scope.activeCard && $scope.activeCard.eid === eventId){
        $scope.activeCard = {};
      } else {
        // Update info for popout
        updatePopout(info,row,col);

        var cardParent = document.getElementById('eid-'+eventId);
        // get row/col data from parent
        var activeRow = cardParent.dataset.row;
        //var activeCol = cardParent.dataset.col;
        // Identify reference node to add element after
        var nodes = document.querySelectorAll("[data-row='"+activeRow+"']");
        // lastChild not working: workaround
        var referenceNode = nodes[nodes.length-1];

        // Add new element
        if($ctrl.firstCompile === true){
          $ctrl.popout = $compile('<card-popout eid="'+eventId+'" arrow="'+$scope.activeCard.arrowClass+'" class="clearfix"></card-popout>')($scope)
          angular.element(referenceNode).after($ctrl.popout);
          $ctrl.firstCompile = false;
        } else {
          angular.element(referenceNode).after($ctrl.popout);
          var popout = document.getElementById('pop-down');
          popout.style.display = 'block';
        }
      }
    }

  }]);

})();
