'use strict';

// Declare app level module which depends on views, and components
angular.module('fsgServices', [])

.service('skrollrService', ['$document', '$q', '$rootScope', '$window',
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
    scriptTag.src = 'bower_components/skrollr/dist/skrollr.min.js';

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
])

.service('eventsService', ['eventsFactory','$q','checkUser','$rootScope', function(eventsFactory, $q,checkUser,$rootScope) {
  // Shiny new service for processing events data
  var _this = this;
  var cached = $rootScope.cachedEvents;

  function getEventsArray(){
    var deferred = $q.defer();
    if(typeof $rootScope.cachedEvents == 'object'){
      deferred.resolve(cached);
    } else {
      checkUser.userData()
        .then(function(userCheck){
          if(!userCheck){
            deferred.reject('Must be logged in to view data');
          } else {
            eventsFactory.getEvents()
              .then(function(data){
                _this.allEvents = [];
                angular.forEach(data, function(value, key){
                  var newEvent = {'eid': key};
                  angular.forEach(value, function(val,k){
                    newEvent[k] = val;
                  })
                  _this.allEvents.push(newEvent);
                }, function(error){
                  console.error(error);
                });
                _this.allEvents.sort(function(a,b){
                  var day1,day2;
                  angular.forEach(a.days,function(info,day){
                    if(undefined === day1){
                      day1 = day;
                    }
                  });
                  angular.forEach(b.days,function(info,day){
                    if(undefined === day2){
                      day2 = day;
                    }
                  });
                  var val = day1 < day2 ? -1 : 1;
                  return val;
                });
                $rootScope.cachedEvents = _this.allEvents;
                deferred.resolve(_this.allEvents);
              }, function(error){
                console.error(error);
                deferred.reject('Error getting events! Try again later.');
              })
              /* eventsFactory done */
          }
        }, function(error){
          console.error(error);
          deferred.reject(error);
        });
    }
    return deferred.promise;
  }

  function get2016EventsArray(){
    var deferred = $q.defer();
    if(typeof $rootScope.cachedEvents == 'object'){
      deferred.resolve(cached);
    } else {
      checkUser.userData()
        .then(function(userCheck){
          if(!userCheck){
            deferred.reject('Must be logged in to view data');
          } else {
            eventsFactory.get2016Events()
              .then(function(data){
                _this.allEvents = [];
                angular.forEach(data, function(value, key){
                  var newEvent = {'eid': key};
                  angular.forEach(value, function(val,k){
                    newEvent[k] = val;
                  })
                  _this.allEvents.push(newEvent);
                }, function(error){
                  console.error(error);
                });
                _this.allEvents.sort(function(a,b){
                  var day1,day2;
                  angular.forEach(a.days,function(info,day){
                    if(undefined === day1){
                      day1 = day;
                    }
                  });
                  angular.forEach(b.days,function(info,day){
                    if(undefined === day2){
                      day2 = day;
                    }
                  });
                  if(day1 === day2){
                    var val = a.title < b.title ? -1 : 1;
                  } else {
                    var val = day1 < day2 ? -1 : 1;
                  }
                  return val;
                });
                $rootScope.cachedEvents = _this.allEvents;
                deferred.resolve(_this.allEvents);
              }, function(error){
                console.error(error);
                deferred.reject('Error getting events! Try again later.');
              })
              /* eventsFactory done */
          }
        }, function(error){
          console.error(error);
          deferred.reject(error);
        });
    }
    return deferred.promise;
  }

  return {
    getEventsArray: getEventsArray,
    get2016EventsArray: get2016EventsArray
  }
}])

.service('checkUser', ['$q','$rootScope','$timeout', function($q, $rootScope,$timeout){
  var activeUser = $rootScope.currentUser;

  function userData(){
    var deferred = $q.defer();
    if(activeUser){
      deferred.resolve(activeUser);
    } else {
      $timeout(function(){
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            deferred.resolve(user);
          } else {
            deferred.reject('Access denied');
          }
        });
      },500)
    }
    return deferred.promise;
  }

  return {
    userData: userData
  }
}])

