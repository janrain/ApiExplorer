'use strict';

module.exports = function(UtilSvc, HttpSvc, BasePathSvc) {
  'ngInject';

  function basePath() {
    return [
      'meta',
      'fieldTypes'
    ]
  }

  this.getFieldTypes = function() {
    return HttpSvc.get(basePath())
  }

  this.getFieldTypeAttributes = function(type) {
    return HttpSvc.get(basePath().concat([type]))
  }

  return this;
}
