(function () {
  'use strict';

  angular
      .module('Note.folder')
      .controller('FolderController', FolderController);

  FolderController.$inject = [
    '$scope', '$state', '$stateParams',
    '$ionicModal',
    'FolderUtils'
  ];

  function FolderController($scope, $state, $stateParams,
                             $ionicModal,
                             FolderUtils) {
    var folderId = $stateParams.folderId;

    getFolders(folderId);
    getNotes(folderId);

    function getFolders(folderId) {
      FolderUtils.getFolder(folderId)
          .then(function (folder) {
            $scope.folder = folder;

            console.log(folder);
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
    }
  }
})();
