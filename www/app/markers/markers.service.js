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
      createMarker: createMarker
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

    return service;
  }

})();
