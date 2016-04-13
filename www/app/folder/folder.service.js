(function () {
  'use strict';

  angular
      .module('Note.folder')
      .factory('FolderUtils', FolderUtils);

  FolderUtils.$inject = [
    '$q', '$http',
    'server_host'
  ];

  function FolderUtils($q, $http,
                       server_host) {
    var service = {
      getFolder: getFolder,
      getNotes: getNotes
    };

    function getFolder(folderId) {
      var defer = $q.defer();

      $http.get(server_host + 'api/folders/' + folderId)
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function getNotes(folderId) {
      var defer = $q.defer();

      $http.get(server_host + 'api/folders/' + folderId + '/notes')
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }
})();
