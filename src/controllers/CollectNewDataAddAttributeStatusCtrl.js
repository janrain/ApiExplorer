'use strict';
var pluck = require('lodash/collection/pluck');

module.exports = function($scope, $state, $stateParams, $q, SchemaSvc, UtilSvc) {
  'ngInject';

  var sFn = UtilSvc.scopeHelpers($scope)
  $scope.report = [];

  function init() {
    var results = $stateParams.results;
    var failure = [];
    var success = [];
    for (var i = 0; i < results.length; i++ ) {
      switch(results[i].status) {
        case 204:
          failure.push({
            message: results[i].data.success,
            success: true
          });
          break;
        default:
          success.push({
            message: results[i].data.errors,
            success: false
          });
      }
    }
    $scope.report = success.concat(failure);
  }

  $scope.back = function() {
    $state.go('collectNewData.addAttribute', {
      flow: $stateParams.flow,
      schemas: $stateParams.schemas
    });
  }

  $scope.retry = function() {
    console.log($stateParams);
    return $q.all( $stateParams.schemas.map( function(schema) {
      return SchemaSvc
        .addAttribute(schema, $stateParams.attribute.name, $stateParams.attribute)
        .then(function(result) {
          if(!result.data) {
            result.data = {
              success: $stateParams.attribute.name + " successfully added to " + schema + "."
            };
          }
          return result;
        });
    }))
    .then(function(results) {
      $state.go('collectNewData.addAttributeStatus', {
        flow: $stateParams.flow,
        schemas: $stateParams.schemas,
        attribute: $stateParams.attribute,
        results: results
      })
    })
    .catch(sFn.notifyErrorsAndReject);
  }

  $scope.continue = function() {
    $state.go('collectNewData.addField', {
      flow: $stateParams.flow,
      attribute: $stateParams.attribute
    });
  }

  init();
};
