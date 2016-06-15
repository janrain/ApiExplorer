'use strict';
var omit = require('lodash/object/omit');

module.exports = function($scope, $state, $stateParams, SchemaSvc) {
  'ngInject';

  $scope.schema = $stateParams.schema;
  $scope.attribute = {}

  $scope.create = function() {
    return SchemaSvc
      .addAttribute($scope.schema, $scope.attribute.name, $scope.attribute)
      .then(function() {
        $state.go('schemaOverview', { schema: $scope.schema })
      })
  }
}
