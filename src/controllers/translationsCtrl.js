'use strict';
var pluck = require('lodash/collection/pluck');
var includes = require('lodash/collection/includes');

module.exports = function($scope, $stateParams, UtilSvc, LocaleSvc, TranslationSvc) {
  'ngInject';

  var sFn = UtilSvc.scopeHelpers($scope)
  var flow = $stateParams.flow
  $scope.referenceLocale = 'en-US'
  $scope.selectedLocale = 'en-US'
  $scope.trFilter = ''

  LocaleSvc
    .getAll(flow)
    .then(function(resp) {
      $scope.locales = pluck(resp.data, 'name')
    });
  TranslationSvc
    .getAll(flow)
    .then(sFn.assignTo('translations'))

  $scope.save = function() {
    $scope.errors = {};
    // Optimize this later to only send what changed.
    return TranslationSvc
      .update(flow, $scope.translations)
      .catch(sFn.grabErrorsAndReject);
  }

  $scope.matchesSearch = function(keyOrPath) {
    if ($scope.trFilter === '') return true;
    return includes(keyOrPath.toLowerCase(), $scope.trFilter);
  }
}
