(function () {
  'use strict';

  angular
      .module('Note')
      .config(configApp)
      .config(configSatellizer)
      .constant('server_host', 'https://ionic-note.herokuapp.com/')
      .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }
          if (window.StatusBar) { StatusBar.styleDefault(); }
        });
      });

  configApp.$inject = ['$stateProvider', '$urlRouterProvider'];
  configSatellizer.$inject = ['$authProvider'];

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
          url: "/notes",
          views: {
            'menuContent': {
              templateUrl: "./app/notes/notes.html",
              controller: 'NotesController'
            }
          }
        })
        .state('app.note', {
          url: "/:noteId",
          views: {
            'menuContent': {
              templateUrl: "./app/note/note.html",
              controller: 'NoteController'
            }
          }
        })
        .state('app.folders', {
          url: "/folders",
          views: {
            'menuContent': {
              templateUrl: "./app/folders/folders.html",
              controller: 'FoldersController'
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
    $authProvider.storageType = 'sessionStorage';
    $authProvider.authToken = 'Bearer';
    $authProvider.authHeader = 'Authorization';
  }
})();
