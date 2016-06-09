'use strict';

require('angular-mocks');
var angular = require('angular');
var sinon = require('sinon');

var keys = require('lodash/object/keys');

var defaultRegion = 'us';
var setRegion = 'eu';

describe('RegionSvc', function() {
  var RegionSvc;
  var RegionMap;
  var $rootScope;

  beforeEach(function() {
    angular.mock.module('capi-ui')
    angular.mock.inject(function(_RegionSvc_, _RegionMap_, _$rootScope_) {
      RegionSvc = _RegionSvc_;
      RegionMap = _RegionMap_;
      $rootScope = _$rootScope_
      sinon.spy($rootScope, '$broadcast');
    });
  });
  afterEach(function() {
    $rootScope.$broadcast.restore();
    window.localStorage.removeItem('capi-region');
  });

  describe('get', function() {
    it('should return the region', function() {
      var expected = defaultRegion;
      assert.deepEqual(RegionSvc.get(), expected);
    });
  });
  describe('url', function() {
    it('should return the region url', function() {
      var expected = RegionMap[defaultRegion];
      assert.deepEqual(RegionSvc.url(), expected);
    });
  });
  describe('url', function() {
    it('should return the regions', function() {
      var expected = keys(RegionMap);
      assert.deepEqual(RegionSvc.regions(), expected);
    });
  });
  describe('set', function() {
    it('should set the region and broadcast an event', function() {
      var expected = setRegion;
      RegionSvc.set(setRegion);
      sinon.assert.calledWith($rootScope.$broadcast, 'regionUpdated', expected);
      assert.strictEqual(
        window.localStorage.getItem('capi-region'),
        setRegion
      );
    });
  });
  describe('clear', function() {
    it('should clear the region and broadcast an event', function() {
      var expected = defaultRegion;
      window.sessionStorage.setItem(
        'capi-region',
        setRegion
      );
      RegionSvc.clear();
      sinon.assert.calledWith($rootScope.$broadcast, 'regionUpdated', expected);
      assert.strictEqual(window.localStorage.getItem('capi-region'), null);
      assert.deepEqual(RegionSvc.get(), expected);
    });
  });
});

describe('RegionSvc with state', function() {
  var RegionSvc;
  var $rootScope;

  beforeEach(function() {
    window.localStorage.setItem('capi-region', setRegion);
    angular.mock.module('capi-ui');
    angular.mock.inject(function(_$rootScope_) {
      $rootScope = _$rootScope_
      sinon.spy($rootScope, '$broadcast')
    });
    angular.mock.inject(function(_RegionSvc_) {
      RegionSvc = _RegionSvc_
    });
  });
  afterEach(function() {
    $rootScope.$broadcast.restore();
    window.localStorage.removeItem('capi-region');
  });

  describe('get', function() {
    it('should broadcast on init and return the region', function() {
      var expected = setRegion;
      sinon.assert.calledWith($rootScope.$broadcast, 'regionUpdated', expected);
      assert.deepEqual(RegionSvc.get(), expected);
    });
  });
});
