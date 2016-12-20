'use strict';

module.exports = function(BasePathSvc, HttpSvc) {
  'ngInject';

  var basePath = BasePathSvc.getBasePath;


  this.getAll = function(flow) {
    return HttpSvc.get(basePath().concat([flow, 'locales']))
  }

  this.get = function(flow, locale) {
    return HttpSvc.get(basePath().concat([flow, 'locales', locale]))
  }

  return this;
}
