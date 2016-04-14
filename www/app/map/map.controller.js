(function () {

  'use strict';

  angular
      .module('Note.map')
      .controller('MapController', MapController);

  MapController.$ineject = [
    '$scope', '$rootScope',
    '$state', '$stateParams'
  ];

  function MapController($scope, $rootScope,
                         $state, $stateParams) {
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 16});
    var marker;
    var isNewMarker = $stateParams.isNewMarker;

    init();
    function init() {
      navigator.geolocation.getCurrentPosition(function (pos) {

        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

        marker = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          title: "My Location"
        });

        $scope.map = map;
      });
    }

    google.maps.event.addListener(map, 'click', function (newMarker) {
      console.log(isNewMarker);
      marker.setMap(null);

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(newMarker.latLng.lat(), newMarker.latLng.lng()),
        map: map,
        title: "My marker"
      });

      if (isNewMarker) {
        console.log(1);
        $rootScope.$broadcast('newMarkerCreated', marker);

        $state.go('app.markers');
      }
    });
  }
})();
