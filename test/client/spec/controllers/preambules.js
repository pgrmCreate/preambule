'use strict';

describe('Controller: PreambulesCtrl', function () {

  // load the controller's module
  beforeEach(module('preambuleApp'));

  var PreambulesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreambulesCtrl = $controller('PreambulesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
