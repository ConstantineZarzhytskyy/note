(function () {
  'use strict';

  angular
      .module('Note.auth')
      .factory('AuthUtils', AuthUtils);

  AuthUtils.$inject = [
    '$q', '$http',
    'server_host', '$auth'
  ];

  function AuthUtils($q, $http,
                     server_host, $auth) {
    var service = {
      login: login,
      register: register,
      isLogged: isLogged,
      logout: logout,
      userInfo: userInfo
    };

    function login(user) {
      var defer = $q.defer();

      $auth.login({ user: user })
          .then(defer.resolve)
          .catch(defer.reject);

      return defer.promise;
    }

    function register(user) {
      var defer = $q.defer();

      $http.post(server_host + 'api/auth/register', { user: user })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function isLogged() {
      return $auth.isAuthenticated();
    }

    function logout() {
      return $auth.logout();
    }

    function userInfo() {
      var defer = $q.defer();

      $http.get(server_host + 'api/auth/user')
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }
})();
