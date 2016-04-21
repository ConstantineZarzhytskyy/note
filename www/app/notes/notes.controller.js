(function () {

  'use strict';

  angular
      .module('Note.notes')
      .controller('NotesController', NotesController);

  NotesController.$inject = [
    '$scope', '$rootScope', '$state',
    '$ionicModal', '$ionicLoading', '$ionicActionSheet', '$ionicPlatform',
    '$cordovaDialogs', '$cordovaCamera', '$cordovaImagePicker', '$cordovaLocalNotification',
    'NotesUtils', 'FoldersUtils', 'MarkersUtils', 'AuthUtils'
  ];

  function NotesController($scope, $rootScope, $state,
                           $ionicModal, $ionicLoading, $ionicActionSheet, $ionicPlatform,
                           $cordovaDialogs, $cordovaCamera, $cordovaImagePicker, $cordovaLocalNotification,
                           NotesUtils, FoldersUtils, MarkersUtils, AuthUtils) {
    $scope.notes = [];
    $scope.loadingNotes = true;
    $scope.sortParam = '';
    $scope.search = {
      title: ''
    };
    $scope.getNotes = getNotes;

    $ionicPlatform.ready(function () {
      if (!AuthUtils.isLogged()) {
        AuthUtils.authWithDeviceUUID($rootScope.device)
            .then(function () {
              getNotes();
            });
      } else {
        getNotes();
      }
    });

    function getNotes() {
      $scope.newNote = {};
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });

      $scope.loadingNotes = true;

      NotesUtils.getNotes()
          .then(function (ok) {
            $scope.notes = ok;

            $ionicLoading.hide();
          }, function (err) {
            console.log(err);
          })
          .finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
          });
    }

    $ionicModal.fromTemplateUrl('note-sort-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.sortNoteDialog = modal;
    });

    $rootScope.$on('loginInSystem', function () {
      getNotes();
    });

    $rootScope.$on('userLogout', function () {
      getNotes();
    });

    $scope.changeSortParam = function (selectedSortParam) {
      $scope.sortParam = selectedSortParam;

      $scope.sortNoteDialog.hide();
    };

    $rootScope.$on('openSearchNoteModal', function () {
      $cordovaDialogs.prompt('Enter search note title', 'Search note', ['Apply', 'Cancel'], $scope.search.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return $scope.search.title = ''; }

            $scope.search.title = result.input1;
          });
    });

    $rootScope.$on('openSortModal', function () {
      $scope.sortNoteDialog.show();
    });

    $scope.closeSortNoteDialog = function () {
      $scope.sortNoteDialog.hide();
    };

    $scope.getNoteInfo = function (note) {
      $state.go('app.note', { noteId: note._id });
    };

    $scope.showOptionsForNote = function (note) {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Update' },
          { text: 'Remove' }
        ],
        titleText: note.title,
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) {
            $state.go('app.newNote', { noteId: note._id })
          }
          if (index === 1) {
            NotesUtils.removeNote(note._id)
                .then(function (ok) {
                  getNotes();
                }, function (err) {
                  console.log(err);
                });
          }

          return true;
        }
      });
    };

    $scope.createNote = function () {
      $state.go('app.newNote');
    };

    $scope.changeDone = function (note) {
      note.done = !!note.done;

      NotesUtils.updateNote(note)
          .then(function (ok) {
          }, function (err) {
            console.log(err);
          })
    };
  }
})();
