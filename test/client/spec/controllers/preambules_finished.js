'use strict';

describe('Controller: PreambulesFinishedCtrl', function () {

  // load the controller's module
  beforeEach(module('preambuleApp'));

  var PreambulesFinishedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreambulesFinishedCtrl = $controller('PreambulesFinishedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
