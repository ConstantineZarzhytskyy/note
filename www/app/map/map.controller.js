(function () {

  'use strict';

  angular
      .module('Note.map')
      .controller('MapController', MapController);

  MapController.$ineject = [
    '$scope'
  ];

  function MapController($scope) {
    var map;

    navigator.geolocation.getCurrentPosition(function(pos) {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });

      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "My Location"
      });

      $scope.map = map;
    });
  }
})();
