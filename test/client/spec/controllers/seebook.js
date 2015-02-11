'use strict';

describe('Controller: SeebookCtrl', function () {

  // load the controller's module
  beforeEach(module('preambuleApp'));

  var SeebookCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeebookCtrl = $controller('SeebookCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
