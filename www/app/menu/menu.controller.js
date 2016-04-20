(function () {

  'use strict';

  angular
      .module('Note.menu')
      .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$state', '$scope', '$rootScope',
    '$ionicModal', '$ionicLoading',
    'AuthUtils'
  ];

  function MenuController($state, $scope, $rootScope,
                          $ionicModal, $ionicLoading,
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
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });

      AuthUtils.login(user)
          .then(function (ok) {
            $scope.user = ok.data.user;
            console.log('User ', $scope.user, 'login');

            $rootScope.$broadcast('loginInSystem', user);

            $scope.authModal.hide();
          }, function (err) {
            alert(err.data.err, 'Auth error', 'OK');
            console.log(err);
          })
          .finally(function () {
            $ionicLoading.hide();
          });
    };

    $scope.register = function (user) {
      AuthUtils.register(user)
          .then(function (ok) {
            console.log('User ', ok, 'registered');

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
    };

    $scope.isLogged = function () {
      return AuthUtils.isLogged();
    };
  }

})();
