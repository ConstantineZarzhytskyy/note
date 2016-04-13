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
    function getFolders(folderId) {
      FolderUtils.getFolder(folderId)
          .then(function (folder) {
            $scope.folder = folder;

            console.log(folder);
          }, function (err) {
            console.log(err);
          });
    }
  }
})();
