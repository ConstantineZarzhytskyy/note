(function () {

  'use strict';

  angular
      .module('Note.markers')
      .factory('MarkersUtils', MarkersUtils);

  MarkersUtils.$inject = [
    '$q', '$http',
    'server_host'
  ];

  function MarkersUtils($q, $http,
                        server_host) {
    var service = {
      getMarkers: getMarkers,
      createMarker: createMarker,
      updateMarker: updateMarker,
      removeMarker: removeMarker
    };

    function getMarkers() {
      var defer = $q.defer();

      $http.get(server_host + 'api/markers')
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function createMarker(marker) {
      var defer = $q.defer();

      $http.post(server_host + 'api/markers', { marker: marker })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function updateMarker(marker) {
      var defer = $q.defer();

      $http.put(server_host + 'api/markers/' + marker._id, { marker: marker })
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    function removeMarker(markerId) {
      var defer = $q.defer();

      $http.delete(server_host + 'api/markers/' + markerId)
          .success(defer.resolve)
          .error(defer.reject);

      return defer.promise;
    }

    return service;
  }

})();
