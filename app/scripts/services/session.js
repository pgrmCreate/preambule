'use strict';

angular.module('preambuleApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
