(function () {
  'use strict';

  angular
      .module('Note.folders')
      .controller('FoldersController', FoldersController);

  FoldersController.$inject = [
    '$scope', '$state', '$rootScope',
    '$ionicModal', '$ionicLoading', '$ionicActionSheet',
    '$cordovaDialogs',
    'FoldersUtils', 'FolderUtils'
  ];

  function FoldersController($scope, $state, $rootScope,
                             $ionicModal, $ionicLoading, $ionicActionSheet,
                             $cordovaDialogs,
                             FoldersUtils, FolderUtils) {
    $scope.search = {
      title: ''
    };
    $scope.newFolder = {};

    getFolders();
    function getFolders() {
      $scope.newFolder = {};
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });

      FoldersUtils.getFolders()
          .then(function (folders) {
            $scope.folders = folders;

            calcCountDone();

            $ionicLoading.hide();
          }, function (err) {
            console.log(err);
          });
    }

    function calcCountDone() {
      for(var i in $scope.folders) {
        $scope.folders[i].countDone = 0;

        for(var j in $scope.folders[i].notes) {
          if ($scope.folders[i].notes[j].done) {
            $scope.folders[i].countDone++;
          }
        }
      }
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
    };

    $scope.showFolderOptions = function (folder) {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Update' },
          { text: 'Remove' }
        ],
        titleText: folder.title,
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          if (index === 0) {
            $state.go('app.folder', { folderId: folder._id, update: true })
          }
          if (index === 1) {
            FolderUtils.removeFolder(folder._id)
                .then(function (ok) {
                  getFolders();
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
