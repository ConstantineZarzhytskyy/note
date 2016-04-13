(function () {

  'use strict';

  angular
      .module('Note.note')
      .controller('NoteController', NoteController);

  NoteController.$inject = [
    '$scope', '$stateParams',
    '$ionicModal',
    'NoteUtils'
  ];

  function NoteController($scope, $stateParams,
                          $ionicModal,
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

    $ionicModal.fromTemplateUrl('update-note-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.updateNoteDialog = modal;
    });

    $scope.updateNote = function () {
      $scope.updateNoteDialog.show();
    };

    $scope.closeNoteDialog = function () {
      $scope.updateNoteDialog.hide();
    };

    $scope.saveUpdate = function (note) {
      NoteUtils.updateNote(note)
          .then(function () {
            $scope.updateNoteDialog.hide();
          }, function (err) {
            console.log(err);
          });
    };
  }
})();
