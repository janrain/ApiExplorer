'use strict';

require('angular-mocks')
var angular = require('angular');
var sinon = require('sinon');
var helpers = require('../helpers')
var defaultRegion = require('../fixtures/defaultRegion')
var defaultRegionUrl = require('../fixtures/defaultRegionUrl')
var regions = require('../fixtures/regions')

describe('RegionsCtrl', function() {
  var locals;

  beforeEach(function() {
    angular.mock.module('capi-ui');
    angular.mock.inject(function($rootScope, $controller) {
      locals = {
        $scope: $rootScope.$new(),
        $state: helpers.make$StateStub(),
        RegionSvc: helpers.makeRegionSvcStub()
      }
      $controller('RegionsCtrl',locals)
    });
  });
  afterEach(function() {
    window.localStorage.removeItem('capi-region');
  });

  describe('initial state', function() {
    it('should set the scope regions and region', function() {
      sinon.assert.called(locals.RegionSvc.regions)
      sinon.assert.called(locals.RegionSvc.get)
      assert.equal(locals.$scope.regions, regions);
      assert.equal(locals.$scope.region, defaultRegion);
    });
  });
  describe('setRegion', function() {
    it('should set the region and update the scope', function() {
      var newRegion = 'eu';
      locals.$scope.setRegion(newRegion);
      sinon.assert.calledWithExactly(locals.RegionSvc.set, newRegion);
    });
  });
  describe('updateScopeRegion', function() {
    it('should update the scope on regionUpdated event', function() {
      var newRegion = 'eu';
      locals.$scope.$broadcast('regionUpdated', newRegion);
      assert.equal(locals.$scope.region, newRegion);
    });
  });
});
