'use strict';

describe('Controller: SeepreambuleCtrl', function () {

  // load the controller's module
  beforeEach(module('preambuleApp'));

  var SeepreambuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeepreambuleCtrl = $controller('SeepreambuleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
