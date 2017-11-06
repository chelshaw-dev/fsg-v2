(function(){
  'use strict';

  var filters = angular.module('demo.filters', []);
  filters.filter('food', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.food == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  });
  filters.filter('drinks', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.drink == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  });
  filters.filter('swag', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.swag == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  });
  filters.filter('recharge', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.recharge == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  });
  filters.filter('music', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
        angular.forEach(input, function(item) {
          if(item.music === true){
            out.push(item);
          } else if (typeof item.music == 'object') {
            out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  });
  filters.filter('genres', function() {
    return function(input, tags) {
      console.log(input);
      var out = [];
      if(tags === []){
        return input;
      } else {
        return out;
      }
    };
  })
})();
/*
(function(){
  'use strict';

  var filters = Angular.module('demo.filters', [])

  .filter('food', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.food == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  })
  .filter('drinks', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.drink == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  })
  .filter('swag', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.swag == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  })
  .filter('recharge', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  	      if (item.recharge == true) {
  	        out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  })
  .filter('music', function() {
    return function(input, bool) {
      var out = [];
      if(bool == false){
      	return input
      } else {
  	    angular.forEach(input, function(item) {
          if(item.music === true){
            out.push(item);
          } else if (typeof item.music == 'object') {
            console.log('music object');
            console.log(item.music);
            out.push(item);
  	      }
  	    });
  	}
      return out;
    }
  })
  .filter('genres', function(){
    function compareTagArrays(evtTags,searchTags){
      var searchLength = searchTags.length;
      var tagsLength = evtTags.length;
      var match;
      for(var i = 0; i < tagsLength; i++){
        if(evtTags[i]){
          var tag = evtTags[i].toLowerCase().trim() || '';
          if (searchTags.indexOf(tag) > -1){
            return true;
          }
        }
      }
      return false;
    }

    return function(input, tagsArray){
      var out = [];
      if(tagsArray.length <= 0){
        return input;
      } else {
        angular.forEach(input, function(item) {
          if(item.music){
            if (compareTagArrays(item.music,tagsArray) === true) {
    	        out.push(item);
    	      }
          }
  	    });
      }
      return out;
    }
  })
  .filter('credentials', function() {
    return function(input, level) {
      var out = [];
      if(level >= 0){
  			angular.forEach(input, function(item) {
  	      if (item.credentialLevel == level) {
  	        out.push(item);
  	      }
  	    });
      } else {
  	    return input;
  	}
      return out;
    }
  })
  .filter('date', function(){
    Date.prototype.addHours = function(h) {
     this.setTime(this.getTime() + (h*60*60*1000));
     return this;
    }
    return function(input, date){
      if(date === 'all'){
        return input;
      } else if (date == 'now'){
        var out = [];
        var nowKey, now = new Date();
        if(now.getDate() < 10){
          nowKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-0'+ (now.getDate());
        } else {
          nowKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-'+ (now.getDate());
        }
        angular.forEach(input, function (item) {
          if(item.days[nowKey]){
            if(item.days[nowKey].start && item.days[nowKey].start !== 'TBD'){
              if(item.days[nowKey].end && item.days[nowKey].end === 'AD'){
                out.push(item);
                return true;
              }
              var nowTime = now.getTime();
              var dayStart = new Date(item.days[nowKey].start);
              var dayEnd;
              if (item.days[nowKey].end && item.days[nowKey].end !== 'TBD' && item.days[nowKey].end !== '?' ){
                dayEnd = new Date(item.days[nowKey].end);
              } else {
                dayEnd = angular.copy(dayStart);
                dayEnd = dayEnd.addHours(3);
              }
              if(dayStart <= nowTime && nowTime < dayEnd){
                out.push(item);
              }
            }
          }
        });
        return out;
      } else {
        var out = [];
        angular.forEach(input, function(item){
          if(item.days[date]){
            out.push(item);
          }
        });
        return out;
      }
    }
  })
  .filter('searchAll', function() {
    return function(input, search) {
      var out = [];
      var findBands = function(days){
        var bandArray = '';
        angular.forEach(days, function(day,id) {
          if(day.music){
            for(var a = 0; a < day.music.length; a++){
              bandArray += (day.music[a].artist.toUpperCase() + ' ');
            }
          }
        });
        return bandArray;
      }
      var findDescription = function(days){
        var keywords = '';
        angular.forEach(days, function(day,id) {
          if(day.description){
            keywords += day.description.toUpperCase();
          }
        });
        return keywords;
      }
      if(!search){
        console.log('no search!');
      	return input
      } else {
  	    angular.forEach(input, function(item) {
  				// Identify each of the datapoints to search, with backup string
  				var title = (item.title || '').toUpperCase();
  	    	var location = (item.locationName || '').toUpperCase();
  				var description = findDescription(item.days);
          var bands = findBands(item.days);
          var eid = item.eid;
          var free = (item.freeNotes || '').toUpperCase();

  				// find location of search term in the data selected
  	    	var t = title.indexOf(search.toUpperCase());
  				var l = location.indexOf(search.toUpperCase());
  				var d = description.indexOf(search.toUpperCase());
  				var b = bands.indexOf(search.toUpperCase());
          var f = free.indexOf(search.toUpperCase());


  	      if (l >= 0 || t >= 0 || d >= 0 || b >= 0 || f >= 0 || eid === search) {
  	      	out.push(item);
  	    	}
  	    });
    	}
      return out;
    }
  })
  .filter('eventSortBy', function(){
    return function(input,sortBy){
      console.log(input);
      if (input && sortBy === 'title'){
        console.log('title sort');
        input.sort(function(a,b){
          var val = a.title < b.title ? -1 : 1;
          return val;
        });
      } else if (input && sortBy === 'lastCreated'){
        console.log('created sort');
        input.sort(function(a,b){
          var day1 = new Date(a.createdOn);
          var day2 = new Date(b.createdOn);
          var val = day1 < day2 ? -1 : 1;
          return val;
        });
      }
      return input;
    }
  })
  /* TO-DO
  .filter('favesFilter', ['$rootScope',function($rootScope) {
    var userInfo;
    $rootScope.$watch('currentUser', function(newVal, oldVal){
      if(newVal){
        userInfo = newVal;
      }
    });
    return function(input, val) {
      var userFaves;
      if(userInfo && userInfo.info && userInfo.info.favorites) {
        userFaves = userInfo.info.favorites
      } else {
        userFaves = [];
      }
      var out = [];
      if(val === 'all'){
      	return input
      } else {
        angular.forEach(input, function(item) {
  	      if (val === 'yes' && userFaves.indexOf(item.eid) >= 0) {
  	        out.push(item);
  	      } else if (val === 'no' && userFaves.indexOf(item.eid) < 0){
            out.push(item);
          }
  	    });
  	  }
      return out;
    }
  }])
  .filter('RSVPFilter', ['$rootScope',function($rootScope) {
    var userInfo;
    $rootScope.$watch('currentUser', function(newVal, oldVal){
      if(newVal){
        userInfo = newVal;
      }
    });
    return function(input, val) {
      var userRSVP;
      if(userInfo && userInfo.info && userInfo.info.rsvp) {
        userRSVP = userInfo.info.rsvp;
      } else {
        userRSVP = [];
      }
      var out = [];
      if(val === 'all'){
      	return input
      } else if(val === 'yes') {
        angular.forEach(input, function(item) {
  	      if (userRSVP.indexOf(item.eid) >= 0) {
  	        out.push(item);
  	      }
  	    });
  	  } else if(val === 'no') {
        angular.forEach(input, function(item) {
  	      if (userRSVP.indexOf(item.eid) < 0) {
  	        out.push(item);
  	      }
  	    });
      }
      return out;
    }
  }])
  *
})();
*/
