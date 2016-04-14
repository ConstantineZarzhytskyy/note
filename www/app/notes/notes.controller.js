(function () {

  'use strict';

  angular
      .module('Note.notes')
      .controller('NotesController', NotesController);

  NotesController.$inject = [
    '$scope', '$rootScope', '$state',
    '$ionicModal', '$cordovaDialogs',
    'NotesUtils', 'FoldersUtils'
  ];

  function NotesController($scope, $rootScope, $state,
                           $ionicModal, $cordovaDialogs,
                           NotesUtils, FoldersUtils) {
    $scope.notes = [];
    $scope.loadingNotes = true;
    $scope.sortParam = '';
    $scope.search = {
      title: ''
    };

    getNotes();
    getFolders();

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

    function getFolders() {
      FoldersUtils.getFolders()
          .then(function (folders) {
            $scope.folders = folders;

            console.log(folders);
          }, function (err) {
            console.log(err);
          })
    }

    $ionicModal.fromTemplateUrl('note-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.newNoteDialog = modal;
    });

    $ionicModal.fromTemplateUrl('note-sort-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.sortNoteDialog = modal;
    });

    $rootScope.$on('loginInSystem', function () {
      getNotes();
    });

    $scope.changeSortParam = function (selectedSortParam) {
      $scope.sortParam = selectedSortParam;

      $scope.sortNoteDialog.hide();
    };

    $rootScope.$on('openSearchModal', function () {
      $cordovaDialogs.prompt('Enter search note title', 'Search note', ['Apply', 'Cancel'], $scope.search.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return $scope.search.title = ''; }

            $scope.search.title = result.input1;
          });
    });

    $rootScope.$on('openSortModal', function () {
      $scope.sortNoteDialog.show();
    });

    $scope.openNewNoteDialog = function () {
      $scope.newNoteDialog.show();
    };

    $scope.closeNewNoteDialog = function () {
      $scope.newNoteDialog.hide();
    };
    
    $scope.closeSortNoteDialog = function () {
      $scope.sortNoteDialog.hide();
    };

    $scope.saveNote = function (note) {
      console.log(note);
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

    $scope.changeFolder = function (newNoteFolder, selectedFolder) {
      newNoteFolder = selectedFolder;
    }
  }
})();
