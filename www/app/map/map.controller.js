(function () {

  'use strict';

  angular
      .module('Note.map')
      .controller('MapController', MapController);

  MapController.$ineject = [
    '$scope', '$rootScope', '$state', '$stateParams',
    '$cordovaDialogs',
    'MarkersUtils'
  ];

  function MapController($scope, $rootScope, $state, $stateParams,
                         $cordovaDialogs,
                         MarkersUtils) {
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 16});
    var marker;
    var showMarker = {};
    var isNewMarker = !!($stateParams.markerId === undefined && $stateParams.isEditMarker);
    var markerId = $stateParams.markerId;
    var isEditMarker = ($stateParams.markerId && $stateParams.isEditMarker);

    getMarker(markerId);
    function getMarker(markerId) {
      if (!markerId) { showMarker = {}; return init(); }

      MarkersUtils.getMarker(markerId)
          .then(function (marker) {
            showMarker = marker;

            init();
          }, function (err) {
            console.log(err);
          });
    }

    function init() {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var optionMap = {
          title: "My Location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        if (showMarker.title) {
          optionMap.title = showMarker.title;
          optionMap.lat = showMarker.lat;
          optionMap.lng = showMarker.lng;
        }

        map.setCenter(new google.maps.LatLng(optionMap.lat, optionMap.lng));

        marker = new google.maps.Marker({
          position: new google.maps.LatLng(optionMap.lat, optionMap.lng),
          map: map,
          title: optionMap.title
        });

        $scope.map = map;
      });
    }

    function createMarker(marker) {
      var newMarker = {
        lat: marker.position.lat(),
        lng: marker.position.lng(),
        title: marker.title
      };

      MarkersUtils.createMarker(newMarker)
          .then(function (ok) {
            $rootScope.$broadcast('newMarkerCreated');

            $state.go($rootScope.$previousState, $rootScope.$previousParams);
          }, function (err) {
            console.log(err);
          })
    }

    google.maps.event.addListener(map, 'click', function (newMarker) {
      marker.setMap(null);

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(newMarker.latLng.lat(), newMarker.latLng.lng()),
        map: map,
        title: "My marker"
      });

      if (isNewMarker) {
        $cordovaDialogs.prompt('Enter title for new marker', 'New marker', ['Save', 'Cancel'], 'Home')
            .then(function (result) {
              if (result.buttonIndex != 1) { return marker.title = 'Home'; }

              marker.title = (!result.input1) ? marker.position.lat() + ':' +  marker.position.lng() : result.input1;

              createMarker(marker);
            });
      }
      if (isEditMarker) {
        marker._id = showMarker._id;
        marker.title = showMarker.title;

        $rootScope.$broadcast('updateMarker', marker);
        $state.go('app.markers')
      }
    });
  }
})();
