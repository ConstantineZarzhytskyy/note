(function () {
  'use strict';

  angular
      .module('Note')
      .config(configApp)
      .config(configSatellizer)
      .config(configTimePicker)
      .constant('server_host', 'https://ionic-note.herokuapp.com/')
      .run(function ($ionicPlatform, $rootScope) {
        $ionicPlatform.ready(function () {
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }
          if (window.StatusBar) { StatusBar.styleDefault(); }

          $rootScope.device = device.uuid;
        });

        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
          $rootScope.$previousState = from;
        });

        $rootScope.$on('$cordovaLocalNotification:click',
            function (event, notification, state) {
              $rootScope.notification = notification.data;
            });
      });

  configApp.$inject = ['$stateProvider', '$urlRouterProvider'];
  configSatellizer.$inject = ['$authProvider'];
  configTimePicker.$inject = ['ionicTimePickerProvider'];

  function configApp($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/app/notes");

    $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: './app/menu/menu.html',
          controller: 'MenuController'
        })
        .state('app.notes', {
          cache: false,
          url: "/notes",
          views: {
            'menuContent': {
              templateUrl: "./app/notes/notes.html",
              controller: 'NotesController'
            }
          }
        })
        .state('app.note', {
          url: "/notes/:noteId?update",
          views: {
            'menuContent': {
              templateUrl: "./app/note/note.html",
              controller: 'NoteController'
            }
          }
        })
        .state('app.folders', {
          cache: false,
          url: "/folders",
          views: {
            'menuContent': {
              templateUrl: "./app/folders/folders.html",
              controller: 'FoldersController'
            }
          }
        })
        .state('app.folder', {
          url: "/folders/:folderId",
          views: {
            'menuContent': {
              templateUrl: "./app/folder/folder.html",
              controller: 'FolderController'
            }
          }
        })
        .state('app.markers', {
          cache: false,
          url: "/markers",
          views: {
            'menuContent': {
              templateUrl: "./app/markers/markers.html",
              controller: 'MarkersController'
            }
          }
        })
        .state('app.map', {
          cache: false,
          url: "/map?markerId&isEditMarker",
          views: {
            'menuContent': {
              templateUrl: "./app/map/map.html",
              controller: 'MapController'
            }
          }
        });
  }

  function configSatellizer($authProvider) {
    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.baseUrl = 'https://ionic-note.herokuapp.com/';
    $authProvider.loginUrl = '/api/auth/login';
    $authProvider.signupUrl = '/api/auth/registration';
    $authProvider.tokenName = 'token';
    $authProvider.storageType = 'localStorage';
    $authProvider.authToken = 'Bearer';
    $authProvider.authHeader = 'Authorization';
  }

  function configTimePicker(ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 24,
      step: 1,
      setLabel: 'Set',
      closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  }
})();
