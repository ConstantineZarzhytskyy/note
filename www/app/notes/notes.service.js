(function () {

  'use strict';

  angular
      .module('Note.notes')
      .factory('NoteUtils', NoteUtils);

  NoteUtils.$inject = [
    '$q', '$http',
    'server_host'
  ];

  function NoteUtils($q, $http,
                          server_host) {
    var service = {
      getNotes: getNotes,
      createNote: createNote
    };

    function getNotes() {
      var defer = $q.defer();

      $http.get(server_host + 'api/notes')
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function createNote(note) {
      var defer = $q.defer();

      $http.post(server_host + 'api/notes', { note: note })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }
})();