.factory('eventsFactory', ['checkUser', '$q', function(checkUser, $q) {
  var cachedData,
      cachedDemoData,
      cachedEvents; //here we hold the data after the first api call
      // Doesn't look like cache is working for factory or services -- save as $rootScope item?

  function getEvents(){ // Function used in eventsService
    var deferred = $q.defer();
    if(cachedEvents){
      deferred.resolve(cachedEvents);
    } else {
      var events;
        var ref = firebase.database().ref('2017/events/');
        ref.once('value').then(function(snapshot) {
          events = snapshot.val();
          cachedEvents = events;
          deferred.resolve(events);
        });
    }
    return deferred.promise;
  }

  function getDemoEvents(){ // Function used in demoService
    var deferred = $q.defer();
    var events;
    var ref = firebase.database().ref('demo/events/');
    ref.once('value').then(function(snapshot) {
      events = snapshot.val();
      deferred.resolve(events);
    }).catch(function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function get2016Events(){ // Function used in eventsService
    var deferred = $q.defer();
    var ref = firebase.database().ref('2016/events/');
    ref.once('value').then(function(snapshot) {
      events = snapshot.val();
      deferred.resolve(events);
    }).catch(function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function getData(callback) {
    if(cachedData) {
      callback(cachedData);
    } else {
      var ref = firebase.database().ref('2017/events/');
      ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        cachedData = data;
        callback(data)
      });
    }
  }

  function getDemoData(callback) {
    if(cachedDemoData) {
      callback(cachedDemoData);
    } else {
      var ref = firebase.database().ref('2016/events/');
      ref.once('value').then(function(snapshot) {
        var data = snapshot.val();
        cachedDemoData = data;
        callback(data)
      });
    }
  }

  function createEvent(eventInfo,year) {
    // Get a key for a new Event.
    var newEventKey = firebase.database().ref().child(year + '/events').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates[year + '/events/' + newEventKey] = eventInfo;
    return firebase.database().ref().update(updates);
  }

  function rewriteEvent(eid,eventInfo) {
    var defer = $q.defer();
    var updates = {};
    var jsonData = JSON.parse(angular.toJson(eventInfo));
    updates['2017/events/' + eid] = jsonData;
    console.log('writing event');
    firebase.database().ref().update(updates).then(function(result){
      console.log('success');
      defer.resolve('Successfully updated!');
    }).catch(function(err){
      console.error(err);
      defer.reject('Something went wrong while trying to update.');
    });
    return defer.promise;
  }

  function updateEvent(eid,eventUpdates) {
    var defer = $q.defer();
    // Get a key for a new Event.
    // var ref = firebase.database().ref().child(year + '2017/events').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['2017/events/' + eid] = eventUpdates;
    firebase.database().ref().update(updates).then(function(result){
      console.log('success');
      defer.resolve('Successfully updated!');
    }).catch(function(err){
      console.error(err);
      defer.reject('Something went wrong while trying to update.');
    });
    return defer.promise;
  }

  function createDemoEvent(eventInfo,year) {
   // Get a key for a new Event.
    var newEventKey = firebase.database().ref().child('demo/events').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['demo/events/' + newEventKey] = eventInfo;
    return firebase.database().ref().update(updates);
  }

  function getEvent(eid){ // Function used in eventsService
    var deferred = $q.defer();
    if(!eid){
      deferred.reject('No EID available');
    } else {
      var eventData;
        var ref = firebase.database().ref('2017/events/'+eid);
        ref.once('value').then(function(snapshot) {
          eventData = snapshot.val();
          eventData.eid = eid;

          deferred.resolve(eventData);
        }).catch(function(err){
          deferred.reject('Could not fetch data: '+err.message);
        });
    }
    return deferred.promise;
  }


  return {
    getData: getData,
    getDemoData: getDemoData,
    getEvents: getEvents,
    get2016Events: get2016Events,
    createEvent: createEvent,
    getDemoEvents: getDemoEvents,
    getEvent: getEvent,
    createDemoEvent: createDemoEvent,
    updateEvent: updateEvent,
    rewriteEvent: rewriteEvent
  }
}])

.factory('blogService', ['$q','$state',function($q,$state) {
  function getPosts(){
    var deferred = $q.defer();
    var ref = firebase.database().ref('blog/').orderByChild('content');
    ref.once('value').then(function(snapshot) {
      var posts = snapshot.val();
      var postsArray = [];
      angular.forEach(posts, function(value, key) {
        var thePost = {};
        angular.forEach(value, function(val,k){
          thePost[k] = val;
        })
        postsArray.push(thePost);
      });
      deferred.resolve(postsArray);
    });
    return deferred.promise;
  }

  var singlePost = function(id){
    var deferred = $q.defer();
    var single;
    getPosts().then(function(blogs){
      angular.forEach(blogs, function(post,k){
        if(post.slug === id){
          single = post;
          deferred.resolve(single);
        }
      });
      if(!single){
        deferred.resolve('No Match Found');
      }
    });
    return deferred.promise;
  }
  function writeNewPost(newPost) {
    var newPostKey = firebase.database().ref().child('blog').push().key;
    return firebase.database().ref('blog/'+newPostKey).set(newPost);
  }

  var newPost = function(data){
    var deferred = $q.defer();
    if(typeof data !== 'object'){
      deferred.reject('Post is invalid');
    } else {
      var postData = {
        //author: newPost.username,
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image,
        video: data.video,
        timestamp: new Date().toISOString()
      };
      var result = writeNewPost(postData);
      deferred.resolve(result);
    }
    return deferred.promise;
  }
  return {
    getPosts: getPosts,
    singlePost: singlePost,
    newPost: newPost
  }
}])

.factory('windowService', ['$window',function($window){
  return $window.innerWidth;
}])

.factory('userService', ['$state','$rootScope','$q', function($state,$rootScope,$q){
  function getUsers(){
    var deferred = $q.defer();
    var ref = firebase.database().ref('users/');
    ref.once('value').then(function(snapshot) {
      var posts = snapshot.val();
      deferred.resolve(posts);
    });
    return deferred.promise;
  }
  var createUser = function(newUID,newUser){
    var userInfo;
    if(typeof newUser !== 'object'){
      return false;
    } else if (newUser.providerData && newUser.providerData[0].providerId) {
      newUser.providerData.forEach(function (profile) {
        userInfo = {
          name: profile.displayName || '',
          email: profile.email || '',
          provider: profile.providerId,
          paid:false
        };
      });
    } else {
      userInfo = {
        name: newUser.displayName,
        email: newUser.email || '',
        provider: 'email',
        paid:false
      }
    }
    firebase.database().ref('users/' + newUID).set(userInfo);
    //console.log('userService.createUser has run');
    return newUser;
  }

  var updateUser = function(uid,values){
    console.log('userService.updateUser not yet working');
  }

  var getUser = function(id){
    var deferred = $q.defer();
    if(typeof id == 'string'){
      var ref = firebase.database().ref('users/' + id);
      ref.once('value').then(function(snapshot) {
        deferred.resolve(snapshot.val());
      }).catch(function(err){
        deferred.reject(err);
      });
    } else {
      deferred.reject('Error: ID is not a string');
    }
    return deferred.promise;
  };

  var isAdmin = function(uid){
    var deferred = $q.defer();
    var adminRef = firebase.database().ref('admin/');
    adminRef.once('value').then(function(snapshot) {
      var admins = snapshot.val();
      if(admins[uid]){
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
    }).catch(function(err){
      deferred.reject(false);
    });
    return deferred.promise;
  }

  var userExists = function(uid){
    var deferred = $q.defer();
    var user = firebase.auth().currentUser;
    var usersRef = firebase.database().ref('users/');
    usersRef.once('value').then(function(snapshot) {
      var users = snapshot.val();
      if(users[uid]){
        var userExists = users[uid];
        var existence = {
          name: userExists.name,
          paid: userExists.paid
        }
        deferred.resolve(existence);
      } else {
        deferred.reject(uid);
      }
    });
    return deferred.promise;
  }
  function updateFavorites(uid,faves){
    firebase.database().ref('users/'+uid+'/favorites').set(faves).then(function(result){
      return(result);
    });
  }
  function getFavorites(uid){
    if(typeof uid == 'string'){
      var favesArray;
      // Get current array of favorites
      getUser(uid).then(function(result){
        if(result.favorites){
          favesArray = result.favorites;
        } else {
          favesArray = [];
        }
      })
    } else {
      return false;
    }
    return favesArray;
  }
  function addFavorite(uid,eid){
    var deferred = $q.defer();
    var ready = false;
    if(typeof uid == 'string' && typeof eid == 'string'){
      var favesArray = [];
      // Get current array of favorites
      getUser(uid).then(function(result){
        if(result.favorites){
          favesArray = result.favorites;
        }
        if(favesArray.indexOf(eid) >= 0){
          var index = favesArray.indexOf(eid);
          favesArray.splice(index, 1);
        } else {
          favesArray.push(eid);
        }
        ready = true;
        updateFavorites(uid,favesArray);
        deferred.resolve('success?');
      }).catch(function(error){
        favesArray = false;
        ready = true;
        deferred.reject(error);
      });
    } else {
      deferred.reject('ID is not a string');
    }
    if(ready){
      return deferred.promise;
    }
  }

  function updateUserRSVP(uid,rsvps){
    firebase.database().ref('users/'+uid+'/rsvp').set(rsvps).then(function(result){
      return result;
    }).catch(function(err){
      return err;
    });
  }
  function updateRSVP(uid,eid){
    var deferred = $q.defer();
    if(typeof uid == 'string' && typeof eid == 'string'){
      var rsvpArray = [];
      getUser(uid).then(function(result){
        if(result.rsvp){ rsvpArray = result.rsvp; }
        if(rsvpArray.indexOf(eid) >= 0){
          var index = rsvpArray.indexOf(eid);
          rsvpArray.splice(index, 1);
        } else {
          rsvpArray.push(eid);
        }
        deferred.resolve(updateUserRSVP(uid,rsvpArray));
      }).catch(function(error){
        rsvpArray = false;
        deferred.reject(error);
      });
    } else {
      deferred.reject('ID is not a string');
    }
    return deferred.promise;
  }
  function getCurrentUser(){
    var deferred = $q.defer();
    firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         deferred.resolve(user);
       } else {
         deferred.reject('Not logged in');
       }
     });
    return deferred.promise;
  }

  return {
    createUser: createUser, // Create new user
    updateUser: updateUser, // Update existing user with data
    getUsers: getUsers, // Get info about all users (admin only)
    isAdmin: isAdmin, // Check if current user is in admin db
    userExists: userExists, // Check if registered user is in our User db
    getUser: getUser, // Get single user (testing)
    addFavorite: addFavorite,
    updateRSVP: updateRSVP,
    getCurrentUser: getCurrentUser
  }
}])

