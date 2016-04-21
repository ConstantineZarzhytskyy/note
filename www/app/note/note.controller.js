(function () {

  'use strict';

  angular
      .module('Note.note')
      .controller('NoteController', NoteController);

  NoteController.$inject = [
    '$scope', '$stateParams', '$state', '$rootScope',
    'ionicTimePicker', '$ionicActionSheet',
    '$cordovaDialogs', '$cordovaCamera', '$cordovaImagePicker', '$cordovaLocalNotification',
    'NoteUtils', 'MarkersUtils', 'FoldersUtils', 'FolderUtils', 'NotesUtils'
  ];

  function NoteController($scope, $stateParams, $state, $rootScope,
                          ionicTimePicker, $ionicActionSheet,
                          $cordovaDialogs, $cordovaCamera, $cordovaImagePicker, $cordovaLocalNotification,
                          NoteUtils, MarkersUtils, FoldersUtils, FolderUtils, NotesUtils) {
    var noteId = $stateParams.noteId;
    $scope.pageTitle = "New note";
    $scope.note = {
      dateNotification: new Date(),
      timeNotification: new Date()
    };

    init();
    function init() {
      getFolders();
      getMarkers();

      if ($state.is('app.newNote') && !noteId)
        return $scope.note = {
        dateNotification: new Date(),
        timeNotification: new Date()
      };

      getNote(noteId);
    }

    function getNote(noteId) {
      NoteUtils.getNote(noteId)
          .then(function (note) {
            $scope.note = note;
            $scope.pageTitle = note.title.toString();

            getMarker($scope.note.markerId);
            getFolder($scope.note.folderId);
          }, function (err) {
            console.log(err);
          })
    }

    function getMarkers() {
      MarkersUtils.getMarkers()
          .then(function (markers) {
            $scope.markers = markers;
          }, function (err) {
            console.log(err);
          });
    }

    function getMarker(markerId) {
      MarkersUtils.getMarker(markerId)
          .then(function (marker) {
            $scope.marker = marker;
          }, function (err) {
            console.log(err);
          });
    }

    function getFolders() {
      FoldersUtils.getFolders()
          .then(function (folders) {
            $scope.folders = folders;

            console.log($scope.folders);
          }, function (err) {
            console.log(err);
          })
    }

    function getFolder(folderId) {
      FolderUtils.getFolder(folderId)
          .then(function (folder) {
            $scope.folder = folder;
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
            $scope.note.picture = picture;

            window.plugins.Base64.encodeFile($scope.note.picture, function (base64) {
              $scope.note.picture = base64;
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
        $scope.note.picture = results[0];

        window.plugins.Base64.encodeFile($scope.note.picture, function (base64) {
          $scope.note.picture = base64;

          $scope.$apply();
        });
      }, function(error) {
        console.log('Error: ' + JSON.stringify(error));
      });
    }

    function setupNotification(note) {
      //if (!note.intervalNotification) { return $state.go($rootScope.$previousState, $rootScope.$previousParams); }

      var alarmTime = new Date(note.dateNotification);
      note.timeNotification = new Date(note.timeNotification);
      alarmTime.setHours(note.timeNotification.getHours());
      alarmTime.setMinutes(note.timeNotification.getMinutes());
      alarmTime.setSeconds(0);
      console.log('time = ' + alarmTime);

      $cordovaLocalNotification.schedule({
        id: note._id,
        date: alarmTime,
        message: note.description,
        title: note.title,
        autoCancel: true,
        sound: null,
        data: {
          noteId: note._id.toString()
        }
      }).then(function () {
        $state.go($rootScope.$previousState, $rootScope.$previousParams);
      });
    }

    $scope.removeNote = function () {
      $cordovaDialogs.confirm('Are you want to remove note: ' + $scope.note.title + '?', 'Remove note', [ 'Remove', 'Cancel' ])
          .then(function(buttonIndex) {
            if (buttonIndex != 1) { return; }

            NotesUtils.removeNote($scope.note._id)
                .then(function (ok) {
                  $state.go($rootScope.$previousState, $rootScope.$previousParams);
                }, function (err) {
                  console.log(err);
                });

          });
    };

    $scope.changeDone = function () {
      NoteUtils.updateNote($scope.note)
          .then(function (ok) {

          }, function (err) {
            console.log(err);
          });
    };

    $scope.showMarker = function () {
      $state.go('app.map', { markerId: $scope.marker._id });
    };

    $scope.showFolder = function () {
      $state.go('app.folder', { folderId: $scope.folder._id });
    };

    $scope.setupTime = function () {
      var time = {
        callback: function (time) {
          if (typeof (time) === 'undefined') { return; }

          var selectedTime = new Date(time * 1000);
          $scope.note.timeNotification = new Date();
          $scope.note.timeNotification.setHours(selectedTime.getUTCHours());
          $scope.note.timeNotification.setMinutes(selectedTime.getUTCMinutes());
        }
      };

      ionicTimePicker.openTimePicker(time);
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

    $scope.saveNote = function () {
      console.log($scope.note);

      if (noteId) {
        console.log(1);
        NotesUtils.updateNote($scope.note)
            .then(function (ok) {
              $state.go($rootScope.$previousState, $rootScope.$previousParams);
            }, function (err) {
              console.log(err);
            })
      } else {
        console.log(2);
        NotesUtils.createNote($scope.note)
            .then(function (newNote) {
              setupNotification(newNote);
            }, function (err) {
              console.log(err);
            });
      }
    };

    $scope.updateNote = function () {
      $state.go('app.newNote', { noteId: $scope.note._id });
    };

    $scope.createMarker = function () {
      $state.go('app.map', { isEditMarker:true })
    };


    $rootScope.$on('newMarkerCreated', function () {
      getMarkers();
    });
  }
})();
