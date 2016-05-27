'use strict';

module.exports = function($http, CredentialSvc, HttpSvc) {
  'ngInject';

  var creds = CredentialSvc.get()
  var basePath = [
        'config',
    creds.appId,
    'flows'
  ]

  this.getAll = function() {
    return HttpSvc.get(basePath)
  }

  this.get = function(flow) {
    return HttpSvc.get(basePath.concat([flow]))
  }

  return this;
}
