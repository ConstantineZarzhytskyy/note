(function () {

  'use strict';

  angular
      .module('Note.note')
      .controller('NoteController', NoteController);

  NoteController.$inject = [
    '$scope', '$stateParams', '$state',
    '$ionicModal', '$cordovaDialogs',
    'NoteUtils'
  ];

  function NoteController($scope, $stateParams, $state,
                          $ionicModal, $cordovaDialogs,
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

    $scope.removeNote = function () {
      $cordovaDialogs.confirm('Are you want to remove note: ' + $scope.note.title + '?', 'Remove note', [ 'Remove', 'Cancel' ])
          .then(function(buttonIndex) {
            if (buttonIndex != 1) { return; }

            NoteUtils.removeNote($scope.note._id)
                .then(function (ok) {
                  $state.go('app.notes');
                }, function (err) {
                  console.log(err);
                });

          });
    };
  }
})();
