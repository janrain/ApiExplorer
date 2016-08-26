'use strict';
var omit = require('lodash/object/omit');

module.exports = function($scope, $state, $stateParams, $q, SchemaSvc, UtilSvc) {
  'ngInject';

  var sFn = UtilSvc.scopeHelpers($scope)

  $scope.flow = $stateParams.flow;
  $scope.schemas = $stateParams.schemas;
  $scope.attribute = {}

  $scope.create = function() {
    return $q.all( $scope.schemas.map( function(schema) {
      return SchemaSvc
        .addAttribute(schema, $scope.attribute.name, $scope.attribute)
        .then(function(result) {
          if(!result.data) {
            result.data = {
              success: $scope.attribute.name + " successfully added to " + schema + "."
            };
          }
          return result;
        });
    }))
    .then(function(results) {
      $state.go('collectNewData.addAttributeStatus', {
        flow: $scope.flow,
        schemas: $scope.schemas,
        attribute: $scope.attribute,
        results: results
      })
    })
    .catch(sFn.notifyErrorsAndReject);
  }
}
