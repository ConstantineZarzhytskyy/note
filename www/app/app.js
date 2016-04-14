(function () {

  'use strict';

  angular
      .module('Note', [
        'ionic',
        'ionic.service.core',
        'satellizer',
        'ngCordova',
        'Note.menu',
        'Note.auth',
        'Note.notes',
        'Note.note',
        'Note.folders',
        'Note.folder',
        'Note.map',
        'Note.markers'
      ]);
})();
