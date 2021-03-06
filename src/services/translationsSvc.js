'use strict';
var sortBy = require('lodash/collection/sortBy');

module.exports = function(CredentialSvc, HttpSvc) {
  'ngInject';

  function basePath() {
    var creds = CredentialSvc.get()
    return [
      'config',
      creds.appId,
      'flows'
    ];
  }

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
