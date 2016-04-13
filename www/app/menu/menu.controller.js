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
    }).then(function(modal) {
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
    }

  }

})();