.factory('promoFactory', ['$q', function($q){
  function codeUsed(code){
    var deferred = $q.defer();
    var promoRef = firebase.database().ref('2017/pricing/promoCodes' + code + '/useLimit');
    promoRef.once('value').then(function(snapshot) {
      deferred.resolve(true);
    }).catch(function(err){
      deferred.reject();
    });
    return deferred.promise;
  }

  function getDiscount(code){
    var deferred = $q.defer();

    if(typeof code !== 'string'){
      deferred.reject('Discount code is not a word!');
    } else {
      code = code.toUpperCase();
      var ref = firebase.database().ref('2017/pricing');
      ref.once('value').then(function(result) {
        var pricing = result.val();
        var activePromo = pricing.promoCodes[code] || false;
        if(activePromo){
          var now = new Date();
          var promoDate = new Date(activePromo.expiration);
          var limit = activePromo.useLimit;
          if(limit <= 0){
            deferred.reject('Sorry friend, looks like that code has already been used.');
          } else if (now > promoDate){
            deferred.reject('Dang! Looks like that promo code expired already');
          } else {
            // Subtract 1 from this code's useLimit
            //var newLimit = limit - 1;
            //ref.child('promoCodes/'+ code + '/useLimit').set(newLimit);
            var userPromo = {
              price: activePromo.discounted_price,
              message: activePromo.successMessage
            }
            deferred.resolve(userPromo);
          }
        } else {
          deferred.reject('That\'s not a valid promo code');
        }
      });
    }
    return deferred.promise;
  }

  function applyDiscount(code){
    code = code.toUpperCase();
    var ref = firebase.database().ref('2017/pricing/promoCodes');
    ref.once('value').then(function(result) {
      var pricing = result.val();
      var activePromo = pricing[code] || false;
      if(activePromo){
        var limit = activePromo.useLimit;
        // Subtract 1 from this code's useLimit
        var newLimit = limit - 1;
        ref.child(code + '/useLimit').set(newLimit);
        var userPromo = {
          price: activePromo.discounted_price,
          message: activePromo.successMessage
        }
        return newLimit;
      } else {
        return false;
      }
    }).catch(function(error){
      console.error(error);
      return error;
    });
  }

  function postReferral(referInfo){
    var deferred = $q.defer();

    var referredBy = referInfo.referredBy || false,
        paid = referInfo.paid || false,
        uid = referInfo.uid || false;

    if(referredBy){
      var ref = firebase.database().ref('2017/referrals');
      ref.once('value').then(function(result) {
        var referrals = result.val();
        var activeRefer = referrals[referredBy] || false;
        if(activeRefer){
          var returnObj = angular.copy(activeRefer);
          returnObj.count++;
          returnObj.users[uid] = paid;
          ref.child(referredBy).set(returnObj);
          deferred.resolve(returnObj);
        } else {
          deferred.reject('Referral code doesn\'t exist: '+referredBy);
        }
      });
    } else {
      deferred.reject(false);
    }
    return deferred.promise;
  }

  return {
    getDiscount: getDiscount,
    applyDiscount: applyDiscount,
    postReferral: postReferral
  }
}])

