(function () {

  'use strict';

  angular
      .module('Note.notes')
      .controller('NotesController', NotesController);

  NotesController.$inject = [
    '$scope', '$rootScope', '$state',
    '$ionicModal', '$cordovaDialogs', '$ionicLoading', '$ionicActionSheet', '$cordovaCamera', '$cordovaImagePicker',
    'NotesUtils', 'FoldersUtils', 'MarkersUtils', 'NoteUtils'
  ];

  function NotesController($scope, $rootScope, $state,
                           $ionicModal, $cordovaDialogs, $ionicLoading, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker,
                           NotesUtils, FoldersUtils, MarkersUtils, NoteUtils) {
    $scope.notes = [];
    $scope.loadingNotes = true;
    $scope.sortParam = '';
    $scope.search = {
      title: ''
    };
    $scope.newNote = {};

    getNotes();
    getMarkers();
    getFolders();

    $scope.getNotes = getNotes;
    function getNotes() {
      $scope.newNote = {};
      //$ionicLoading.show({
      //  template: '<ion-spinner icon="bubbles"></ion-spinner>'
      //});

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

    function getMarkers() {
      MarkersUtils.getMarkers()
          .then(function (markers) {
            $scope.markers = markers;
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

    function createPictureWithCamera() {
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options)
          .then(function (picture) {
            $scope.newNote.picture = picture;

            window.plugins.Base64.encodeFile($scope.newNote.picture, function (base64) {  // Encode URI to Base64 needed for contacts plugin
              $scope.newNote.picture = base64;
            });
          }, function (err) {
            console.log(err);
          });
    }

    function getPictureFromGallery() {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options).then(function (results) {
        $scope.newNote.picture = results[0];

        window.plugins.Base64.encodeFile($scope.newNote.picture, function (base64) {  // Encode URI to Base64 needed for contacts plugin
          $scope.newNote.picture = base64;
          $scope.$apply();
        });
      }, function(error) {
        console.log('Error: ' + JSON.stringify(error));    // In case of error
      });
    }

    function encodeFile(file) {

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

    $rootScope.$on('openSearchNoteModal', function () {
      $cordovaDialogs.prompt('Enter search note title', 'Search note', ['Apply', 'Cancel'], $scope.search.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return $scope.search.title = ''; }

            $scope.search.title = result.input1;
          });
    });

    $rootScope.$on('newMarkerCreated', function (event) {
      $scope.newNoteDialog.show();

      getMarkers();
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

    $scope.saveNoteInfo = function (newNoteInfoId, selectedId) {
      newNoteInfoId = selectedId;
    };

    $scope.createMarker = function () {
      $scope.newNoteDialog.hide();

      $state.go('app.map', { isNewMarker:true })
    };

    $scope.changeDone = function (note) {
      note.done = !!note.done;

      NoteUtils.updateNote(note)
          .then(function (ok) {
            getNotes();
          }, function (err) {
            console.log(err);
          })
    };

    $scope.applyPicture = function () {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Create new from camera' },
          { text: 'Choose from exist' }
        ],
        titleText: 'Picture',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) { createPictureWithCamera(); }
          if (index === 1) { getPictureFromGallery(); }

          return true;
        }
      });
    };
  }
})();
