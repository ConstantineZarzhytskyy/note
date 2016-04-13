(function () {

  'use strict';

  angular
      .module('Note.note')
      .controller('NoteController', NoteController);

  NoteController.$inject = [
    '$scope', '$stateParams',
    'NoteUtils'
  ];

  function NoteController($scope, $stateParams,
                          NoteUtils) {
    var noteId = $stateParams.noteId;

    getNote(noteId);
    function getNote(noteId) {
      NoteUtils.getNote(noteId)
          .then(function (note) {
            $scope.note = note;

            console.log($scope.note);
          }, function (err) {
            console.log(err);
          })
    }
  }
})();
