(function () {

  'use strict';

  angular
      .module('Note.note')
      .factory('NoteUtils', NoteUtils);

  NoteUtils.$inject = [
    '$q', '$http',
    'server_host'
  ];

  function NoteUtils($q, $http,
                     server_host) {
    var service = {
      getNote: getNote,
      updateNote: updateNote,
      removeNote: removeNote
    };

    function getNote(noteId) {
      var defer = $q.defer();

      $http.get(server_host + 'api/notes/' + noteId)
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function updateNote(note) {
      var defer = $q.defer();

      $http.put(server_host + 'api/notes/' + note._id, { note: note })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function removeNote(noteId) {
      var defer = $q.defer();

      $http.delete(server_host + 'api/notes/' + noteId)
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }

})();
