(function () {

  'use strict';

  angular
      .module('Note.markers')
      .controller('MarkersController', MarkersController);

  MarkersController.$inject = [
    '$scope', '$rootScope', '$state',
    '$cordovaDialogs',
    'MarkersUtils'
  ];

  function MarkersController($scope, $rootScope, $state,
                             $cordovaDialogs,
                             MarkersUtils) {
    $scope.search = {
      title: ''
    };

    getMarkers();
    function getMarkers() {
      MarkersUtils.getMarkers()
          .then(function (markers) {
            $scope.markers = markers;
          }, function (err) {
            console.log(err);
          })
    }

    $rootScope.$on('newMarkerCreated', function (event, marker) {
      var newMarker = {
        lat: marker.position.lat(),
        lng: marker.position.lng()
      };

      $cordovaDialogs.prompt('Enter title for new marker', 'New marker', ['Save', 'Cancel'], 'Home')
          .then(function (result) {
            if (result.buttonIndex != 1) {
              return $scope.search.title = '';
            }

            newMarker.title = result.input1;

            MarkersUtils.createMarker(newMarker)
                .then(function (ok) {
                  getMarkers();
                }, function (err) {
                  console.log(err);
                })
          });
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
    }
  }
})();
