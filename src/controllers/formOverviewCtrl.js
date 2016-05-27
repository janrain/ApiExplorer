'use strict';
var pluck = require('lodash/collection/pluck');
var each = require('lodash/collection/each');
var first = require('lodash/array/first');
var difference = require('lodash/array/difference');
var map = require('lodash/collection/map');

module.exports = function($scope, $stateParams, UtilSvc, FieldSvc, FormSvc, LocaleSvc) {
  'ngInject';

  var sFn = UtilSvc.scopeHelpers($scope)
  var flow = $stateParams.flow
  var form = $stateParams.form

  function loadFields() {
    each($scope.formFields, function(field) {
      FieldSvc
        .get(flow, field)
        .then(function(resp) {
          $scope.formFieldDefs.push(resp.data)
        });
    });
  }

  function getFormFields() {
    return {
      'fields': map($scope.formFields, function(field) {
        return { 'name': field }
      })
    };
  }

  $scope.flow = flow
  $scope.form = form
  $scope.formFields = []
  $scope.allFields = []
  $scope.formFieldDefs = []
  $scope.fieldToAdd = undefined;
  $scope.locales = ['en-US']
  $scope.selectedLocale = first($scope.locales)

  FormSvc
    .get(flow, form)
    .then(function(resp) {
      $scope.formFields = pluck(resp.data.fields, 'name')
    })
    .then(loadFields);
  LocaleSvc
    .getAll(flow)
    .then(sFn.pluckNameToScope('locales'));
  FieldSvc
    .getAll(flow)
    .then(sFn.pluckNameToScope('allFields'));

  $scope.addableFields = function() {
    return difference($scope.allFields, $scope.formFields);
  }

  $scope.save = function() {
    $scope.errors = {};
    return FormSvc
      .save(
        flow,
        form,
        getFormFields())
      .catch(sFn.grabErrorsAndReject);
  }

  $scope.addField = function() {
    if (!$scope.fieldToAdd) return
    $scope.formFields.push($scope.fieldToAdd)
  }

  $scope.removeField = function($index) {
    $scope.formFields.splice($index, 1);
  }
}
