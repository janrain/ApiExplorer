'use strict';

require('angular-mocks')
var angular = require('angular');
var sinon = require('sinon');
var helpers = require('../helpers')
var pluck = require('lodash/collection/pluck');
var schemaAttributes = require('../fixtures/schemaAttributes');

function stub(returnVal) {
  return sinon.stub().returns(returnVal)
}

describe('AddFieldCtrl', function() {
  var $q
  var locals

  beforeEach(function() {
    angular.mock.module('capi-ui')
    angular.mock.inject(function($rootScope, $controller, _$q_, UtilSvc) {
      $q = _$q_
      locals = {
        $scope: $rootScope.$new(),
        $stateParams: { flow: 'myflow' },
        FieldSvc: helpers.makeFieldSvcStub($q),
        FieldMetaSvc: helpers.makeFieldMetaSvcStub($q),
        FlowSvc: helpers.makeFlowSvcStub($q),
        LocaleSvc: helpers.makeLocaleSvcStub($q),
        SchemaSvc: helpers.makeSchemaSvcStub($q)
      }
      $controller('AddFieldCtrl', locals)
    });
  });
  describe('initial state', function() {
    it('should have the expected properties', function() {
      assert.sameMembers(locals.$scope.locales, [ 'en-US' ])
      assert.strictEqual(locals.$scope.selectedLocale, 'en-US')
      assert.isTrue(locals.$scope.adding)
      assert.deepEqual(locals.$scope.field, { type: 'text' })
      locals.$scope.$apply()
      assert.sameMembers(locals.$scope.schemaAttributes, pluck(schemaAttributes, "schemaAttribute"))
      assert.sameMembers(locals.$scope.fieldTypes, ['foo', 'bar'])
      assert.sameMembers(locals.$scope.locales, [ 'en-US', 'it-IT' ])
      assert.sameMembers(locals.$scope.fieldAttributes, ['foo', 'bar'])
    });
  });
  describe('fieldSupports', function() {
    it('should return false if passed "validation"', function() {
      assert.isFalse(locals.$scope.fieldSupports('validation'))
    });
    it('should return true if passed a value in locals.$scope.fieldAttributes', function() {
      locals.$scope.fieldAttributes = ['some', 'cool', 'attrs']
      assert.isTrue(locals.$scope.fieldSupports('cool'))
    });
  });
  describe('save', function() {
    it('should reset any errors on locals.$scope', function() {
      locals.$scope.errors = { foo: 'bar' }
      locals.$scope.save()
      assert.deepEqual(locals.$scope.errors, {})
    });
    it('should save the field', function() {
      locals.$scope.save()
      locals.$scope.$apply()
      sinon.assert.calledWith(locals.FieldSvc.addLocalized, 'myflow', 'en-US', { type: 'text' })
    });
    it('should set errors on the scope if something bad happens', function() {
      locals.FieldSvc.addLocalized.returns($q.reject({ data: { errors: 'oh no!' } }))
      locals.$scope.save()
      locals.$scope.$apply()
      assert.strictEqual(locals.$scope.errors, 'oh no!')
    });
  });
});
