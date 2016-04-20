(function () {

  'use strict';

  angular
      .module('Note.notes')
      .controller('NotesController', NotesController);

  NotesController.$inject = [
    '$scope', '$rootScope', '$state',
    '$ionicModal', '$ionicLoading', '$ionicActionSheet', '$ionicPlatform', 'ionicTimePicker',
    '$cordovaDialogs', '$cordovaCamera', '$cordovaImagePicker', '$cordovaLocalNotification',
    'NotesUtils', 'FoldersUtils', 'MarkersUtils', 'NoteUtils', 'AuthUtils'
  ];

  function NotesController($scope, $rootScope, $state,
                           $ionicModal, $ionicLoading, $ionicActionSheet, $ionicPlatform, ionicTimePicker,
                           $cordovaDialogs, $cordovaCamera, $cordovaImagePicker, $cordovaLocalNotification,
                           NotesUtils, FoldersUtils, MarkersUtils, NoteUtils, AuthUtils) {
    $scope.notes = [];
    $scope.loadingNotes = true;
    $scope.sortParam = '';
    $scope.search = {
      title: ''
    };
    $scope.newNote = {};

    $ionicPlatform.ready(function () {
      if (!AuthUtils.isLogged()) {
        AuthUtils.authWithDeviceUUID($rootScope.device)
            .then(function () {
              init();
            });
      } else {
        init();
      }

    });

    $scope.getNotes = getNotes;

    function init() {
      getNotes();
      getMarkers();
      getFolders();
    }

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

    function setupNotification(note) {
      if (!note.intervalotification) { return getNotes(); }

      var alarmTime = new Date(note.dateNotification);
      alarmTime.setHours(note.timeNotification.getHours());
      alarmTime.setMinutes(note.timeNotification.getMinutes());
      console.log('time = ' + alarmTime);

      $cordovaLocalNotification.schedule({
        date: alarmTime,
        message: note.description,
        title: note.title,
        autoCancel: true,
        sound: null,
        data: {
          noteId: newNote._id.toString()
        }
      }).then(function () {
        getNotes();
      });
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
          .then(function (newNote) {
            $scope.newNoteDialog.hide();

            setupNotification(note);
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

      $state.go('app.map', { isEditMarker:true })
    };

    $scope.changeDone = function (note) {
      note.done = !!note.done;

      NoteUtils.updateNote(note)
          .then(function (ok) {
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

    $scope.setupTime = function () {
      var time = {
        callback: function (time) {
          if (typeof (time) === 'undefined') { return; }

          var selectedTime = new Date(time * 1000);
          $scope.newNote.timeNotification = new Date();
          $scope.newNote.timeNotification.setHours(selectedTime.getUTCHours());
          $scope.newNote.timeNotification.setMinutes(selectedTime.getUTCMinutes());
        }
      };

      ionicTimePicker.openTimePicker(time);
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
            $state.go('app.note', { noteId: note._id, update: true })
          }
          if (index === 1) {
            NoteUtils.removeNote(note._id)
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
  }
})();
