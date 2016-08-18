'use strict';

var first = require('lodash/array/first');
var includes = require('lodash/collection/includes');

module.exports = function($scope, $stateParams, UtilSvc, FieldSvc, FieldMetaSvc, LocaleSvc, SchemaSvc) {
  'ngInject';

  var sFn = UtilSvc.scopeHelpers($scope);
  var flow = $stateParams.flow;

  $scope.locales = ['en-US'];
  $scope.selectedLocale = first($scope.locales);
  $scope.adding = true;
  $scope.field = {
    type: 'text'
  };
  SchemaSvc
    .get('user')
    .then(sFn.pluckPropToScope('schemaAttribute', 'schemaAttributes'));
  FieldMetaSvc
    .getFieldTypes()
    .then(sFn.pluckNameToScope('fieldTypes'));
  LocaleSvc
    .getAll(flow)
    .then(sFn.pluckNameToScope('locales'));

  $scope.fieldSupports = function(attr) {
    // Hide the validation tab on field creation.
    if (attr === 'validation') return false
    return includes($scope.fieldAttributes, attr)
  }

  $scope.updateFieldAttributes = function() {
    FieldMetaSvc
      .getFieldTypeAttributes($scope.field.type)
      .then(function(resp) {
        $scope.fieldAttributes = resp.data
      });
  }

  $scope.save = function() {
    $scope.errors = {};
    return FieldSvc
      .addLocalized(
        flow,
        $scope.selectedLocale,
        UtilSvc.unpackTranslations($scope.selectedLocale, $scope.field))
      .catch(sFn.grabErrorsAndReject)
  }

  $scope.updateFieldAttributes()
};
