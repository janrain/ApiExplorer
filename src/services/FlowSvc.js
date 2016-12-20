'use strict';

module.exports = function(BasePathSvc, HttpSvc) {
  'ngInject';

  var basePath = BasePathSvc.getBasePath;

  this.getAll = function() {
    return HttpSvc.get(basePath())
  }

  this.get = function(flow) {
    return HttpSvc.get(basePath().concat([flow]))
      .then(function(result) {
        if(result.data.schemas === undefined) result.data.schemas = ["user"];
        return result;
      });
  }

  this.save = function(flow, data) {
    return HttpSvc.put(basePath().concat([flow]), data)
  }

  return this;
}
