(function () {
  'use strict';

  angular
      .module('Note.folders')
      .controller('FoldersController', FoldersController);

  FoldersController.$inject = [
    '$scope', '$state', '$rootScope',
    '$ionicModal', '$cordovaDialogs',
    'FoldersUtils'
  ];

  function FoldersController($scope, $state, $rootScope,
                             $ionicModal, $cordovaDialogs,
                             FoldersUtils) {
    $scope.search = {
      title: ''
    };


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

    $rootScope.$on('openSearchFolderModal', function () {
      $cordovaDialogs.prompt('Enter search folder title', 'Search folder', ['Apply', 'Cancel'], $scope.search.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return $scope.search.title = ''; }

            $scope.search.title = result.input1;
          });
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
