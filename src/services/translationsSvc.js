'use strict';
var sortBy = require('lodash/collection/sortBy');

module.exports = function(BasePathSvc, HttpSvc) {
  'ngInject';
  var basePath = BasePathSvc.getBasePath;


  this.getAll = function(flow) {
    return HttpSvc
      .get(basePath().concat([flow, 'translations']))
      .then(function(resp) {
        return sortBy(resp.data, 'path')
      });
  }

  this.update = function(flow, data) {
    return HttpSvc.patch(basePath().concat([flow, 'translations']), data)
  }

  return this;
}
