(function () {
  'use strict';

  angular
      .module('Note.folder')
      .controller('FolderController', FolderController);

  FolderController.$inject = [
    '$scope', '$state', '$stateParams',
    '$ionicModal', '$cordovaDialogs', '$ionicLoading',
    'FolderUtils'
  ];

  function FolderController($scope, $state, $stateParams,
                             $ionicModal, $cordovaDialogs, $ionicLoading,
                             FolderUtils) {
    var folderId = $stateParams.folderId;
    var isUpdate = $stateParams.update;

    getFolder(folderId);
    getNotes(folderId);

    function getFolder(folderId) {
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });

      FolderUtils.getFolder(folderId)
          .then(function (folder) {
            $scope.folder = folder;

            $ionicLoading.hide();

            if (isUpdate) {
              $scope.updateFolderDialog.show();
            }
          }, function (err) {
            console.log(err);
          });
    }

    function getNotes(folderId) {
      FolderUtils.getNotes(folderId)
          .then(function (notes) {
            $scope.notes = notes;

            console.log(notes);
          }, function (err) {
            console.log(err);
          });
    }

    $ionicModal.fromTemplateUrl('update-folder-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.updateFolderDialog = modal;
    });

    $scope.getNoteInfo = function (note) {
      $state.go('app.note', { noteId: note._id });
    };

    $scope.updateFolder = function () {
      $scope.updateFolderDialog.show();
    };

    $scope.closeFolderDialog = function () {
      $scope.updateFolderDialog.hide();
    };

    $scope.saveUpdate = function () {
      FolderUtils.updateFolder($scope.folder)
          .then(function (ok) {
            $scope.updateFolderDialog.hide();
          }, function (err) {
            console.log(err);
          })
    };

    $scope.removeFolder = function () {
      $cordovaDialogs.confirm('Are you want to remove folder: ' + $scope.folder.title + '?', 'Remove folder', [ 'Remove', 'Cancel' ])
          .then(function(buttonIndex) {
            if (buttonIndex != 1) { return; }

            FolderUtils.removeFolder($scope.folder._id)
                .then(function (ok) {
                  $state.go('app.folders');
                }, function (err) {
                  console.log(err);
                });

          });
    }
  }
})();
