(function () {

  'use strict';

  angular
      .module('Note.notes')
      .factory('NotesUtils', NotesUtils);

  NotesUtils.$inject = [
    '$q', '$http', '$auth',
    'server_host'
  ];

  function NotesUtils($q, $http, $auth,
                          server_host) {
    var service = {
      getNotes: getNotes,
      createNote: createNote,
      removeNote: removeNote,
      updateNote: updateNote
    };

    function getNotes() {
      console.log('NoteUtils token = ' + $auth.getToken());
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


    function removeNote(noteId) {
      var defer = $q.defer();

      $http.delete(server_host + 'api/notes/' + noteId)
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

    return service;
  }
})();
