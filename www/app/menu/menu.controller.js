(function () {

  'use strict';

  angular
      .module('Note.menu')
      .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$state', '$scope', '$rootScope',
    '$ionicModal',
    'AuthUtils'
  ];

  function MenuController($state, $scope, $rootScope,
                          $ionicModal,
                          AuthUtils) {
    $scope.loading = false;

    $ionicModal.fromTemplateUrl('./app/auth/auth.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.authModal = modal;
    });

    $scope.openAuthModal = function () {
      $scope.authModal.show();
    };

    $scope.closeAuthModal = function () {
      $scope.authModal.hide();
    };

    $scope.login = function (user) {
      console.log(user);
      $scope.loading = true;

      AuthUtils.login(user)
          .then(function (ok) {
            $scope.user = ok.data.user;
            console.log('User ', $scope.user, 'login');

            $rootScope.$broadcast('loginInSystem', user);

            $scope.loading = false;

            $scope.authModal.hide();
          }, function (err) {
            console.log(err);
          });
    };

    $scope.register = function (user) {
      $scope.loading = true;

      AuthUtils.register(user)
          .then(function (ok) {
            console.log('User ', ok, 'registered');

            $scope.loading = false;

            $scope.authModal.hide();
          }, function (err) {
            console.log(err);
          });
    };

    $scope.hasSearchState = function () {
      return $state.is('app.notes') || $state.is('app.folders') || $state.is('app.markers');
    };

    $scope.isNoteState = function () {
      return $state.is('app.notes');
    };

    $scope.openSearchModal = function () {
      if ($state.is('app.notes')) return $rootScope.$broadcast('openSearchNoteModal');
      if ($state.is('app.folders')) return $rootScope.$broadcast('openSearchFolderModal');
      if ($state.is('app.markers')) return $rootScope.$broadcast('openSearchMarkerModal');
    };

    $scope.openSortModal = function () {
      $rootScope.$broadcast('openSortModal');
    }
  }

})();
