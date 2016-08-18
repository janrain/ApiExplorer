'use strict';

require('angular-mocks')
var angular = require('angular');
var sinon = require('sinon');
var fieldDef = require('../fixtures/fieldDefinition')
var helpers = require('../helpers')
var pluck = require('lodash/collection/pluck');
var schemaAttributes = require('../fixtures/schemaAttributes');

function stub(returnVal) {
  return sinon.stub().returns(returnVal)
}

describe('FieldOverviewCtrl', function() {
  var $event
  var locals

  beforeEach(function() {
    angular.mock.module('capi-ui')
    angular.mock.inject(function($rootScope, $controller, $q, UtilSvc) {
      locals = {
        $scope: $rootScope.$new(),
        $stateParams: {
          flow: 'myflow',
          form: 'myform',
          field: 'myfield'
        },
        FieldSvc: helpers.makeFieldSvcStub($q),
        FlowSvc: helpers.makeFlowSvcStub($q),
        SchemaSvc: helpers.makeSchemaSvcStub($q),
        FieldMetaSvc: helpers.makeFieldMetaSvcStub($q),
        LocaleSvc: helpers.makeLocaleSvcStub($q)
      }
      $controller('FieldOverviewCtrl', locals);
      $event = {
        stopPropagation: sinon.spy(),
        preventDefault: sinon.spy()
      }
    });
  });
  describe('initial state', function() {
    it('should have the correct properties', function() {
      assert.strictEqual(locals.$scope.form, locals.$stateParams.form)
      assert.strictEqual(locals.$scope.fieldName, locals.$stateParams.field)
      assert.strictEqual(locals.$scope.emptyValue, '')
      assert.sameMembers(locals.$scope.locales, ['en-US'])
      assert.strictEqual(locals.$scope.selectedLocale, 'en-US')
      assert.deepEqual(locals.$scope.errors, {})
      assert.sameMembers(
        locals.$scope.validationFormats,
        [
          'alpha',
          'alphaExtended',
          'alphaExtendedSpaces',
          'alphaNumeric',
          'alphaNumericExtended',
          'email',
          'i18nAlphaNumeric',
          'noWhitespace',
          'numeric',
          'numericReal',
          'phone',
          'phoneInternational',
          'zipCode',
          'zipCode+4'
        ]
      )
      assert.deepEqual(locals.$scope.newValidation, { rule: '', value: null, message: '' })
      assert.deepEqual(locals.$scope.newOption, { label: '', value: '' })
      locals.$scope.$apply()
      assert.deepEqual(locals.$scope.field, fieldDef)
      assert.sameMembers(locals.$scope.schemaAttributes, pluck(schemaAttributes, "schemaAttribute"))
      assert.sameMembers(locals.$scope.fieldAttributes, ['foo', 'bar'])
      assert.sameMembers(locals.$scope.locales, ['en-US', 'it-IT'])
      assert.sameMembers(locals.$scope.allFields, ['signInEmailAddress', 'currentPassword'])
    });
  });
  describe('fieldSupports', function() {
    it('should return false if passed a value not in locals.$scope.fieldAttributes', function() {
      assert.isFalse(locals.$scope.fieldSupports('no way'))
    });
    it('should return true if passed a value in locals.$scope.fieldAttributes', function() {
      locals.$scope.fieldAttributes = ['some', 'cool', 'attrs']
      assert.isTrue(locals.$scope.fieldSupports('cool'))
    });
  });
  describe('getAllowedValidations', function() {
    it('should return the validations not already applied to the field', function() {
      var expected = [
        'blacklist',
        'format',
        'match',
        'unique',
        'whitelist'
      ]
      locals.$scope.field = {
        validation: [
          { rule: 'maxLength' },
          { rule: 'minLength' },
          { rule: 'required' }
        ]
      }
      assert.sameMembers(locals.$scope.getAllowedValidations(), expected)
    });
    it('should work even if validations are undefined', function() {
      var expected = [
        'blacklist',
        'format',
        'match',
        'maxLength',
        'minLength',
        'required',
        'unique',
        'whitelist'
      ]
      locals.$scope.field = {}
      assert.sameMembers(locals.$scope.getAllowedValidations(), expected)
    });
  });
  describe('save', function() {
    it('should call saveLocalized', function() {
      locals.$scope.save()
      sinon.assert.called(locals.FieldSvc.saveLocalized)
    });
  });
  describe('addOption', function() {
    it('should add a new option to a field and reset the newOption value', function() {
      var expected = {
        options: [
          {
            label: { values: { 'en-US': 'Foo' } },
            value: 'fooval'
          }, {
            label: { _self: null, values: { 'en-US': 'Bar' } },
            value: 'barval'
          }
        ]
      }
      locals.$scope.field = {
        options: [
          {
            label: { values: { 'en-US': 'Foo' } },
            value: 'fooval'
          }
        ]
      }
      locals.$scope.newOption = {
        label: 'Bar',
        value: 'barval'
      }
      locals.$scope.addOption()
      assert.deepEqual(locals.$scope.field, expected)
      assert.deepEqual(locals.$scope.newOption, { label: '', value: '' })
    });
    it("should add the options prop if it doesn't exist", function() {
      var expected = {
        options: [
          {
            label: { _self: null, values: { 'en-US': 'Bar' } },
            value: 'barval'
          }
        ]
      }
      locals.$scope.field = {}
      locals.$scope.newOption = {
        label: 'Bar',
        value: 'barval'
      }
      locals.$scope.addOption()
      assert.deepEqual(locals.$scope.field, expected)
    });
  });
  describe('addValidation', function() {
    it('should add a new validation to a field and reset the newOption value', function() {
      var expected = {
        validation: [
          {
            message: { values: { 'en-US': 'This is required.' } },
            rule: 'required',
            value: true
          }, {
            message: { _self: null, values: { 'en-US': 'Min length of 10.' } },
            rule: 'minLength',
            value: 10
          }
        ]
      }
      locals.$scope.field = {
        validation: [
          {
            message: { values: { 'en-US': 'This is required.' } },
            rule: 'required',
            value: true
          }
        ]
      }
      locals.$scope.newValidation = {
        message: 'Min length of 10.',
        rule: 'minLength',
        value: 10
      }
      locals.$scope.addValidation()
      assert.deepEqual(locals.$scope.field, expected)
      assert.deepEqual(locals.$scope.newValidation, { rule: '', message: '', value: null })
    });
    it("should add the validation prop if it doesn't exist", function() {
      var expected = {
        validation: [
          {
            message: { _self: null, values: { 'en-US': 'This is required.' } },
            rule: 'required',
            value: true
          }
        ]
      }
      locals.$scope.field = {}
      locals.$scope.newValidation = {
        message: 'This is required.',
        rule: 'required',
        value: true
      }
      locals.$scope.addValidation()
      assert.deepEqual(locals.$scope.field, expected)
    });
  });
  describe('removeOption', function() {
    it('should stop all further click event propegation', function() {
      locals.$scope.field = { options: [1, 2, 3, 4] }
      locals.$scope.removeOption(2, $event)
      sinon.assert.called($event.stopPropagation)
      sinon.assert.called($event.preventDefault)
    });
    it('should remove an element from the field options array', function() {
      locals.$scope.field = { options: [1, 2, 3, 4] }
      locals.$scope.removeOption(2, $event)
      assert.sameMembers(locals.$scope.field.options, [1, 2, 4])
    });
    it('should delete the options property if the last option is removed', function() {
      locals.$scope.field = { options: [1] }
      locals.$scope.removeOption(0, $event)
      assert.isUndefined(locals.$scope.field.options)
    });
  });
  describe('removeValidation', function() {
    it('should stop all further click event propegation', function() {
      locals.$scope.field = { validation: [1, 2, 3, 4] }
      locals.$scope.removeValidation(2, $event)
      sinon.assert.called($event.stopPropagation)
      sinon.assert.called($event.preventDefault)
    });
    it('should remove an element from the field validation array', function() {
      locals.$scope.field = { validation: [1, 2, 3, 4] }
      locals.$scope.removeValidation(2, $event)
      assert.sameMembers(locals.$scope.field.validation, [1, 2, 4])
    });
    it('should delete the validation property if the last validation is removed', function() {
      locals.$scope.field = { validation: [1] }
      locals.$scope.removeValidation(0, $event)
      assert.isUndefined(locals.$scope.field.validation)
    });
  });
});
