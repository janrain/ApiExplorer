'use strict';

module.exports = function(BasePathSvc, HttpSvc) {
  'ngInject';

  var basePath = BasePathSvc.getBasePath;


  this.getAll = function(flow) {
    return HttpSvc.get(basePath().concat([flow, 'forms']))
  }

  this.get = function(flow, form) {
    return HttpSvc.get(basePath().concat([flow, 'forms', form]))
  }

  this.save = function(flow, form, data) {
    return HttpSvc.put(basePath().concat([flow, 'forms', form]), data)
  }

  return this;
}
