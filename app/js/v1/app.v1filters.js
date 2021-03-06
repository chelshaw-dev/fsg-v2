'use strict';

// Declare app level module which depends on views, and components
angular.module('fsgFilters', [])

.filter('foodFilter', function() {
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
.filter('drinkFilter', function() {
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
.filter('swagFilter', function() {
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
.filter('rechargeFilter', function() {
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
.filter('musicFilter', function() {
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
.filter('musicTagFilter', function(){
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
.filter('dateFilter2016', function(){
  return function(input, date){
    if(date === 'all'){
      return input;
    } else if (date == 'now'){
      var out = [];

      /* Testing 2016 */
      var now = new Date('Mon Mar 17 2016 12:07:21 GMT-0600 (CST)'); // testing 2016
      var nowKey = '0'+(now.getMonth()+1) + (now.getDate()) + (now.getFullYear()); // testing 2016
      angular.forEach(input, function (item) {
        if(item.days[nowKey]){
          if(item.days[nowKey].start_0 && item.days[nowKey].start_0 !== 'TBD'){
            var dayStart = new Date(item.days[nowKey].start_0);
            var dayEnd = new Date(item.days[nowKey].end_0);
            var nowTime = now.getTime();
            if(dayStart === 'AD'){
              out.push(item);
            } else if(dayStart.getTime() <= nowTime && nowTime < dayEnd.getTime()){
              out.push(item);
            }
          }
        }
      });

      /* Production 2017
      var now = new Date();
      var nowKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-'+ (now.getDate());
      angular.forEach(input, function (item) {
        if(item.days[nowKey]){
          if(item.days[nowKey].start && item.days[nowKey].start !== 'TBD'){
            var dayStart = new Date(item.days[nowKey].start);
            var dayEnd = new Date(item.days[nowKey].end);
            var nowTime = now.getTime();
            if(dayStart === 'AD'){
              out.push(item);
            } else if(dayStart <= nowTime && nowTime < dayEnd){
              out.push(item);
            }
          }
        }
      });
      */

      /***** ALL *****/
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
.filter('dateFilter', function(){
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
.filter('credentialFilter', function() {
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
.filter('idFilter', function() {
  return function(input, eid) {
    var out = [];
    if(!eid){
      return input;
    } else {
      angular.forEach(input, function(item) {
	      if (item.eid == eid) {
	        out.push(item);
	      }
	    });
    }
    return out;
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
.filter('onMap', function(){
  return function(input, bounds) {
    var out = [];
    if(bounds == undefined){
      return input;
    } else {
      var north = bounds.f.b,
          south = bounds.f.f,
          east = bounds.b.f,
          west = bounds.b.b;
      angular.forEach(input, function(item) {
        if(item.locationCoord){
          var lat = item.locationCoord.lat || false;
          var lng = item.locationCoord.lng || false;
          if(lat < north && lat > south && lng > west && lng < east){
            out.push(item);
          }
        }
      });
    }
    return out;
  }
})
.filter('startFrom', function() {
    return function(input, start) {
      if(input){
        return input.slice(start);
      } else {
        return input;
      }
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
.filter('demoFavesFilter', ['$rootScope',function($rootScope) {
  return function(input, val, favesArray) {
    var userFaves = favesArray || [];
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
.filter('demoRSVPFilter', ['$rootScope',function($rootScope) {
  return function(input, val, rsvpArray) {
    var userRSVP = rsvpArray || [];
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
.filter('userAccountsFilter', function() {
  return function(input,type) {
    var out = [];
    if(type === 'all'){
      out = input;
    } else if (type === 'active'){
      angular.forEach(input, function(user) {
        if (/^[a-zA-Z0-9]/.test(user.paid)) {
          out.push(user);
        }
      });
    } else if (type === 'paid'){
      angular.forEach(input, function(user) {
        if (user.stripeToken) {
          out.push(user);
        }
      });
    } else if (type === 'free'){
      angular.forEach(input, function(user) {
        if (user.paid && !user.stripeToken) {
          out.push(user);
        }
      });
    } else if (type === 'unpaid'){
      angular.forEach(input, function(user) {
        if (!user.paid) {
          out.push(user);
        }
      });
    }
    return out;
  }
})
