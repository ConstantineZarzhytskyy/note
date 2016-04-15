(function () {

  'use strict';

  angular
      .module('Note.markers')
      .controller('MarkersController', MarkersController);

  MarkersController.$inject = [
    '$scope', '$rootScope', '$state',
    '$cordovaDialogs', '$ionicActionSheet', '$ionicLoading',
    'MarkersUtils'
  ];

  function MarkersController($scope, $rootScope, $state,
                             $cordovaDialogs, $ionicActionSheet, $ionicLoading,
                             MarkersUtils) {
    $scope.getMarkers = getMarkers;
    $scope.search = {
      title: ''
    };

    getMarkers();
    function getMarkers() {
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>'
      });

      MarkersUtils.getMarkers()
          .then(function (markers) {
            $scope.markers = markers;

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
          }, function (err) {
            console.log(err);
          })
    }

    function changeLocationMarker(marker) {
      var params = {
        markerId: marker._id,
        markerTitle: marker.title,
        markerLat: marker.lat,
        markerLng: marker.lng,
        isEditMarker: true
      };

       $state.go('app.map', params);
    }

    function renameMarker(marker) {
      $cordovaDialogs.prompt('Enter new title for marker', 'Rename marker', ['Save', 'Cancel'], marker.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return; }

            marker.title = result.input1;

            MarkersUtils.updateMarker(marker)
                .then(function (ok) {
                  getMarkers();
                }, function (err) {
                  console.log(err);
                })
          });
    }

    function removeMarker(marker) {
      MarkersUtils.removeMarker(marker._id)
          .then(function (ok) {
            getMarkers();
          }, function (err) {
            console.log(err);
          });
    }

    $rootScope.$on('updateMarker', function (event, marker) {
      var updateMarker = {
        _id: marker._id,
        title: marker.title,
        lat: marker.position.lat(),
        lng: marker.position.lng()
      };

      MarkersUtils.updateMarker(updateMarker)
          .then(function (ok) {
            getMarkers();
          }, function (err) {
            console.log(err);
          })
    });

    $rootScope.$on('newMarkerCreated', function (event) {
      getMarkers();
    });

    $rootScope.$on('openSearchMarkerModal', function () {
      $cordovaDialogs.prompt('Enter search marker title', 'Search marker', ['Apply', 'Cancel'], $scope.search.title)
          .then(function (result) {
            if (result.buttonIndex != 1) { return $scope.search.title = ''; }

            $scope.search.title = result.input1;
          });
    });

    $scope.creteMarker = function () {
      $state.go('app.map', {isNewMarker: true});
    };

    $scope.showMarker = function (marker) {
      var params = {
        markerTitle: marker.title,
        markerLat: marker.lat,
        markerLng: marker.lng
      };

      $state.go('app.map', params)
    };

    $scope.showMarkerOptions = function (marker) {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Change location' },
          { text: 'Rename' },
          { text: 'Remove' }
        ],
        titleText: 'Modify your marker',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          if (index === 0) { changeLocationMarker(marker); }
          if (index === 1) { renameMarker(marker); }
          if (index === 2) { removeMarker(marker); }

          return true;
        }
      });
    };
  }
})();
