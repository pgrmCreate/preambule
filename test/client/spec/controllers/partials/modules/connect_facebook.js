'use strict';

describe('Controller: PartialsModulesConnectFacebookCtrl', function () {

  // load the controller's module
  beforeEach(module('preambuleApp'));

  var PartialsModulesConnectFacebookCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PartialsModulesConnectFacebookCtrl = $controller('PartialsModulesConnectFacebookCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
