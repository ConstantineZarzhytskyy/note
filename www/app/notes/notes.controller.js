(function () {

  'use strict';

  angular
      .module('Note.notes')
      .controller('NotesController', NotesController);

  NotesController.$inject = [
    '$scope', '$rootScope', '$state',
    '$ionicModal',
    'NotesUtils'
  ];

  function NotesController($scope, $rootScope, $state,
                           $ionicModal,
                           NotesUtils) {
    $scope.notes = [];
    $scope.loadingNotes = true;

    getNotes();
    function getNotes() {
      $scope.loadingNotes = true;

      NotesUtils.getNotes()
          .then(function (ok) {
            $scope.notes = ok;

            $scope.loadingNotes = false;
          }, function (err) {
            console.log(err);
          });
    }

    $ionicModal.fromTemplateUrl('note-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.newNoteDialog = modal;
    });

    $rootScope.$on('loginInSystem', function (event, date) {
      getNotes();
    });

    $scope.openNewNoteDialog = function () {
      $scope.newNoteDialog.show();
    };

    $scope.closeNewNoteDialog = function () {
      $scope.newNoteDialog.hide();
    };

    $scope.saveNote = function (note) {
      NotesUtils.createNote(note)
          .then(function () {
            $scope.newNoteDialog.hide();

            getNotes();
          }, function (err) {
            console.log(err);
          });
    };

    $scope.getNoteInfo = function (note) {
      $state.go('app.note', { noteId: note._id });
    };
  }
})();
