var v1old = angular.module('testApp', [
  'ui.router',
  'ngTouch',
  'ui.bootstrap',
  'firebase',
  'fsgFilters',
  'fsgDirectives',
  'fsgServices',
  'ngMap',
  'ngSanitize',
  'ngAnimate',
  'angularTrix',
  'angular-stripe',
  'credit-cards',
  'google.places'
]);

v1old.config(['stripeProvider', function(stripeProvider){
  var sk = 'live_key';
  stripeProvider.setPublishableKey(sk);
}])

v1old.config(["$locationProvider", function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

v1old.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "views/home.html",
        controller: 'homeCtrl',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('login', {
        url: '/signin',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'lc',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('register', {
        url: '/register?taor',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl',
        controllerAs: 'rc',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('events', {
        url: "/events?data",
        templateUrl: "views/events.html?version1112",
        controller: 'eventsCtrl',
        controllerAs: "e",
        data: {
          requireLogin: true,
          requirePayment:true,
          requireAdmin:false
        }
      })
      .state('demoEvents', {
        url: "/demo/events",
        templateUrl: "views/demo-events.html",
        controller: 'demoCtrl',
        controllerAs: "e",
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'views/blog.html',
        controller: 'blogCtrl',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('blogPost', {
        url: '/blog/:postSlug',
        templateUrl: 'views/blog-post.html?version1110',
        controller: function($scope, $stateParams,blogService,$state,$sce) {
            var location = $stateParams.postSlug;
            $scope.post;

            blogService.singlePost(location).then(function(data){
              if(data == 'No Match Found'){
                  $scope.post = {
                    title: 'Well, this is awkward…',
                    notFound: true
                  }
              } else {
                  $scope.post = data;
              }
            });
            $scope.htmlSafe = function (data) {
              return $sce.trustAsHtml(data);
            }
            $scope.unescapeJson = function(snippet){
              if(snippet){
                snippet = snippet.replace(/<\s\//g, '</');
                snippet = snippet.replace(/\\"/g, '"');
              }
              return snippet
            }
        },
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('newPost',{
        url:'/new-blog',
        templateUrl: 'views/new-blog-post.html?version1108',
        controller: 'newBlogCtrl',
        data: {
          requireLogin:true,
          requirePayment:false,
          requireAdmin:true
        }
      })
      .state('404',{
        url: '/404',
        templateUrl: 'views/404.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('terms',{
        url: '/terms',
        templateUrl: 'views/terms.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('privacy',{
        url: '/privacy',
        templateUrl: 'views/privacy.html',
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('demoMap', {
        url: "/demo/map",
        templateUrl: "views/demo-map.html",
        controller: 'demoMapCtrl',
        controllerAs: "mc",
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin:false
        }
      })
      .state('map', {
        url: "/map?data",
        templateUrl: "views/map.html",
        controller: 'mapCtrl',
        controllerAs: "mc",
        data: {
          requireLogin: true,
          requirePayment:true,
          requireAdmin:false
        }
      })
      .state('map2016', {
        url: "/map2016?data",
        templateUrl: "views/map.html",
        controller: 'map2016Ctrl',
        controllerAs: "mc",
        data: {
          requireLogin: true,
          requirePayment:false,
          requireAdmin:true
        }
      })
      .state('account', {
        url: "/account?mode&oobCode&apiKey",
        templateUrl: "views/account.html",
        controller: "accountCtrl",
        data: {
          requireLogin: false,
          requirePayment:false,
          requireAdmin: false
        }
      })
      .state('newEvent', {
        url: "/create-event",
        templateUrl: "views/new-event.html",
        controller: "newEventCtrl",
        controllerAs: "fc",
        data: {
          requireLogin: true,
          requirePayment: false,
          requireAdmin: true
        }
      })
      .state('editEvent', {
        url: "/edit-event?eid",
        templateUrl: "views/edit-event.html",
        controller: "editEventCtrl",
        controllerAs: "fc",
        data: {
          requireLogin: true,
          requirePayment: false,
          requireAdmin: true
        }
      })
      .state('adminPanel', {
        url: "/admin/p3705",
        templateUrl: "views/admin.html",
        controller: "panelCtrl",
        controllerAs: "pc",
        data: {
          requireLogin: true,
          requirePayment: false,
          requireAdmin: true
        }
      })
      var config = { // store config keys as vars outside dir
        apiKey: "AIzaSyDp0tenVtXevo5vAjYQECgH7uJOtg8cuDE",
        authDomain: "free-shit-guide.firebaseapp.com",
        databaseURL: "https://free-shit-guide.firebaseio.com",
        storageBucket: "free-shit-guide.appspot.com",
      };
      firebase.initializeApp(config);
}]);

v1old.run(['$rootScope','$state','$location','userService','$q', function ($rootScope,$state,$location,userService,$q) {
  // Referrals
  var taor = $location.search().taor;
  if(undefined !== taor){
    $rootScope.taor = taor.toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');
  }

  var updateUserInfoOnScope = function(data){
    $rootScope.currentUser.info = data;
  }
  var getUserInfo = function(id){
    var ref = firebase.database().ref('users/' + id);
    ref.on('value', function(snapshot) {
      updateUserInfoOnScope(snapshot.val());
    });
  }
  var getAdminStatus = function(id){

  }
  var getCurrentUser = function(){
    userService.getCurrentUser().then(function(user){
      $rootScope.currentUser = user;
      userService.isAdmin(user.uid).then(function(result){
        $rootScope.currentUserIsAdmin = result;
      }).catch(function(result){
        $rootScope.currentUserIsAdmin = result;
      })
      getUserInfo(user.uid);
    }).catch(function(err){
      $rootScope.currentUser = false;
    });
  }
  getCurrentUser();

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    var requireAdmin = toState.data.requireAdmin;
    var requirePayment = toState.data.requirePayment;

    var goToPage = function(){
      var gaPushResult;
      if(requireAdmin && (!$rootScope.currentUser || !$rootScope.currentUserIsAdmin)){
        event.preventDefault();
        $state.go('home');
        $rootScope.page = 'home';
        //gaPushResult = ga('send', 'pageview', { page: 'require admin '+toState.name });
      } else if (requirePayment && !$rootScope.currentUser) {
        // require payment and no current user
        event.preventDefault();
        $state.go('login');
        $rootScope.page = 'login';
        //gaPushResult = ga('send', 'pageview', { page: 'require payment '+toState.name });
      } else if (requirePayment && $rootScope.currentUser && $rootScope.currentUser.info && !$rootScope.currentUser.info.paid && !$rootScope.currentUserIsAdmin) {
        event.preventDefault();
        $state.go('register');
        $rootScope.page = 'register';
        //gaPushResult = ga('send', 'pageview', { page: 'require payment '+toState.name });
      } else if (requireLogin && !$rootScope.currentUser){
        event.preventDefault();
        $state.go('login');
        $rootScope.page = 'login';
        //gaPushResult = ga('send', 'pageview', { page: 'require login '+toState.name });
      } else {
        $rootScope.page = toState.name;
        //gaPushResult = ga('send', 'pageview', { page: toState.name });
      }
    }

    if(!$rootScope.currentUser){
      userService.getCurrentUser().then(function(user){
        $rootScope.currentUser = user;
        userService.isAdmin(user.uid).then(function(result){
          $rootScope.currentUserIsAdmin = result;
          goToPage();
        }).catch(function(result){
          $rootScope.currentUserIsAdmin = result;
          goToPage();
        })
        getUserInfo(user.uid);
      }).catch(function(err){
        $rootScope.currentUser = false;
        goToPage();
      });
    } else {
      goToPage();
    }

  });

  $rootScope.$on('$stateChangeSuccess', function() {
   document.body.scrollTop = document.documentElement.scrollTop = 0;
  });

  // Watch for auth changes and update current user
  firebase.auth().onAuthStateChanged(function(user) {
    getCurrentUser();
  });

}]);

v1old.controller('accountCtrl', ['$scope', '$stateParams','$state', function($scope, $stateParams,$state) {
  var mode = $stateParams.mode;
  var actionCode = $stateParams.oobCode;
  var auth = firebase.auth();
  $scope.resetData = {}; // Password Reset data
  $scope.screen = mode || 'default';

  var updateEmailOnScope = function(emailAddr){
    var loc = emailAddr.indexOf('@');
    var last = emailAddr.length-1;
    var email1 = emailAddr.substr(0,loc);
    var email2 = emailAddr.substr(loc+1,last);
    $scope.$apply($scope.resetData.userEmail1 = email1);
    $scope.$apply($scope.resetData.userEmail2 = email2);
  }

  $scope.sendPasswordResetEmail = function(emailAddress){
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      $scope.$apply($scope.resetData.passwordResetEmailSent = true);
    }, function(error) {
      $scope.$apply($scope.resetData.error = true);
    });
  }

  $scope.doPasswordReset = function(p1,p2){
    // Save the new password.
    if(p1 === p2){
      auth.confirmPasswordReset(actionCode, p1).then(function(resp) {
        // Password reset has been confirmed and new password updated.
        $scope.$apply($scope.resetData.passwordUpdated = true);
      }).catch(function(error) {
        $scope.error = 'Something went wrong. Refresh the page and try again.';
      });
    } else {
      $scope.error = 'Those passwords don\'t match!';
    }
  }
  function handleResetPassword(auth, actionCode) {
    var accountEmail;
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
      var accountEmail = email;
      updateEmailOnScope(accountEmail);
    }).catch(function(error) {
      $scope.$apply($scope.resetData.codeExpired = true);
    });
  }

  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode);
      break;
    /* TO-DO: Add these later
    case 'recoverEmail':
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode);
      break;
    case 'verifyEmail':
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode);
      break;
    */
    default:
      // Error: invalid mode.
  }
}]);

v1old.controller('blogCtrl', ['$scope','blogService', function($scope,blogService){
  $scope.posts;
  $scope.postResult = false;
  $scope.newPost = {};

  blogService.getPosts().then(function(data) {
    $scope.posts = data;
    fbq('track', 'ViewContent', {
      content_type: 'blog'
    });
  });

  function escapeForJson(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }
  function sanitizeSlug(slug){
    slug = slug.trim();
    slug = slug.replace(/\s/g,'-');
    slug = slug.toLowerCase();
    return slug;
  }
  $scope.blogSnippet = function(text){
    var limitTo = 300;
    text = $scope.unescapeJson(text);
    if(typeof text !== 'string'){
      return false;
    } else if(text.length > limitTo){
      var shortened = text.substring(0, limitTo);
      var n = shortened.lastIndexOf(" ");
      shortened = shortened.substring(0, n+1);
      return shortened+'…';
    } else {
      return text;
    }

  }
  $scope.submitPost = function(post){
    var imageUrl, videoCode;
    if(post.image){ imageUrl = post.image; } else { imageUrl = 'no image'; }
    if(post.video){ videoCode = escapeForJson(post.video); } else { videoCode = 'no video'; }
    var newPost = {
      title: post.title,
      content: escapeForJson(post.content),
      slug: sanitizeSlug(post.slug), // trim and lowercase, replace odd characters with dashes
      image: imageUrl,
      video: videoCode
    }
    blogService.newPost(newPost)
      .then(function(success){
        $scope.newPost = {};
        $scope.postResult = 'Hooray! you can see your post at www.freeshitguide.com/blog/'+sanitizeSlug(post.slug);
      });
  }
}]);

v1old.controller('newBlogCtrl', ['$scope','blogService', function($scope,blogService){
  //$scope.posts;
  $scope.postResult = false;
  $scope.newPost = {};

  //blogService.getPosts().then(function(data) { $scope.posts = data; });

  function escapeForJson(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }
  function sanitizeSlug(slug){
    slug = slug.trim();
    slug = slug.replace(/\s/g,'-');
    slug = slug.toLowerCase();
    return slug;
  }
  $scope.blogSnippet = function(text){
    var limitTo = 300;
    text = $scope.unescapeJson(text);
    if(typeof text !== 'string'){
      return false;
    } else if(text.length > limitTo){
      var shortened = text.substring(0, limitTo);
      var n = shortened.lastIndexOf(" ");
      shortened = shortened.substring(0, n+1);
      return shortened+'…';
    } else {
      return text;
    }

  }
  $scope.submitPost = function(post){
    var imageUrl, videoCode;
    if(post.image){ imageUrl = post.image; } else { imageUrl = 'no image'; }
    if(post.video){ videoCode = escapeForJson(post.video); } else { videoCode = 'no video'; }
    var newPost = {
      title: post.title,
      content: escapeForJson(post.content),
      slug: sanitizeSlug(post.slug), // trim and lowercase, replace odd characters with dashes
      image: imageUrl,
      video: videoCode
    }
    blogService.newPost(newPost)
      .then(function(success){
        $scope.newPost = {};
        $scope.postResult = 'Hooray! you can see your post at www.freeshitguide.com/blog/'+sanitizeSlug(post.slug);
      });
  }
}]);

v1old.controller('newEventCtrl', ['$scope','$http','$q','eventsFactory','userService','$state', function($scope,$http,$q,eventsFactory,userService,$state){
  var fc = this;
  fc.reviewReady = false;
  $scope.eventType = '2017';

  userService.getCurrentUser().then(function(user){
    userService.isAdmin(user.uid).then(function(result){
      if(!result){
        $state.go('home');
      }
    }).catch(function(result){
      $state.go('home');
    })
  }).catch(function(err){
    $state.go('home');
  });

	function formInit(){
		$scope.newEvent = {
			title: '',
			eventDays: [{id:1,allday:false}],
			locationName: '',
			locationAddress: '',
			locationCoord: false,
			description: '',
      credentialLevel: '-1',
			food: false,
			drink: false,
			swag: false,
			recharge: false,
			music: false,
			bands: {},
			freeNotes: '',
			rsvpLink: '',
			age: '-1'
		};
	}
	formInit();
  var musicTagsList = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
  fc.badgeOptions = [
      {val: '0', name: 'Walk In'},
      {val: '10', name: 'RSVP'},
      {val: '20', name: 'Wristband/Badge Priority'},
      //{val: '30', name: 'Wristband/Badge Only'},
      {val: '40', name: 'Badge Only'},
      {val: '90', name: 'Other (special rules -- put in description)'},
      {val: '-1', name: 'Unknown Credentials Required'}
  ];
  fc.ageOptions = [
      {val: '-1', name: 'Unknown'},
      {val: '18', name: '18+'},
      {val: '21', name: '21+'},
      {val: '0', name: 'All Ages'},
  ];
  fc.sxswDates = [{
		val:'2017-03-07',
		day: 'Tue, 3/07',
	},{
		val:'2017-03-08',
		day: 'Wed, 3/08',
	},{
		val:'2017-03-09',
		day: 'Thu, 3/09',
	},{
		val:'2017-03-10',
		day: 'Fri, 3/10',
	},{
		val:'2017-03-11',
		day: 'Sat, 3/11',
	},{
		val:'2017-03-12',
		day: 'Sun, 3/12',
	},{
		val:'2017-03-13',
		day: 'Mon, 3/13',
	},{
		val:'2017-03-14',
		day: 'Tue, 3/14',
	},{
		val:'2017-03-15',
		day: 'Wed, 3/15',
	},{
		val:'2017-03-16',
		day: 'Thu, 3/16',
	},{
		val:'2017-03-17',
		day: 'Fri, 3/17',
	},{
		val:'2017-03-18',
		day: 'Sat, 3/18',
	},{
		val:'2017-03-19',
		day: 'Sun, 3/19',
	},{
		val:'2017-03-20',
		day: 'Mon, 3/20',
	},{
		val:'2017-03-21',
		day: 'Tue, 3/21',
	},{
		val:'2017-03-22',
		day: 'Wed, 3/22',
	}];
  // Google Autocomplete
  fc.getLocationInfo = function(mapItem){
    if(mapItem){
      var name = mapItem.name;
      var address = mapItem.formatted_address;
      var austin_loc = address.indexOf(" Austin, TX");
      address = address.substr(0,austin_loc-1);
      if(address == name){
        $scope.newEvent.locationName = '';
        $scope.newEvent.locationAddress = address;
      } else {
        $scope.newEvent.locationName = name;
        $scope.newEvent.locationAddress = address;
      }
      $scope.newEvent.locationCoord = mapItem.geometry.location;
    } else {
      return false;
    }
  }

  // Days functions
  $scope.addDay = function() {
    var daysLength = $scope.newEvent.eventDays.length;
	  var newItemNo = daysLength+1;
    var newDate = '';
    var previousDayInfo = $scope.newEvent.eventDays[daysLength-1];
    if(previousDayInfo.date){
      newDate = previousDayInfo.date.substring(8,10);
      newDate = parseInt(newDate) + 1;
    }
    var newDayShell = {
      id: newItemNo,
      date: '2017-03-'+newDate,
      allday: previousDayInfo.allday,
      start: previousDayInfo.start,
      end: previousDayInfo.end,
     }
	  $scope.newEvent.eventDays.push(newDayShell);
	};
	$scope.removeDay = function(index){
    $scope.newEvent.eventDays.splice(index, 1);
  }
  $scope.getTags = function(band){
    //var deferred = $q.defer();
    var api = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&format=json&api_key=b25b959554ed76058ac220b7b2e0a026&artist=';
    var urlArtist = band.artist.replace(/\s+/g, '+').toLowerCase();
    $http({
      url: api + urlArtist,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).success(function(response){
      if(!response.error){
        band.tags = response.artist.tags.tag;
      } else {
        band.tags = false;
        console.log(response.message+' - '+band.artist);
      }
    }).error(function(err){
      console.error(err);
    });
  }
  // Music
  $scope.bandsInit = function(eventDate){
    var bandShell = {
      date: eventDate,
      artist: '',
      tags: []
    }
    if(undefined == $scope.newEvent.bands[eventDate]){
      $scope.newEvent.bands[eventDate] = [];
    }
    $scope.newEvent.bands[eventDate].push(bandShell);
  }

  $scope.removeBand = function(eventDate,index){
    $scope.newEvent.bands[eventDate].splice(index, 1);
    //$scope.newEvent.bands.splice(index, 1);
  }
  var escapeForJson = function(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }
  var getBands = function(key){
    var bands = $scope.newEvent.bands;
    console.log(bands);
    if(bands[key]){
      var dayMusic = [];
      angular.forEach(bands[key], function(music){
        var musicData = {
          artist: music.artist,
          tags:[]
        }
        for(var i = 0; i < music.tags.length; i++){
          var tagName = music.tags[i].name.toLowerCase().trim();
          var tagSpaces = tagName.replace('-',' ');
          var tagDashes = tagName.replace(' ','-');
          if(musicTagsList.indexOf(tagName) >= 0){
            musicData.tags.push(tagName);
          } else if(musicTagsList.indexOf(tagSpaces) >= 0){
            musicData.tags.push(tagSpaces);
          } else if(musicTagsList.indexOf(tagDashes) >= 0){
            musicData.tags.push(tagDashes);
          }
        }
        dayMusic.push(musicData);
      })
      return dayMusic;
    }
    return false;
  }
  var processTags = function(){
    var bands = $scope.newEvent.bands;
    console.log(bands);
    if(bands){
      var tags = [];
      angular.forEach(bands, function(music){
        console.log(music);
        for(var b = 0; b < music.length; b++){
          var bandTags = music[b].tags;
          for(var t = 0; t < bandTags.length; t++){
            var tagName = bandTags[t].name.toLowerCase().trim();
            var tagSpaces = tagName.replace('-',' ');
            var tagDashes = tagName.replace(' ','-');
            console.log(tagName);
            if(musicTagsList.indexOf(tagName) >= 0){
              tags.push(tagName);
              console.log(tagName);
            } else if(musicTagsList.indexOf(tagSpaces) >= 0){
              tags.push(tagSpaces);
              console.log(tagSpaces);
            } else if(musicTagsList.indexOf(tagDashes) >= 0){
              tags.push(tagDashes);
              console.log(tagDashes);
            }
          }
        }
      });
      console.log(tags);
      if(tags.length > 0){
        return tags;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  var processDays = function(days){
    var eventDays = {};
    console.log(days);
    angular.forEach(days, function(day) {
      var dayKey,date,start,end,description;
      if(day.date){
        dayKey = day.date;
        if(dayKey == 'TBD'){
          console.log('TBD');
          start = 'TBD';
          end = 'TBD';
        } else if(!day.allday){
          if(day.start){
            var startString = dayKey + 'T' + day.start + ':00';
            var local = new Date(startString);
            start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
            start = start.toISOString();
          } else {
            var startString = dayKey + 'T00:00:00';
            var local = new Date(startString);
            start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
            start = start.toISOString();
          }
          if(day.end){
            var startString = dayKey + 'T' + day.start + ':00';
            var endString = dayKey + 'T' + day.end + ':00';
            var local = new Date(endString);
            if(startString < endString){
              console.log('correct timing');
              end = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
              end = end.toISOString();
            } else {
              console.log('incorrect timing');
              console.log(local.getUTCDate() + '+ 1');
              end = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()+1,  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
              end = end.toISOString();
            }
          } else { end = '?'; }
        } else { // All-day event
          var local = new Date(dayKey + 'T00:00:00');
          start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
          start = start.toISOString();
          end = 'AD';
        }
      } else {
        dayKey = "TBD";
        start = 'TBD';
        end = 'TBD';
      }
      var dayMusic = getBands(dayKey);
      eventDays[dayKey] = {
        description: day.description || '',
        start:start,
        end:end,
        music:dayMusic
      }
    });
    return eventDays;
  }
  $scope.reviewEvent = function(){
    $scope.event = false;
    var n = {};
    n = $scope.newEvent;
    $scope.event = {
      title: n.title,
      food: n.food,
			drink: n.drink,
			swag: n.swag,
			recharge: n.recharge,
      music: n.music,
      RSVPLink: n.RSVPLink || false,
      detailsLink: n.detailsLink || false,
      locationName: n.locationName || '',
      locationAddress: n.locationAddress || false,
      credentialLevel: n.credentialLevel,
      age: n.age,
      createdOn: new Date().toISOString()
    }
    if(n.locationCoord){
      $scope.event.locationCoord = {
        lat: n.locationCoord.lat(),
        lng: n.locationCoord.lng(),
      }
    }
    console.log('n.music:'+n.music);
    if(n.music === true){
      console.log('getting tags');
      $scope.event.music = processTags();
    }
    $scope.event.days = processDays(n.eventDays);
    console.log('reviewReady');
    $scope.reviewReady = true;
  }

  $scope.createEvent = function(newEvent){
    var result;
    if($scope.eventType === 'demo'){
      console.log('creating demo event');
      result = eventsFactory.createDemoEvent(newEvent,'2017');
    } else if($scope.eventType === '2017') {
      console.log('creating 2017 event');
      result = eventsFactory.createEvent(newEvent,'2017');
      $scope.reviewReady = false;
      $scope.event = false;
      delete $scope.newEvent;
      formInit();
    } else {
      console.error('Make sure event type is set to demo or 2017');
    }
  }
}]);

v1old.controller('editEventCtrl', ['$scope','$http','$q','eventsFactory','userService','$state','$stateParams', function($scope,$http,$q,eventsFactory,userService,$state,$stateParams){
  var fc = this;
  fc.reviewReady = false;
  var eid = $stateParams.eid;
  $scope.eid = eid;

  function getOldData(){
    eventsFactory.getEvent(eid).then(function(old){
      console.log(old);
      $scope.oldEvent = old;
      $scope.editEvent = old;

      $scope.newEvent = {
  			title: old.title || '',
        credentialLevel: old.credentialLevel || '-1',
        food: old.food || false,
  			drink: old.drink || false,
  			swag: old.swag || false,
  			recharge: old.recharge || false,
        freeNotes: old.freeNotes || '',
  			RSVPLink: old.RSVPLink ||  '',
        detailsLink: old.detailsLink ||  '',
  			age: old.age || '-1',
        createdOn: old.createdOn,
        locationName: '',
  			locationAddress: '',
  			locationCoord: false,
        lastUpdated: new Date().toISOString(),
  			eventDays: [{id:1,allday:false}],
  			description: '',
        music: false,
  			bands: {},
  		};
      if(old.music !== false && old.music !== undefined){
        $scope.newEvent.music = true;
      }
      console.log($scope.newEvent);
    }).catch(function(err){
      console.log('fail');
      console.log(err);
    });
  }

	function formInit(){
		$scope.newEvent = {
			title: '',
			eventDays: [{id:1,allday:false}],
			locationName: '',
			locationAddress: '',
			locationCoord: false,
			description: '',
      credentialLevel: '-1',
			food: false,
			drink: false,
			swag: false,
			recharge: false,
			music: false,
			bands: {},
			freeNotes: '',
			rsvpLink: '',
			age: '-1'
		};
	}
	getOldData();
  var musicTagsList = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
  fc.badgeOptions = [
      {val: '0', name: 'Walk In'},
      {val: '10', name: 'RSVP'},
      {val: '20', name: 'Wristband/Badge Priority'},
      //{val: '30', name: 'Wristband/Badge Only'},
      {val: '40', name: 'Badge Only'},
      {val: '90', name: 'Other (special rules -- put in description)'},
      {val: '-1', name: 'Unknown Credentials Required'}
  ];
  fc.ageOptions = [
      {val: '-1', name: 'Unknown'},
      {val: '18', name: '18+'},
      {val: '21', name: '21+'},
      {val: '0', name: 'All Ages'},
  ];
  fc.sxswDates = [{
		val:'2017-03-07',
		day: 'Tue, 3/07',
	},{
		val:'2017-03-08',
		day: 'Wed, 3/08',
	},{
		val:'2017-03-09',
		day: 'Thu, 3/09',
	},{
		val:'2017-03-10',
		day: 'Fri, 3/10',
	},{
		val:'2017-03-11',
		day: 'Sat, 3/11',
	},{
		val:'2017-03-12',
		day: 'Sun, 3/12',
	},{
		val:'2017-03-13',
		day: 'Mon, 3/13',
	},{
		val:'2017-03-14',
		day: 'Tue, 3/14',
	},{
		val:'2017-03-15',
		day: 'Wed, 3/15',
	},{
		val:'2017-03-16',
		day: 'Thu, 3/16',
	},{
		val:'2017-03-17',
		day: 'Fri, 3/17',
	},{
		val:'2017-03-18',
		day: 'Sat, 3/18',
	},{
		val:'2017-03-19',
		day: 'Sun, 3/19',
	},{
		val:'2017-03-20',
		day: 'Mon, 3/20',
	},{
		val:'2017-03-21',
		day: 'Tue, 3/21',
	},{
		val:'2017-03-22',
		day: 'Wed, 3/22',
	}];
  // Google Autocomplete
  fc.getLocationInfo = function(mapItem){
    if(mapItem){
      var name = mapItem.name;
      var address = mapItem.formatted_address;
      var austin_loc = address.indexOf(" Austin, TX");
      address = address.substr(0,austin_loc-1);
      if(address == name){
        $scope.newEvent.locationName = '';
        $scope.newEvent.locationAddress = address;
      } else {
        $scope.newEvent.locationName = name;
        $scope.newEvent.locationAddress = address;
      }
      $scope.newEvent.locationCoord = mapItem.geometry.location;
    } else {
      return false;
    }
  }

  // Days functions
  $scope.addDay = function() {
    var daysLength = $scope.newEvent.eventDays.length;
	  var newItemNo = daysLength+1;
    var newDate = '';
    var previousDayInfo = $scope.newEvent.eventDays[daysLength-1];
    if(previousDayInfo.date){
      newDate = previousDayInfo.date.substring(8,10);
      newDate = parseInt(newDate) + 1;
    }
    var newDayShell = {
      id: newItemNo,
      date: '2017-03-'+newDate,
      allday: previousDayInfo.allday,
      start: previousDayInfo.start,
      end: previousDayInfo.end,
     }
	  $scope.newEvent.eventDays.push(newDayShell);
	};
	$scope.removeDay = function(index){
    $scope.newEvent.eventDays.splice(index, 1);
  }
  $scope.getTags = function(band){
    //var deferred = $q.defer();
    var api = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&format=json&api_key=b25b959554ed76058ac220b7b2e0a026&artist=';
    var urlArtist = band.artist.replace(/\s+/g, '+').toLowerCase();
    $http({
      url: api + urlArtist,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).success(function(response){
      if(!response.error){
        band.tags = response.artist.tags.tag;
      } else {
        band.tags = false;
        console.log(response.message+' - '+band.artist);
      }
    }).error(function(err){
      console.error(err);
    });
  }
  // Music
  $scope.bandsInit = function(eventDate){
    var bandShell = {
      date: eventDate,
      artist: '',
      tags: []
    }
    if(undefined == $scope.newEvent.bands[eventDate]){
      $scope.newEvent.bands[eventDate] = [];
    }
    $scope.newEvent.bands[eventDate].push(bandShell);
  }

  $scope.removeBand = function(eventDate,index){
    $scope.newEvent.bands[eventDate].splice(index, 1);
    //$scope.newEvent.bands.splice(index, 1);
  }
  var escapeForJson = function(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }
  var getBands = function(key){
    var bands = $scope.newEvent.bands;
    console.log(bands);
    if(bands[key]){
      var dayMusic = [];
      angular.forEach(bands[key], function(music){
        var musicData = {
          artist: music.artist,
          tags:[]
        }
        for(var i = 0; i < music.tags.length; i++){
          var tagName = music.tags[i].name.toLowerCase().trim();
          var tagSpaces = tagName.replace('-',' ');
          var tagDashes = tagName.replace(' ','-');
          if(musicTagsList.indexOf(tagName) >= 0){
            musicData.tags.push(tagName);
          } else if(musicTagsList.indexOf(tagSpaces) >= 0){
            musicData.tags.push(tagSpaces);
          } else if(musicTagsList.indexOf(tagDashes) >= 0){
            musicData.tags.push(tagDashes);
          }
        }
        dayMusic.push(musicData);
      })
      return dayMusic;
    }
    return false;
  }
  var processTags = function(){
    var bands = $scope.newEvent.bands;
    console.log(bands);
    if(bands){
      var tags = [];
      angular.forEach(bands, function(music){
        console.log(music);
        for(var b = 0; b < music.length; b++){
          var bandTags = music[b].tags;
          for(var t = 0; t < bandTags.length; t++){
            var tagName = bandTags[t].name.toLowerCase().trim();
            var tagSpaces = tagName.replace('-',' ');
            var tagDashes = tagName.replace(' ','-');
            console.log(tagName);
            if(musicTagsList.indexOf(tagName) >= 0){
              tags.push(tagName);
              console.log(tagName);
            } else if(musicTagsList.indexOf(tagSpaces) >= 0){
              tags.push(tagSpaces);
              console.log(tagSpaces);
            } else if(musicTagsList.indexOf(tagDashes) >= 0){
              tags.push(tagDashes);
              console.log(tagDashes);
            }
          }
        }
      });
      console.log(tags);
      if(tags.length > 0){
        return tags;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  var processDays = function(days){
    var eventDays = {};
    console.log(days);
    angular.forEach(days, function(day) {
      var dayKey,date,start,end,description;
      if(day.date){
        dayKey = day.date;
        if(dayKey == 'TBD'){
          start = 'TBD';
          end = 'TBD';
        } else if(!day.allday){
          if(day.start){
            var startString = dayKey + 'T' + day.start + ':00';
            var local = new Date(startString);
            start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
            start = start.toISOString();
            console.log(start);
          } else {
            var startString = dayKey + 'T00:00:00';
            var local = new Date(startString);
            start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
            start = start.toISOString();
          }
          if(day.end){
            var startString = dayKey + 'T' + day.start + ':00';
            var endString = dayKey + 'T' + day.end + ':00';
            var local = new Date(endString);
            if(startString < endString){
              end = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
              end = end.toISOString();
            } else {
              end = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()+1,  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
              end = end.toISOString();
            }
          } else { end = '?'; }
        } else { // All-day event
          var local = new Date(dayKey + 'T00:00:00');
          start = new Date(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),  local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds());
          end = 'AD';
        }
      } else {
        dayKey = "TBD";
        start = 'TBD';
        end = 'TBD';
      }
      var dayMusic = getBands(dayKey);
      eventDays[dayKey] = {
        description: day.description || '',
        start:start,
        end:end,
        music:dayMusic
      }
    });
    return eventDays;
  }
  $scope.reviewEvent = function(){
    $scope.event = false;
    var n = {};
    n = $scope.newEvent;
    $scope.event = {
      title: n.title,
      food: n.food,
			drink: n.drink,
			swag: n.swag,
			recharge: n.recharge,
      music: n.music,
      RSVPLink: n.RSVPLink || false,
      detailsLink: n.detailsLink || false,
      locationName: n.locationName || '',
      locationAddress: n.locationAddress || false,
      credentialLevel: n.credentialLevel,
      age: n.age,
      createdOn: n.createdOn,
      lastUpdated: new Date().toISOString()
    }
    if(n.locationCoord){
      $scope.event.locationCoord = {
        lat: n.locationCoord.lat(),
        lng: n.locationCoord.lng(),
      }
    }
    console.log('n.music:'+n.music);
    if(n.music === true){
      console.log('getting tags');
      $scope.event.music = processTags();
    }
    $scope.event.days = processDays(n.eventDays);
    console.log('reviewReady');
    console.log($scope.event);
    $scope.reviewReady = true;
  }

  $scope.createEvent = function(newEvent){
    var result;
    if($scope.eventType === 'demo'){
      console.log('creating demo event');
      result = eventsFactory.createDemoEvent(newEvent,'2017');
    } else if($scope.eventType === '2017') {
      console.log('creating 2017 event');
      result = eventsFactory.createEvent(newEvent,'2017');
      $scope.reviewReady = false;
      $scope.event = false;
      delete $scope.newEvent;
      formInit();
    } else {
      console.error('Make sure event type is set to demo or 2017');
    }
  }
  $scope.updateEvent = function(eid,i){
    console.log('updating event...');
    var updatedInfo = {
      title: i.title,
      food: i.food,
      drink: i.drink,
      swag: i.swag,
      music: i.music,
      RSVPLink: i.RSVPLink,
      detailsLink: i.detailsLink,
      locationName: i.locationName,
      locationAddress: i.locationAddress,
      locationCoord: i.locationCoord,
      credentialLevel: i.credentialLevel,
      age: i.age,
      createdOn: i.createdOn,
      lastUpdated: i.lastUpdated,
      days: i.days
    };

    eventsFactory.rewriteEvent(eid,i).then(function(result){
      console.log('success!');
      console.log(result);
      $scope.reviewReady = false;
      $scope.event = false;
      $scope.newEvent = false;
      $scope.updateStatus = 'Success! The event has been updated';
    }).catch(function(err){
      console.log(err);
      alert(err);
    });

  }
}]);

v1old.controller('appCtrl', ['$scope', '$location','$state','$window', function($scope,$location,$state,$window) {
  $scope.mobileMenu = false;
  $scope.toggleMenu = function(){
    if($scope.mobileMenu){
      $scope.mobileMenu = false;
    } else {
      $scope.mobileMenu = true;
    }
  }
    //stop if app data is not loaded!
    $scope.$on('$routeChangeStart', function(evt, current, previous){
  		if ( ! $scope.bootStatus) evt.preventDefault();
  	});

  	$scope.$watch('bootStatus', function(status) {
  	  if ( ! status) return;
  	  //else console.log('would switch to /home'); //$location.path('/home');
  	})
    this.debug = false;

    angular.element($window).bind("scroll", function() {
      var n = document.getElementById('fsg-nav');
      var nav = angular.element(n);
      if (this.pageYOffset >= 390 && !nav.hasClass('scrolled')) {
        nav.addClass('scrolled');
      } else if (this.pageYOffset < 390 && nav.hasClass('scrolled')) {
        nav.removeClass('scrolled');
      }
    });
    $scope.bootStatus = true;
}]);

v1old.controller('loginCtrl', ['$scope','$state','userService', function($scope,$state,userService){
  // USED FOR NAV AND SIGNIN PAGE
  var _ = this;
  $scope.pageAlert = null;
  $scope.loginProcessing = false;
  $scope.clearAlert = function(){
    $scope.pageAlert = null;
  }
  $scope.loginTries = 0;

  var updateLoginError = function(message){
    $scope.$apply($scope.loginError = message);
  }

  function nextPage(isPaid){
    if(!isPaid){
      $state.go('register');
    } else {
      $state.go('events');
    }
  }

  _.logInPassword = function(){
    var e = $scope.logEmail,
        p = $scope.logPass;
        $scope.loginProcessing = true;
    firebase.auth().signInWithEmailAndPassword(e, p).then(function(user){
      userService.userExists(user.uid).then(function(result){
        $scope.loginProcessing = false;
        nextPage(result.paid);
      }).catch(function(userID){
          // User didn't exist in DB, creating
          userService.createUser(userID,user);
          $scope.loginProcessing = false;
          nextPage(false);
        });
    }).catch(function(error) {
      $scope.loginTries++;
      $scope.loginProcessing = false;
      var err = error.code;
      console.log(err);
      if(err === 'auth/wrong-password'){
        updateLoginError('wrong-password');
      } else if(err === 'auth/user-not-found') {
        updateLoginError('user-not-found');
      } else if (err == 'auth/web-storage-unsupported') {
        updateLoginError('browser-unsupported');
      } else {
        updateLoginError('default');
      }
    });
  }
  _.logInFB = function(){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = result.user;
      userService.userExists(user.uid).then(function(result){ nextPage(result.paid); })
      .catch(function(userID){
        // User didn't exist in DB, creating
        userService.createUser(userID,user);
        nextPage(false);
      });
    }).catch(function(error) {
      $scope.loginTries++;
      if(error.code === "auth/account-exists-with-different-credential"){
        updateLoginError('wrong-method');
      } else {
        updateLoginError('default');
      }
    });
  }
  _.logInTwitter = function(){
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = result.user;
      userService.userExists(user.uid).then(function(result){
        nextPage(result.paid);
        }).catch(function(userID){
          // User didn't exist in DB, creating
          userService.createUser(userID,user);
          nextPage(false);
        });
    }).catch(function(error) {
      $scope.loginTries++;
      if(error.code === "auth/account-exists-with-different-credential"){
        updateLoginError('wrong-method');
      } else {
        updateLoginError('default');
      }
    });
  }
  _.logOut = function(){
    firebase.auth().signOut().then(function() {
      $state.go('home');
    }, function(error) {
      console.error(error);
    });
  }
}])

v1old.controller('ScrollController', ['$location', '$anchorScroll', function($location, $anchorScroll) {
  this.goTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };
}]);

v1old.controller('SignUpController', ['$scope','$q', function($scope,$q){
  // USED FOR EMAIL CAPTURE ONLY
  var _ = this;
  var ref = firebase.database().ref();

  /* sign in and out functions no longer used
  _.signIn = function(){
    firebase.auth().signInAnonymously().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('Error occurred while trying to connect' + errorMessage);
    });
  }
  _.signOut = function(){
    firebase.auth().signOut().then(function() {
    }, function(error) {
    });
  }
  */
  function asyncPush(data){
    return $q(function(resolve, reject){
      setTimeout(function(){
        ref.child('emailCapture').push(data).then(function(ref) {
            resolve('Holy smokes Batman, you\'re on the list! Keep an eye out for our launch email in January.');
    	  }, function(error) {
            reject('Oh no, something went wrong! (We blame Joker) Refresh and try again');
    	  });
      }, 1000);
    })
  }

  $scope.addEmail = function(user) {
    var now = new Date().toISOString();
    var sanitized = (user.email);
    var newEmailData = {
      name: user.name,
      email: user.email,
      timestamp: now
    };
    var results = asyncPush(newEmailData);
    results.then(function(result) {
      $scope.results = result;
    }, function(result) {
      $scope.$apply(function () {
        $scope.results = result;
      });
    });
	}
}]);

v1old.controller('eventsCtrl', ['$scope','$rootScope', 'eventsService','$compile','$state','$stateParams', '$window','windowService','$filter','$location', '$anchorScroll', function($scope,$rootScope,eventsService,$compile,$state,$stateParams,$window,windowService,$filter,$location,$anchorScroll) {
  var ec = this;
  var data = $stateParams.data || '2017';
  $scope.dataYear = data;
  // Filters
  $scope.filter = {};
  $scope.sortEventsBy = '';
  ec.filterReset = function(){
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
  ec.filterReset();
  $scope.compareLocations = function(v1, v2) {
    console.log(v1);
    console.log(v2);
    console.log('----------------------------');
    // If we don't get strings, just compare by index
    return 1;

    // Compare strings alphabetically, taking locale into account
    //return v1.value.localeCompare(v2.value);
  };
  $scope.$watch('filter', function(status) {
    destroyPopout();
    // set pagination to first page when filters are changed
    $scope.currentPage = 0;
  }, true)

  $scope.filterEvents = function(){
    var filteredList = $scope.events, num;
    filteredList = $filter('searchAll')(filteredList,$scope.filter.search);
    filteredList = $filter('foodFilter')(filteredList,$scope.filter.food);
    filteredList = $filter('drinkFilter')(filteredList,$scope.filter.drink);
    filteredList = $filter('swagFilter')(filteredList,$scope.filter.swag);
    filteredList = $filter('rechargeFilter')(filteredList,$scope.filter.recharge);
    filteredList = $filter('musicFilter')(filteredList,$scope.filter.music);
    filteredList = $filter('credentialFilter')(filteredList,$scope.filter.badge);
    filteredList = $filter('musicTagFilter')(filteredList,$scope.filter.musicTags);
    filteredList = $filter('dateFilter')(filteredList,$scope.filter.date);
    filteredList = $filter('favesFilter')(filteredList,$scope.filter.faves);
    filteredList = $filter('RSVPFilter')(filteredList,$scope.filter.rsvp);

    $scope.filteredEvents = filteredList;
    return filteredList;
  }

  function escapeForJson(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }
  // Events list setup
  $scope.events = $rootScope.cachedEvents;
  $scope.filteredEvents;
  $scope.bootStatus = false;
  if(!$scope.events){
    if(data == '2017'){
      eventsService.getEventsArray().then(function(res){
         $scope.events = res;
         $scope.filterEvents();
         $scope.bootStatus = true;
       },function(err){
         $state.go('home');
         console.error(err);
       });
    } else if(data == '2016') {
      eventsService.get2016EventsArray().then(function(res){
         $scope.events = res;
         $scope.filterEvents();
         $scope.bootStatus = true;
       },function(err){
         $state.go('home');
         console.error(err);
       });
    }
  } else {
    $scope.filterEvents();
    $scope.bootStatus = true;
  }

  $scope.showHappeningNow = function(){
    if($scope.filter.date !== 'now'){
      $scope.filter.date = 'now';
    } else {
      $scope.filter.date = 'all';
    }
  }
  $scope.showFavorites = function(){
    if($scope.filter.faves !== 'yes'){
      $scope.filter.faves = 'yes';
    } else {
      $scope.filter.faves = 'all';
    }
  }

  $scope.toggleFilter = function(evt, newClass){
    var _this = evt.currentTarget || evt.srcElement;
    var clickedElement = angular.element(_this);
    var group = clickedElement.parent();
    var filterset = clickedElement.parent().find('fieldset');
    if (group.hasClass(newClass)){
      group.removeClass(newClass);
    } else {
      group.addClass(newClass);
    }
  }
 	ec.badgeOptions = [
 			{val: -1, name: 'Choose Credential Level'},
       {val: 0, name: 'Walk In'},
       {val: 10, name: 'RSVP'},
       {val: 20, name: 'Wristband/Badge Priority'},
       //{val: 30, name: 'Wristband/Badge Only'},
       {val: 40, name: 'Badge Only'}
   ];

  // Pagination in controller
  $scope.currentPage = 0;
  $scope.pageSize = 75;
  $scope.setCurrentPage = function(currentPage) {
      $scope.currentPage = currentPage;
      $location.hash('top');
      $anchorScroll();
  }

  $scope.getNumberAsArray = function (num) {
      return new Array(num);
  };

  $scope.numberOfPages = function() {
    if($scope.filteredEvents){
      return Math.ceil($scope.filteredEvents.length/ $scope.pageSize);
    } else {
      return 1;
    }
  };

  //$scope.exampleTags = ['electronic','house','indie','punk','garage rock','surf','lo-fi','dubstep','dance','trap','trip-hop','alternative','rock','pop','classic rock','oldies','70’s','soul','blues','hip-hop'];
  $scope.exampleTags = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
  $scope.addMusicTags = function(tag){
    var index = $scope.filter.musicTags.indexOf(tag);
    if (index > -1) {
      $scope.filter.musicTags.splice(index, 1);
    } else {
      $scope.filter.musicTags.push(tag);
    }
  }

 ec.inMusicTags = function(tag){
   var pos = $scope.filter.musicTags.indexOf(tag);
   return pos;
 }

  $scope.stringToDate = function(str){
    var out;
    if(isNaN(str)){
      out = str;
    } else if(str.length === 8){
      if(data == '2017'){
        /* 2017 Format */
        var year = str.substring(0,4);
        var month = str.substring(4,6)-1;
        var day = str.substring(6);
      } else if(data == '2016'){
        /* 2016 Format */
        var year = str.substring(4);
        var month = str.substring(0,2)-1;
        var day = str.substring(2,4);
      }
      out = new Date(year,month,day);
    } else {
      out = new Date(str);
    }
    return out;
  }
  $scope.cardDateDisplay = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi-day event';
    } else {
      for(var key in days){
        return $scope.stringToDate(key);
      }
    }
  }
  $scope.printDateDisplayStart = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi';
    } else {
      var k;
      for(var key in days){
        k = key;
      }
      if(days[k].start){
        return days[k].start;
      } else {
        return 'TBA';
      }
    }
  }
  $scope.printDateDisplayEnd = function(days){
    if (Object.keys(days).length > 1){
      return 'day event';
    } else {
      var k;
      for(var key in days){
        k = key;
      }
      if(days[k].end && '?' !== days[k].end){
        return days[k].end;
      } else {
        return 'TBA';
      }
    }
  }
  $scope.credentialsDisplay = function(level){
    if(level == 20){
      return 'Wristband/badge priority';
    } else if (level == 30){
      return 'Wristband/badge only';
    } else if (level == 40){
      return 'Badge only';
    } else {
      return 'See notes for entry rules';
    }
  }
  $scope.ageDisplay = function(age){
    if(age == 0){
      return 'All ages';
    } else if (age == 18){
      return '18+';
    } else if (age == 21){
      return '21+';
    }
  }

  $scope.findRow = function(num){
    var numPerRow = windowService >= 768 ? 3 : 1;
    return (Math.floor(num/numPerRow))+1;
  }
  $scope.findCol = function(num){
    var numPerRow = windowService >= 768 ? 3 : 1;
    return (num%numPerRow)+1;
  }
  ec.defaultDescription = function(days){
    var output = '';
    var dLength = 78;
    angular.forEach(days, function(value, key) {
      if(!output && value.description){
        output = value.description;
      }
    }, output);
    if (output.length < 1){
      output = 'More info coming soon!';
    } //else if (output.length > dLength){
    //  output = output.substring(0, dLength) + '…';
    //}
    return output;
  }

  function getFirstKey(obj){
    var first;
    angular.forEach(obj, function(val,k){
      //if (obj.hasOwnProperty(val) && typeof(val) !== 'function') {
          first = k;
          return;
      //}
    })
    return first;
  }
  function destroyPopout(){
    var oldPopout = document.getElementById('pop-down');
    if(oldPopout){
      oldPopout.style.display = 'none';
    }
  }
  // Get data for event selected and open popout
  $scope.updatePopout = function(eventInfo,row,col){
    var days = eventInfo.days;
    var selected = getFirstKey(days);
    var numPerRow = windowService >= 768 ? 3 : 1;
    var arrowClass = 'arrow__'+col+'-'+numPerRow;

    $scope.activeCard = {
      eventInfo: eventInfo,
      eid: eventInfo.eid,
      days: days,
      daySelected: selected,
      col: col,
      row: row,
      arrow: arrowClass,
      data: data
    };
  }

  ec.firstCompile = true;
  ec.popout;
  // open popout
  $scope.expandCard = function(row,col,info){
    var eventId = info.eid;

    // Destroy all other popout instances
    destroyPopout();

    if($scope.activeCard && $scope.activeCard.eid === eventId){
      $scope.activeCard = false;
    } else {
      // Update info for popout
      $scope.updatePopout(info,row,col);

      var cardParent = document.getElementById('eid-'+eventId);
      // get row/col data from parent
      var activeRow = cardParent.dataset.row;
      var activeCol = cardParent.dataset.col;
      // Identify reference node to add element after
      var nodes = document.querySelectorAll("[data-row='"+activeRow+"']");
      // lastChild not working: workaround
      var referenceNode = nodes[nodes.length-1];

      // Add new element
      if(ec.firstCompile === true){
        ec.popout = $compile('<card-popout eid="'+eventId+'" col="'+col+'" class="clearfix"></card-popout>')($scope)
        angular.element(referenceNode).after(ec.popout);
        ec.firstCompile = false;
      } else {
        angular.element(referenceNode).after(ec.popout);
        var popout = document.getElementById('pop-down');
        popout.style.display = 'block';
      }
    }
  }

  ec.paramId = $stateParams.eid;

  angular.element($window).bind("scroll", function() {
    var sidebar = document.getElementById('filter-sidebar--inner');
    if (this.pageYOffset >= 390) {
      angular.element(sidebar).addClass('fixed');
    } else {
      angular.element(sidebar).removeClass('fixed');
    }
  });

  $scope.filterMenu = false;
  $scope.toggleFilters = function(){
    if($scope.filterMenu === false){
      $scope.filterMenu = true;
    } else {
      $scope.filterMenu = false;
    }
  }
}]);

v1old.controller('mailchimpCtrl', ['$uibModal','$rootScope','$http', function($uibModal,$rootScope,$http){
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

v1old.controller('userEventsCtrl', ['$rootScope','$scope','userService','$window','$uibModal', function($rootScope,$scope,userService,$window,$uibModal){
  var _ = this;
  var user = $rootScope.currentUser;

  // open modal function
  _.open = function (eid,title,uid) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-confirm-rsvp.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      resolve: {
        info: function () {
          return {
            eid: eid,
            title: title,
            uid: uid
          };
        }
      }
    });
  }

  _.toggleFavorite = function(evt,uid,eid,title){
    evt.stopPropagation();
    userService.addFavorite(uid,eid);
  }
  _.toggleRSVP = function(evt,uid,eid,link,evtTitle){
    // Stop opening of popout
    evt.stopPropagation();
    // check if already checked or not (variable passed?)
    var inRSVP = $scope.inRSVP(eid);
    if(inRSVP){ // if checked, uncheck and remove from RSVP
      userService.updateRSVP(uid,eid);
    } else { // if not checked, open window and modal
      _.open(eid,evtTitle,uid);
      $window.open(link, '_blank');
    }

  }
  $scope.inFavorites = function(eid){
    if(user.info.favorites && user.info.favorites.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.inRSVP = function(eid){
    if(user.info.rsvp && user.info.rsvp.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
}])

v1old.controller('ModalInstanceCtrl', ['$uibModalInstance', 'info', 'userService', function ($uibModalInstance, info, userService) {
  var $ctrl = this;
  $ctrl.info = info;
  var uid = info.uid;
  var eid = info.eid;
  $ctrl.confirmRsvp = function () {
    userService.updateRSVP(uid,eid);
    $uibModalInstance.close(eid);
  };
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);

v1old.controller('homeCtrl', ['$scope','skrollrService', function($scope,skrollrService) {
   $scope.showFeature = 'events';
}]);

v1old.controller('registerCtrl', ['$rootScope', '$document', '$scope', '$http', 'stripe', 'promoFactory','userService','$state', '$stateParams', function($rootScope, $document, $scope, $http, stripe, promoFactory, userService,$state,$stateParams){
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
    fbq('track', 'CompleteRegistration');
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
      fbq('track', 'CompleteRegistration');
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
      fbq('track', 'CompleteRegistration');
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
            fbq('track', 'Purchase', {
              value: payment.price,
              currency: 'USD'
            });
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

v1old.controller('mapCtrl', ['$scope', '$rootScope', 'eventsService', 'NgMap','$state','windowService','geolocationSvc','$q', function($scope,$rootScope,eventsService,NgMap,$state,windowService,geolocationSvc,$q){
  var m = this;
  var data = 2017;
  $scope.mapStatus = "Fetching events…";
  m.mapOptions = {
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
  }
  $scope.userLocation = false;
  m.mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
  m.map;
  m.userPosition = {
    // Center of Austin by default
    latitude: 30.267596,
    longitude: -97.744703
  };
  function setCtrlData(v,data){
    m[v] = data;
  }
  function updateScopeData(key,data){
    $scope[key] = data;
  }
  $scope.credentialsDisplay = function(level){
    if(level == 20){
      return 'Wristband/badge priority';
    } else if (level == 30){
      return 'Wristband/badge only';
    } else if (level == 40){
      return 'Badge only';
    } else {
      return 'See notes for entry rules';
    }
  }
  // Events list setup
  $scope.events = $rootScope.cachedEvents;
  $scope.filteredEvents;
  $scope.bootStatus = false;
  if(!$scope.events){
    eventsService.getEventsArray().then(function(res){
       $scope.events = res;
       $scope.bootStatus=true;
       $scope.mapStatus = "Events loaded";
     },function(err){
       $state.go('register');
       console.error(err);
     });
  } else {
    $scope.bootStatus = true;
    $scope.mapStatus = "Events loaded";
  }

  // Beginning of function to scroll to selected card
  m.scrollCards = function(eid){
    var winWidth = windowService;

    var cardsContainer = document.getElementById('map-events');
    var cardToScrollTo = document.getElementById('detail-'+eid);
    cardsContainer.scrollTop = 0;
    if(winWidth >= 768){
      cardsContainer.scrollTop = cardToScrollTo.offsetTop;
    } else {
      cardsContainer.scrollTop = cardToScrollTo.offsetTop - 50 // + map.offsetHeight;
    }
    $scope.selectedEvent = eid;
  }

  var paddedBounds = function(map) {
    var winWidth = windowService,
        eventsWidth, npad, spad, epad, wpad;
    if(winWidth >= 1000){
      eventsWidth = 400;
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else if(winWidth >= 768){
      eventsWidth = winWidth*.4
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else {
      npad = 15;
      spad = 0;
      epad = 5;
      wpad = 5;
    }
    var SW = map.getBounds().getSouthWest();
    var NE = map.getBounds().getNorthEast();
    var topRight = map.getProjection().fromLatLngToPoint(NE);
    var bottomLeft = map.getProjection().fromLatLngToPoint(SW);
    var scale = Math.pow(2, map.getZoom());

    var SWtopoint = map.getProjection().fromLatLngToPoint(SW);
    var SWpoint = new google.maps.Point(((SWtopoint.x - bottomLeft.x) * scale) + wpad, ((SWtopoint.y - topRight.y) * scale) - spad);
    var SWworld = new google.maps.Point(SWpoint.x / scale + bottomLeft.x, SWpoint.y / scale + topRight.y);
    var pt1 = map.getProjection().fromPointToLatLng(SWworld);

    var NEtopoint = map.getProjection().fromLatLngToPoint(NE);
    var NEpoint = new google.maps.Point(((NEtopoint.x - bottomLeft.x) * scale) - epad, ((NEtopoint.y - topRight.y) * scale) + npad);
    var NEworld = new google.maps.Point(NEpoint.x / scale + bottomLeft.x, NEpoint.y / scale + topRight.y);
    var pt2 = map.getProjection().fromPointToLatLng(NEworld);

    return new google.maps.LatLngBounds(pt1, pt2);
  }

  function getUserPosition(){
    $scope.mapStatus = 'Getting your location…';
    var deferred = $q.defer();
    geolocationSvc.getCurrentPosition().then(function(result){
      setCtrlData('userPosition',result.coords);
      var coords = {lat:result.coords.latitude,lng:result.coords.longitude};
      $scope.mapStatus = 'You are here';
      $scope.userLocation = true;
      deferred.resolve(coords);
    }).catch(function(error){
      $scope.mapStatus = 'Sorry, we couldn\'t find you';
      deferred.reject(error);
    });
    return deferred.promise;
  }

  $scope.getPosition = function(){
    $scope.findingLocation = true;
    getUserPosition().then(function(result){
      m.map.setCenter(result);
      $scope.bounds = paddedBounds(m.map);
      $scope.findingLocation = false;
    }).catch(function(err){
      $scope.findingLocation = false;
    })
  }
  NgMap.getMap({id:'mapsview'}).then(function (map) {
    m.map = map;
    $scope.bounds = paddedBounds(map);

    // DO NOT DELETE!
    // Get user position (activate closer to SXSW)
    /*
    getUserPosition().then(function(result){
      map.setCenter(result);
      $scope.bounds = paddedBounds(map);
    }).catch(function(err){
      console.error(err);
    })
    */

    m.map.addListener('zoom_changed', function(){
      var map = this;
      window.setTimeout(function() {
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 1000);
    });
    m.map.addListener('dragend', function(){
      var map = this;
      window.setTimeout(function() {
        //m.map.panTo(marker.getPosition());
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 1000);
    });
  }).catch(function(err){
    console.error(err);
  });

  /* MAP PAGE FUNCTIONS */
  $scope.selectedEvent;
  $scope.updateSelected = function(eid){
    if($scope.selectedEvent === eid){
      $scope.selectedEvent = false;
    } else {
      $scope.selectedEvent = eid;
    }
  }

  $scope.cardDateDisplay = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi-day event';
    } else {
      for(var key in days){
        return new Date(key);
      }
    }
  }

  // Filters
  $scope.showFilters = false;
  $scope.toggleFilters = function(){
    if($scope.showFilters === false){
      $scope.showFilters = true;
    } else {
      $scope.showFilters = false;
    }
  }

  function getTodayKey(){
    var now = new Date();
    var date = now.getDate();
    var dateKey;
    if(date >= 7 && date < 10){
      dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-0'+ (now.getDate());
    } else if (date >= 10 && date < 23) {
      dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-'+ (now.getDate());
    }
    return dateKey;
  }
  m.todayKey = getTodayKey();

  m.filterReset = function(){
    m.filter = {
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
      date: m.todayKey, //'2017-03-10', // Change to first day once we have more events
      musicTags: []
    }
 	}
  m.filterReset();
  $scope.showHappeningNow = function(){
    if(m.filter.date !== 'now'){
      m.filter.date = 'now';
    } else {
      var now = new Date();
      var date = now.getDate();
      var dateKey;
      if(date >= 7 && date < 10){
        dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-0'+ (now.getDate());
      } else if (date >= 10 && date < 23) {
        dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-'+ (now.getDate());
      } else {
        dateKey = 'all';
      }
      m.filter.date = dateKey;
    }
  }

  $scope.toggleFilter = function(evt, newClass){
    var _this = evt.currentTarget || evt.srcElement;
    var clickedElement = angular.element(_this);
    var group = clickedElement.parent();
    var filterset = clickedElement.parent().find('fieldset');
    if (group.hasClass(newClass)){
      group.removeClass(newClass);
    } else {
      group.addClass(newClass);
    }
  }
 	m.badgeOptions = [
 			{val: -1, name: 'Choose Credential Level'},
       {val: 0, name: 'Walk In'},
       {val: 10, name: 'RSVP'},
       {val: 20, name: 'Wristband/Badge Priority'},
       //{val: 30, name: 'Wristband/Badge Only'},
       {val: 40, name: 'Badge Only'}
   ];

   $scope.exampleTags = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
   //$scope.exampleTags = ['electronic','house','indie','punk','garage rock','surf','lo-fi','dubstep','dance','trap','trip-hop','alternative','rock','pop','classic rock','oldies','70’s','soul','blues','hip-hop'];

   $scope.addMusicTags = function(tag){
     var index = m.filter.musicTags.indexOf(tag);
     if (index > -1) {
       m.filter.musicTags.splice(index, 1);
     } else {
       m.filter.musicTags.push(tag);
     }
   }

  m.inMusicTags = function(tag){
    var pos = m.filter.musicTags.indexOf(tag);
    return pos;
  }
}]);

v1old.controller('demoMapCtrl', ['$scope', '$rootScope', 'demoService', 'NgMap','$state','windowService','geolocationSvc','$q','$uibModal','$window', function($scope,$rootScope,demoService,NgMap,$state,windowService,geolocationSvc,$q,$uibModal,$window){
  var m = this;
  var data = 2017;

  $scope.playedFaves = 0;
  $scope.userFaves = [];
  $scope.userRSVP = [];
  $scope.mapStatus = "Fetching events…";
  m.mapOptions = {
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
  }
  $scope.userLocation = false;
  m.mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
  m.map;
  m.userPosition = {
    // 6th and Lamar
    latitude: 30.266219,
    longitude: -97.743466
  };
  function setCtrlData(v,data){
    m[v] = data;
  }
  function updateScopeData(key,data){
    $scope[key] = data;
  }
  // Events list setup
  $scope.events = $rootScope.cachedEvents;
  $scope.filteredEvents;
  $scope.bootStatus = false;

  // Beginning of function to scroll to selected card
  m.scrollCards = function(eid){
    var cardsContainer = document.getElementById('map-events');
    var cardToScrollTo = document.getElementById('detail-'+eid);
    cardsContainer.scrollTop = cardToScrollTo.offsetTop;
    $scope.selectedEvent = eid;
  }

  var paddedBounds = function(map) {
    var winWidth = windowService,
        eventsWidth, npad, spad, epad, wpad;
    if(winWidth >= 1000){
      eventsWidth = 400;
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else if(winWidth >= 768){
      eventsWidth = winWidth*.4
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else {
      npad = 15;
      spad = 0;
      epad = 5;
      wpad = 5;
    }
    var SW = map.getBounds().getSouthWest();
    var NE = map.getBounds().getNorthEast();
    var topRight = map.getProjection().fromLatLngToPoint(NE);
    var bottomLeft = map.getProjection().fromLatLngToPoint(SW);
    var scale = Math.pow(2, map.getZoom());

    var SWtopoint = map.getProjection().fromLatLngToPoint(SW);
    var SWpoint = new google.maps.Point(((SWtopoint.x - bottomLeft.x) * scale) + wpad, ((SWtopoint.y - topRight.y) * scale) - spad);
    var SWworld = new google.maps.Point(SWpoint.x / scale + bottomLeft.x, SWpoint.y / scale + topRight.y);
    var pt1 = map.getProjection().fromPointToLatLng(SWworld);

    var NEtopoint = map.getProjection().fromLatLngToPoint(NE);
    var NEpoint = new google.maps.Point(((NEtopoint.x - bottomLeft.x) * scale) - epad, ((NEtopoint.y - topRight.y) * scale) + npad);
    var NEworld = new google.maps.Point(NEpoint.x / scale + bottomLeft.x, NEpoint.y / scale + topRight.y);
    var pt2 = map.getProjection().fromPointToLatLng(NEworld);

    return new google.maps.LatLngBounds(pt1, pt2);
  }

  function getUserPosition(){
    $scope.mapStatus = 'Getting your location…';
    var deferred = $q.defer();
    geolocationSvc.getCurrentPosition().then(function(result){
      setCtrlData('userPosition',result.coords);
      var coords = {lat:result.coords.latitude,lng:result.coords.longitude};
      $scope.mapStatus = 'You are here';
      $scope.userLocation = true;
      deferred.resolve(coords);
    }).catch(function(error){
      $scope.mapStatus = 'Sorry, we couldn\'t find you';
      deferred.reject(error);
    });
    return deferred.promise;
  }
  NgMap.getMap({id:'mapsview'}).then(function (map) {
    m.map = map;
    $scope.bounds = paddedBounds(map);

    // DO NOT DELETE!
    // Get user position (activate closer to SXSW)
    /*
    getUserPosition().then(function(result){
      map.setCenter(result);
      $scope.bounds = paddedBounds(map);
    }).catch(function(err){
      console.error(err);
    })
    */

    m.map.addListener('zoom_changed', function(){
      var map = this;
      window.setTimeout(function() {
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 1000);
    });
    m.map.addListener('dragend', function(){
      var map = this;
      window.setTimeout(function() {
        //m.map.panTo(marker.getPosition());
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 1000);
    });
  }).catch(function(err){
    console.error(err);
  });

  /* MAP PAGE FUNCTIONS */
  $scope.selectedEvent;
  $scope.updateSelected = function(eid){
    if($scope.selectedEvent === eid){
      $scope.selectedEvent = false;
    } else {
      $scope.selectedEvent = eid;
    }
  }

  $scope.cardDateDisplay = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi-day event';
    } else {
      for(var key in days){
        return new Date(key);
      }
    }
  }

  // Filters
  $scope.showFilters = false;
  $scope.toggleFilters = function(){
    if($scope.showFilters === false){
      $scope.showFilters = true;
    } else {
      $scope.showFilters = false;
    }
  }
  m.filterReset = function(){
    m.filter = {
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
      date: 'all', // Change to first day once we have more events
      musicTags: []
    }
 	}
  m.filterReset();

  // Events list setup
  var getDemoData = function(){
    demoService.getEventsArray().then(function(res){
       $scope.events = res;
       m.filterReset();
       $scope.bootStatus = true;
     },function(err){
       console.error(err);
     });
  }
  getDemoData();

  $scope.showHappeningNow = function(){
    if(m.filter.date !== 'now'){
      m.filter.date = 'now';
    } else {
      var now = new Date();
      var date = now.getDate();
      var dateKey;
      if(date >= 7 && date < 10){
        dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-0'+ (now.getDate());
      } else if (date >= 10 && date < 23) {
        dateKey = (now.getFullYear()) +'-'+ '0'+(now.getMonth()+1) +'-'+ (now.getDate());
      } else {
        dateKey = 'all';
      }
      m.filter.date = dateKey;
    }
  }

  $scope.toggleFilter = function(evt, newClass){
    var _this = evt.currentTarget || evt.srcElement;
    var clickedElement = angular.element(_this);
    var group = clickedElement.parent();
    var filterset = clickedElement.parent().find('fieldset');
    if (group.hasClass(newClass)){
      group.removeClass(newClass);
    } else {
      group.addClass(newClass);
    }
  }
 	m.badgeOptions = [
 			{val: -1, name: 'Choose Credential Level'},
       {val: 0, name: 'Walk In'},
       {val: 10, name: 'RSVP'},
       {val: 20, name: 'Wristband/Badge Priority'},
       //{val: 30, name: 'Wristband/Badge Only'},
       {val: 40, name: 'Badge Only'}
   ];

  $scope.exampleTags = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];

  $scope.addMusicTags = function(tag){
     var index = m.filter.musicTags.indexOf(tag);
     if (index > -1) {
       m.filter.musicTags.splice(index, 1);
     } else {
       m.filter.musicTags.push(tag);
     }
  }

  m.inMusicTags = function(tag){
    var pos = m.filter.musicTags.indexOf(tag);
    return pos;
  }

  $scope.openRsvpModal = function (eid,title,uid) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-confirm-rsvp.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      resolve: {
        info: function () {
          return {
            eid: eid,
            title: title,
            rsvpArray: $scope.userRSVP
          };
        }
      }
    });
  }
  var openFavesDisclaimer = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-demo-disclaimer.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'md',
      resolve: {
        info: true
      }
    });
  }
  var openRegisterPrompt = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-demo-signup.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'md',
      resolve: {
        info: true
      }
    });
  }
  $scope.inFavorites = function(eid){
    if($scope.userFaves.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.inRSVP = function(eid){
    if($scope.userRSVP.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.toggleFavorite = function(evt,eid){
    evt.stopPropagation();
    var fIndex = $scope.userFaves.indexOf(eid);
    if(fIndex >= 0){
      $scope.userFaves.splice(fIndex,1);
    } else {
      $scope.userFaves.push(eid);
    }
    $scope.playedFaves++;
  }
  $scope.toggleRSVP = function(evt,eid,link,evtTitle){
    // Stop opening of popout
    evt.stopPropagation();
    var rIndex = $scope.userRSVP.indexOf(eid);
    if(rIndex >= 0){
      $scope.userRSVP.splice(rIndex,1);
    } else {
      $scope.openRsvpModal(eid,evtTitle);
      $window.open(link, '_blank');
    }
    $scope.playedFaves++;
  }

  var favesWatch = $scope.$watch("playedFaves", function (num) {
    if(num === 1){
      openFavesDisclaimer();
    } else if(num > 1){
      favesWatch(); // Would clear the watch
    }
  });
}]);

v1old.controller('demoCtrl', ['$scope','$rootScope', 'demoService','$compile','$state','$window','windowService','$filter','$uibModal', function($scope,$rootScope,demoService,$compile,$state,$window,windowService,$filter,$uibModal) {
  var ec = this;

  $scope.filter = {};
  $scope.sortEventsBy = '';
  $scope.playedCount = 0;
  $scope.playedFaves = 0;
  $scope.events;
  $scope.filteredEvents;
  $scope.bootStatus = false;
  $scope.userFaves = [];
  $scope.userRSVP = [];

  // Filters
  ec.filterReset = function(){
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
  ec.filterReset();

  var playedWatch = $scope.$watch("playedCount", function (num) {
    if(num === 10){
      openRegisterPrompt();
    } else if(num > 10){
      playedWatch(); // Would clear the watch
    }
  });

  var favesWatch = $scope.$watch("playedFaves", function (num) {
    if(num === 1){
      openFavesDisclaimer();
    } else if(num > 1){
      favesWatch(); // Would clear the watch
    }
  });

  $scope.$watch('filter', function(status) {
    // Hide popout when filters changed
    destroyPopout();
    // set pagination to first page when filters are changed
    $scope.currentPage = 0;
    $scope.playedCount++;
  }, true)

  $scope.filterEvents = function(){
    var filteredList = $scope.events, num;
    filteredList = $filter('searchAll')(filteredList,$scope.filter.search);
    filteredList = $filter('foodFilter')(filteredList,$scope.filter.food);
    filteredList = $filter('drinkFilter')(filteredList,$scope.filter.drink);
    filteredList = $filter('swagFilter')(filteredList,$scope.filter.swag);
    filteredList = $filter('rechargeFilter')(filteredList,$scope.filter.recharge);
    filteredList = $filter('musicFilter')(filteredList,$scope.filter.music);
    filteredList = $filter('credentialFilter')(filteredList,$scope.filter.badge);
    filteredList = $filter('musicTagFilter')(filteredList,$scope.filter.musicTags);
    filteredList = $filter('dateFilter')(filteredList,$scope.filter.date);
    filteredList = $filter('demoFavesFilter')(filteredList,$scope.filter.faves,$scope.userFaves);
    filteredList = $filter('demoRSVPFilter')(filteredList,$scope.filter.rsvp,$scope.userRSVP);

    $scope.filteredEvents = filteredList;
    return filteredList;
  }

  function escapeForJson(snippet){
    snippet = snippet.replace(/<\//g, '< \/'); // escape / before html closing tag
    snippet = snippet.replace(/\/>/g, ' \/>'); // space before self-closing tags
    snippet = snippet.replace(/"/g, '\\"'); // escape double-quotes
    return snippet;
  }
  $scope.unescapeJson = function(snippet){
    if(snippet){
      snippet = snippet.replace(/<\s\//g, '</');
      snippet = snippet.replace(/\\"/g, '"');
    }
    return snippet;
  }

  // Events list setup
  var getDemoData = function(){
    demoService.getEventsArray().then(function(res){
       $scope.events = res;
       $scope.filterEvents();
       $scope.bootStatus = true;
       fbq('track', 'ViewContent', {
         content_type: 'demo'
       });
     },function(err){
       $state.go('home');
       console.error(err);
     });
  }
  getDemoData();

  $scope.showHappeningNow = function(){
    if($scope.filter.date !== 'now'){
      $scope.filter.date = 'now';
    } else {
      $scope.filter.date = 'all';
    }
  }
  $scope.showFavorites = function(){
    if($scope.filter.faves !== 'yes'){
      $scope.filter.faves = 'yes';
    } else {
      $scope.filter.faves = 'all';
    }
  }
  $scope.toggleFilter = function(evt, newClass){
    var _this = evt.currentTarget || evt.srcElement;
    var clickedElement = angular.element(_this);
    var group = clickedElement.parent();
    var filterset = clickedElement.parent().find('fieldset');
    if (group.hasClass(newClass)){
      group.removeClass(newClass);
    } else {
      group.addClass(newClass);
    }
  }
 	ec.badgeOptions = [
 			{val: -1, name: 'Choose Credential Level'},
       {val: 0, name: 'Walk In'},
       {val: 10, name: 'RSVP'},
       {val: 20, name: 'Wristband/Badge Priority'},
       //{val: 30, name: 'Wristband/Badge Only'},
       {val: 40, name: 'Badge Only'}
   ];

  // Pagination in controller
  $scope.currentPage = 0;
  $scope.pageSize = 75;
  $scope.setCurrentPage = function(currentPage) {
      $scope.currentPage = currentPage;
      $location.hash('top');
      $anchorScroll();
  }

  $scope.getNumberAsArray = function (num) {
      return new Array(num);
  };

  $scope.numberOfPages = function() {
    if($scope.filteredEvents){
      return Math.ceil($scope.filteredEvents.length/ $scope.pageSize);
    } else {
      return 1;
    }
  };

  $scope.exampleTags = ['indie','rock','electronic','pop','indie rock','female vocalists','alternative','punk','folk','soul','singer-songwriter','shoegaze','experimental','dream pop','hip-hop','indie pop','jazz','psychedelic','lo-fi','ambient','garage rock','psychedelic rock','hardcore','emo','pop rock','math rock','noise pop','spanish','punk rock','surf','progressive rock','grunge','blues','rap','reggae','trip-hop','bluegrass','metal','funk','trap','country','r&b','british'];
  $scope.addMusicTags = function(tag){
    var index = $scope.filter.musicTags.indexOf(tag);
    if (index > -1) {
      $scope.filter.musicTags.splice(index, 1);
    } else {
      $scope.filter.musicTags.push(tag);
    }
  }

 ec.inMusicTags = function(tag){
   var pos = $scope.filter.musicTags.indexOf(tag);
   return pos;
 }

  $scope.stringToDate = function(str){
    var out;
    if(isNaN(str)){
      out = str;
    } else {
      out = new Date(str);
    }
    return out;
  }
  $scope.cardDateDisplay = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi-day event';
    } else {
      for(var key in days){
        return $scope.stringToDate(key);
      }
    }
  }
  $scope.credentialsDisplay = function(level){
    if(level == 20){
      return 'Wristband/badge priority';
    } else if (level == 30){
      return 'Wristband/badge only';
    } else if (level == 40){
      return 'Badge only';
    } else {
      return 'See notes for entry rules';
    }
  }
  $scope.ageDisplay = function(age){
    if(age == 0){
      return 'All ages';
    } else if (age == 18){
      return '18+';
    } else if (age == 21){
      return '21+';
    }
  }

  $scope.findRow = function(num){
    var numPerRow = windowService >= 768 ? 3 : 1;
    return (Math.floor(num/numPerRow))+1;
  }
  $scope.findCol = function(num){
    var numPerRow = windowService >= 768 ? 3 : 1;
    return (num%numPerRow)+1;
  }
  ec.defaultDescription = function(days){
    var output = '';
    var dLength = 78;
    angular.forEach(days, function(value, key) {
      if(!output && value.description){
        output = value.description;
      }
    }, output);
    return output;
  }

  function getFirstKey(obj){
    var first;
    angular.forEach(obj, function(val,k){
      //if (obj.hasOwnProperty(val) && typeof(val) !== 'function') {
          first = k;
          return;
      //}
    })
    return first;
  }
  function destroyPopout(){
    var oldPopout = document.getElementById('pop-down');
    if(oldPopout){
      oldPopout.style.display = 'none';
    }
  }
  // Get data for event selected and open popout
  $scope.updatePopout = function(eventInfo,row,col){
    var days = eventInfo.days;
    var selected = getFirstKey(days);
    var numPerRow = windowService >= 768 ? 3 : 1;
    var arrowClass = 'arrow__'+col+'-'+numPerRow;

    $scope.activeCard = {
      eventInfo: eventInfo,
      eid: eventInfo.eid,
      days: days,
      daySelected: selected,
      col: col,
      row: row,
      arrow: arrowClass,
      data: '2017'
    };
  }

  ec.firstCompile = true;
  ec.popout;
  // open popout
  $scope.expandCard = function(row,col,info){
    var eventId = info.eid;

    // Destroy all other popout instances
    destroyPopout();

    if($scope.activeCard && $scope.activeCard.eid === eventId){
      $scope.activeCard = false;
    } else {
      // Update info for popout
      $scope.updatePopout(info,row,col);

      var cardParent = document.getElementById('eid-'+eventId);
      // get row/col data from parent
      var activeRow = cardParent.dataset.row;
      var activeCol = cardParent.dataset.col;
      // Identify reference node to add element after
      var nodes = document.querySelectorAll("[data-row='"+activeRow+"']");
      // lastChild not working: workaround
      var referenceNode = nodes[nodes.length-1];

      // Add new element
      if(ec.firstCompile === true){
        ec.popout = $compile('<card-popout eid="'+eventId+'" col="'+col+'" arb="data" class="clearfix"></card-popout>')($scope)
        angular.element(referenceNode).after(ec.popout);
        //ec.popout.addClass('clearfix');
        ec.firstCompile = false;
      } else {
        angular.element(referenceNode).after(ec.popout);
        var popout = document.getElementById('pop-down');
        popout.style.display = 'block';
      }
    }
  }

  angular.element($window).bind("scroll", function() {
    var sidebar = document.getElementById('filter-sidebar--inner');
    if (this.pageYOffset >= 390) {
      angular.element(sidebar).addClass('fixed');
    } else {
      angular.element(sidebar).removeClass('fixed');
    }
  });

  $scope.filterMenu = false;
  $scope.toggleFilters = function(){
    if($scope.filterMenu === false){
      $scope.filterMenu = true;
    } else {
      $scope.filterMenu = false;
    }
  }

  $scope.openRsvpModal = function (eid,title,uid) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-confirm-rsvp.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      resolve: {
        info: function () {
          return {
            eid: eid,
            title: title,
            rsvpArray: $scope.userRSVP
          };
        }
      }
    });
  }
  var openFavesDisclaimer = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-demo-disclaimer.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'md',
      resolve: {
        info: true
      }
    });
  }
  var openRegisterPrompt = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'components/directives/modal-demo-signup.html',
      controller: 'demoModalCtrl',
      controllerAs: '$ctrl',
      size: 'md',
      resolve: {
        info: true
      }
    });
  }
  $scope.inFavorites = function(eid){
    if($scope.userFaves.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.inRSVP = function(eid){
    if($scope.userRSVP.indexOf(eid) >= 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.toggleFavorite = function(evt,eid,title){
    evt.stopPropagation();
    var fIndex = $scope.userFaves.indexOf(eid);
    if(fIndex >= 0){
      $scope.userFaves.splice(fIndex,1);
    } else {
      $scope.userFaves.push(eid);
    }
    $scope.playedCount++;
    $scope.playedFaves++;
  }
  $scope.toggleRSVP = function(evt,eid,link,evtTitle){
    // Stop opening of popout
    evt.stopPropagation();
    var rIndex = $scope.userRSVP.indexOf(eid);
    if(rIndex >= 0){
      $scope.userRSVP.splice(rIndex,1);
    } else {
      $scope.openRsvpModal(eid,evtTitle);
      $window.open(link, '_blank');
    }
    $scope.playedCount++;
    $scope.playedFaves++;
  }
}]);

v1old.controller('demoModalCtrl', ['$uibModalInstance', 'info', 'userService', function ($uibModalInstance, info, userService) {
  var $ctrl = this;
  $ctrl.info = info;

  $ctrl.confirmRsvp = function () {
    var eid = info.eid;
    info.rsvpArray.push(eid);
    $uibModalInstance.close(eid);
  };
  $ctrl.ok = function(){
    $uibModalInstance.close();
  }
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);

v1old.controller('map2016Ctrl', ['$scope', '$rootScope', 'eventsService', 'NgMap','$state','windowService','geolocationSvc','$q', function($scope,$rootScope,eventsService,NgMap,$state,windowService,geolocationSvc,$q){
  var m = this;
  var data = '2016';
  $scope.mapStatus = "Fetching events…";
  $scope.userLocation = false;
  m.mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
  m.map;
  m.userPosition = {
    // Center of Austin by default
    latitude: 30.2674153,
    longitude: -97.7374798
  };
  function setCtrlData(v,data){
    m[v] = data;
  }
  function updateScopeData(key,data){
    $scope[key] = data;
  }
  // Events list setup
  $scope.events = false; //$rootScope.cachedEvents;
  $scope.filteredEvents;
  $scope.bootStatus = false;
  if(!$scope.events){
    console.log(data);
    eventsService.get2016EventsArray().then(function(res){
       $scope.events = res;
       $scope.bootStatus = true;
       $scope.mapStatus = "Events loaded";
     },function(err){
       $state.go('register');
       console.error(err);
     });
  } else {
    console.log($scope.events);
    $scope.bootStatus = true;
    $scope.mapStatus = "Events loaded";
  }

  // Beginning of function to scroll to selected card
  m.scrollCards = function(eid){
    var cardsContainer = document.getElementById('map-events');
    var cardToScrollTo = document.getElementById('detail-'+eid);

    cardsContainer.scrollTop = cardToScrollTo.offsetTop;
    $scope.selectedEvent = eid;
  }

  var paddedBounds = function(map) {
    var winWidth = windowService,
        eventsWidth, npad, spad, epad, wpad;
    if(winWidth >= 1000){
      eventsWidth = 400;
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else if(winWidth >= 768){
      eventsWidth = winWidth*.4
      npad = 95;
      spad = 0;
      epad = 5;
      wpad = eventsWidth+5;
    } else {
      npad = 15;
      spad = 0;
      epad = 5;
      wpad = 5;
    }
    var SW = map.getBounds().getSouthWest();
    var NE = map.getBounds().getNorthEast();
    var topRight = map.getProjection().fromLatLngToPoint(NE);
    var bottomLeft = map.getProjection().fromLatLngToPoint(SW);
    var scale = Math.pow(2, map.getZoom());

    var SWtopoint = map.getProjection().fromLatLngToPoint(SW);
    var SWpoint = new google.maps.Point(((SWtopoint.x - bottomLeft.x) * scale) + wpad, ((SWtopoint.y - topRight.y) * scale) - spad);
    var SWworld = new google.maps.Point(SWpoint.x / scale + bottomLeft.x, SWpoint.y / scale + topRight.y);
    var pt1 = map.getProjection().fromPointToLatLng(SWworld);

    var NEtopoint = map.getProjection().fromLatLngToPoint(NE);
    var NEpoint = new google.maps.Point(((NEtopoint.x - bottomLeft.x) * scale) - epad, ((NEtopoint.y - topRight.y) * scale) + npad);
    var NEworld = new google.maps.Point(NEpoint.x / scale + bottomLeft.x, NEpoint.y / scale + topRight.y);
    var pt2 = map.getProjection().fromPointToLatLng(NEworld);

    return new google.maps.LatLngBounds(pt1, pt2);
  }

  function getUserPosition(){
    $scope.mapStatus = 'Getting your location…';
    var deferred = $q.defer();
    geolocationSvc.getCurrentPosition().then(function(result){
      setCtrlData('userPosition',result.coords);
      var coords = {lat:result.coords.latitude,lng:result.coords.longitude};
      $scope.mapStatus = 'You are here';
      $scope.userLocation = true;
      deferred.resolve(coords);
    }).catch(function(error){
      $scope.mapStatus = 'Sorry, we couldn\'t find you';
      deferred.reject(error);
      // reset boundary center to last known $scope.bounds
    });
    return deferred.promise;
  }
  NgMap.getMap().then(function (map) {
    m.map = map;
    $scope.bounds = paddedBounds(map);
    //console.log('setting center to user position...');
    /* Don't get user position until SXSW
    getUserPosition().then(function(result){
      map.setCenter(result);
      $scope.bounds = paddedBounds(map);
    }).catch(function(err){
      console.error(err);
    })
    */

    m.map.addListener('zoom_changed', function(){
      var map = this;
      window.setTimeout(function() {
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 2000);
    });
    m.map.addListener('dragend', function(){
      var map = this;
      window.setTimeout(function() {
        //m.map.panTo(marker.getPosition());
        $scope.$apply($scope.bounds = paddedBounds(map));
      }, 2000);
    });
  }).catch(function(err){
    console.log('something went wrong making the map');
    console.error(err);
  });

  /* MAP PAGE FUNCTIONS */
  $scope.selectedEvent;
  $scope.updateSelected = function(eid){
    if($scope.selectedEvent === eid){
      $scope.selectedEvent = false;
    } else {
      $scope.selectedEvent = eid;
    }
  }

  $scope.stringToDate = function(str){
    var out;
    if(isNaN(str)){
      out = str;
    } else if(str.length === 8){
      var year = str.substring(4);
      var month = str.substring(0,2)-1;
      var day = str.substring(2,4);
      out = new Date(year,month,day);
    } else {
      out = new Date(str);
    }
    return out;
  }
  $scope.cardDateDisplay = function(days){
    if (Object.keys(days).length > 1){
      return 'Multi-day event';
    } else {
      for(var key in days){
        return $scope.stringToDate(key);
      }
    }
  }

  // Filters
  $scope.showFilters = false;
  $scope.toggleFilters = function(){
    if($scope.showFilters === false){
      $scope.showFilters = true;
    } else {
      $scope.showFilters = false;
    }
  }
  m.filterReset = function(){
    if(data == '2016'){
      m.filter = {
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
        date: '03112016',
        musicTags: []
   		}
    } else if (data == '2017'){
      m.filter = {
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
        date: '2017-03-11', // production 2017
        musicTags: []
   		}
    }
 	}
  m.filterReset();

  $scope.showHappeningNow = function(){
    if(m.filter.date !== 'now'){
      m.filter.date = 'now';
    } else {
      m.filter.date = '03102016'; //'2017-03-10'; // production
    }
  }
  $scope.toggleFilter = function(evt, newClass){
    var _this = evt.currentTarget || evt.srcElement;
    var clickedElement = angular.element(_this);
    var group = clickedElement.parent();
    var filterset = clickedElement.parent().find('fieldset');
    if (group.hasClass(newClass)){
      group.removeClass(newClass);
    } else {
      group.addClass(newClass);
    }
  }
 	m.badgeOptions = [
 			{val: -1, name: 'Choose Credential Level'},
       {val: 0, name: 'Walk In'},
       {val: 10, name: 'RSVP'},
       {val: 20, name: 'Wristband/Badge Priority'},
       //{val: 30, name: 'Wristband/Badge Only'},
       {val: 40, name: 'Badge Only'}
   ];
   $scope.exampleTags = ['electronic','house','indie','punk','garage rock','surf','lo-fi','dubstep','dance','trap','trip-hop','alternative','rock','pop','classic rock','oldies','70’s','soul','blues','hip-hop'];

   $scope.addMusicTags = function(tag){
     var index = m.filter.musicTags.indexOf(tag);
     if (index > -1) {
       m.filter.musicTags.splice(index, 1);
     } else {
       m.filter.musicTags.push(tag);
     }
   }

  m.inMusicTags = function(tag){
    var pos = m.filter.musicTags.indexOf(tag);
    return pos;
  }
}]);

v1old.controller('panelCtrl', ['$scope','$state','$anchorScroll','userService','adminService','eventsService', function($scope,$state,$anchorScroll,userService,adminService,eventsService){
  var pc = this;
  $scope.adminTab = 'default';
  $scope.bootStatus = false;
  $scope.userFilterType = 'all';
  $scope.sortUsers = null;
  $scope.sortEvents = null;
  $scope.eventSortReverse = false;
  $scope.userSortReverse = false;

  userService.getCurrentUser().then(function(user){
    userService.isAdmin(user.uid).then(function(result){
      if(!result){
        $state.go('home');
      } else {
        getUsersData();
        getEventsData();
        $scope.bootStatus = true;
      }
    }).catch(function(result){
      $state.go('home');
    })
  }).catch(function(err){
    $state.go('home');
  });

  $scope.changeTab = function(tab){
    $scope.adminTab = tab;
  }
  $scope.sortUsersBy = function(propertyName) {
    $scope.userSortReverse = ($scope.sortUsers === propertyName) ? !$scope.userSortReverse : false;
    $scope.sortUsers = propertyName;
  };
  $scope.sortEventsBy = function(propertyName) {
    $scope.eventSortReverse = ($scope.sortEvents === propertyName) ? !$scope.eventSortReverse : false;
    $scope.sortEvents = propertyName;
  };
  $scope.findMissing = function(key,data){
    if(!key){ console.log('no key: '+key); return true; }
    var missing = 0;
    angular.forEach(data, function(day,k){
      if(undefined === day[key]){
        missing++;
      }
    });
    if(missing > 0){
      return true;
    } else {
      return false;
    }
  }
  $scope.findMissingDays = function(key,data){
    if(!key){ console.log('no key: '+key); return true; }
    var missing = 0;
    angular.forEach(data, function(day,k){
      if(undefined === day[key]){
        missing++;
      }
    });
    if(missing > 0){
      return true;
    } else {
      return false;
    }
  };
  var getUsersData = function(){
    adminService.getAllUsers().then(function(result){
      $scope.users3705 = result;
    });
  }
  var getEventsData = function(){
    eventsService.getEventsArray().then(function(res){
       $scope.events3705 = res;
       $scope.bootStatus = true;
     },function(err){
       $state.go('home');
       console.error(err);
     });
  }
}]);
