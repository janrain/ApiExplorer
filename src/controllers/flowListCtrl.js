'use strict';
var pluck = require('lodash/collection/pluck');

module.exports = function($scope, FlowSvc) {
  'ngInject';

  FlowSvc
    .getAll()
    .then(function(resp) {
      $scope.flowNames = pluck(resp.data, 'name')
    });
}