.factory('geolocationSvc', ['$q', '$window', function ($q, $window) {
  'use strict';
  function getCurrentPosition() {
      var deferred = $q.defer();
      if (!$window.navigator.geolocation) {
          deferred.reject('Geolocation not supported.');
      } else {
          $window.navigator.geolocation.getCurrentPosition(
              function (position) {
                  deferred.resolve(position);
              },
              function (err) {
                  deferred.reject(err);
              });
      }
      return deferred.promise;
  }
  return {
      getCurrentPosition: getCurrentPosition
  };
}])

.service('demoService', ['eventsFactory','$q','checkUser', function(eventsFactory, $q,checkUser) {
  // Shiny new service for processing events data
  var _this = this;

  function getEventsArray(){
    var deferred = $q.defer();
    eventsFactory.getDemoEvents()
      .then(function(data){
        _this.allEvents = [];
        angular.forEach(data, function(value, key){
          var newEvent = {'eid': key};
          angular.forEach(value, function(val,k){
            newEvent[k] = val;
          })
          _this.allEvents.push(newEvent);
        }, function(error){
          console.error(error);
        });
        _this.allEvents.sort(function(a,b){
          var day1,day2;
          angular.forEach(a.days,function(info,day){
            if(undefined === day1){
              day1 = day;
            }
          });
          angular.forEach(b.days,function(info,day){
            if(undefined === day2){
              day2 = day;
            }
          });
          var val = day1 < day2 ? -1 : 1;
          return val;
        });
        deferred.resolve(_this.allEvents);
      }, function(error){
        console.error(error);
        deferred.reject('Error getting events! Try again later.');
      });
    return deferred.promise;
  }

  return {
    getEventsArray: getEventsArray
  }
}])

.factory('adminService', ['$q', function($q){
  'use strict';
  function getAllUsers() {
      var deferred = $q.defer();
      var ref = firebase.database().ref('users');
      var allUsers = [];
      ref.once('value').then(function(snapshot) {
        var users = snapshot.val();
        angular.forEach(users, function(data, eid){
          var theUser = {'eid': eid};
          angular.forEach(data, function(val,k){
            theUser[k] = val;
          })
          allUsers.push(theUser);
        }, function(error){
          deferred.reject(error);
        });
        deferred.resolve(allUsers);
      });
      return deferred.promise;
  }
  return {
      getAllUsers: getAllUsers
  };
}])
