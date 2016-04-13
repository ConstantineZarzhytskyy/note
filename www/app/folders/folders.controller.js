(function () {
  'use strict';

  angular
      .module('Note.folders')
      .controller('FoldersController', FoldersController);

  FoldersController.$inject = [
    '$scope', '$state',
    '$ionicModal',
    'FoldersUtils'
  ];

  function FoldersController($scope, $state,
                             $ionicModal,
                             FoldersUtils) {
    getFolders();
    function getFolders() {
      FoldersUtils.getFolders()
          .then(function (folders) {
            $scope.folders = folders;
          }, function (err) {
            console.log(err);
          });
    }

    $ionicModal.fromTemplateUrl('folder-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.folderDialog = modal;
    });

    $scope.openFolderDialog = function () {
      $scope.folderDialog.show();
    };

    $scope.closeFolderDialog = function () {
      $scope.folderDialog.hide();
    };

    $scope.saveFolder = function (folder) {
      FoldersUtils.createFolder(folder)
          .then(function () {
            $scope.folderDialog.hide();

            getFolders();
          }, function (err) {
            console.log(err);
          })
    };

    $scope.getFolderInfo = function (folder) {
      $state.go('app.folder', { folderId: folder._id });
    }
  }
})();
