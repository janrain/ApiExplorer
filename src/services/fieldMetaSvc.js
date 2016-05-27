'use strict';

module.exports = function(UtilSvc, $http) {
  'ngInject';

  var basePath = [
    'meta',
    'fieldTypes'
  ]

  this.getFieldTypes = function() {
    return $http.get(UtilSvc.urlize(basePath))
  }

  this.getFieldTypeAttributes = function(type) {
    return $http.get(UtilSvc.urlize(basePath.concat([type])))
  }

  return this;
}
