(function(){
  'use strict';

  var demo = angular.module('app.demo', [
    'app.cards',
    //'demo.data',
    'data.fetch',
    'core.helper',
    'demo.filters',
    'demo.directives'
  ]);

  demo.controller('paginationController', ['$location','$anchorScroll', function($location,$anchorScroll){
    console.log('pagination controller');
    // Pagination
    $scope.setCurrentPage = function(nextPage) {
      $scope.currentPage = nextPage;
      //$location.hash('top');
      //$anchorScroll();
    }
  }])

  demo.controller('demoPageController', ['$scope','formattedData','$window','$log','filterService', function($scope,formattedData,$window,$log,filterService){
    var $ctrl = this;
    $scope.bootStatus = false;
    // DATA
    formattedData.getData().then(function(data){
      $scope.events = data;
      $scope.bootStatus = true;
    });
    // PAGINATION
    $scope.currentPage = 0;
    $scope.pageSize = 45;
    // FILTERS
    $scope.showFilterMenu = false;
    $scope.sortEventsBy = '';
    $scope.filterReset = function(){
      $scope.filter = filterService.filterDefaults('demo');
    }
    $scope.filterReset();
    console.log($scope.filter);
    $scope.toggleFilter = filterService.toggleFilterGroup;
    $scope.demoDates = filterService.demoDates;
    $scope.genres = filterService.demoGenres;
    // Grid
    var numPerRow = $window.innerWidth >= 768 ? 3 : 1;
    $scope.findRow = function(index){
      return (Math.floor(index/numPerRow))+1;
    }
    $scope.findCol = function(index){
      return (index%numPerRow)+1;
    }

    if($window.innerWidth >= 992){
      angular.element($window).bind("scroll", function() {
        var sidebar = document.getElementById('filter-sidebar--inner');
        if (this.pageYOffset >= 390) {
          angular.element(sidebar).addClass('fixed');
        } else {
          angular.element(sidebar).removeClass('fixed');
        }
      });
    }
  }]);

  demo.controller('demoCardsController', ['$scope','$log','$compile','$location','$anchorScroll','$window', function($scope,$log,$compile,$location,$anchorScroll,$window){
    var $ctrl = this;
    // Popout Functions
    $scope.destroyPopout = function(){
      var oldPopout = document.getElementById('pop-down');
      if(oldPopout){
        oldPopout.style.display = 'none';
        $scope.activeCard.eid = '';
      }
    }
    // Get data for event selected and open popout
    var updatePopout = function(info,row,col){
      var numPerRow = $window.innerWidth >= 768 ? 3 : 1;
      var arrowClass = 'arrow__'+col+'-'+numPerRow;

      $scope.activeCard = {
        info: info,
        eid: info.eid,
        title: info.title,
        description: info.description,
        coords: info.locationCoord,
        //days: days,
        //daySelected: selected,
        col: col,
        row: row,
        arrow: arrowClass
      };
    }

    $ctrl.firstCompile = true;
    $ctrl.popout;

    // Open Popout
    $scope.expandCard = function(row,col,info){
      var eventId = info.eid;
      if($scope.activeCard && $scope.activeCard.eid === eventId){
        $scope.destroyPopout();
      } else {
        $scope.destroyPopout();
        // Update info for popout
        updatePopout(info,row,col);

        var cardParent = document.getElementById('eid-'+eventId);
        // get row/col data from parent
        var activeRow = cardParent.dataset.row;
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
          $location.hash('pop-down');
          $anchorScroll();
        }
      }
    }
  }]);

})();
