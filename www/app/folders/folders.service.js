(function () {
  'use strict';

  angular
      .module('Note.folders')
      .factory('FoldersUtils', FoldersUtils);

  FoldersUtils.$inject = [
    '$q', '$http',
    'server_host'
  ];

  function FoldersUtils($q, $http,
                       server_host) {
    var service = {
      getFolders: getFolders,
      createFolder: createFolder
    };

    function getFolders() {
      var defer = $q.defer();

      $http.get(server_host + 'api/folders')
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function createFolder(folder) {
      var defer = $q.defer();

      $http.post(server_host + 'api/folders', { folder: folder })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }
})();
