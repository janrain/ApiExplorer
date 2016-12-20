'use strict';

module.exports = function(CredentialSvc) {
  'ngInject';

  var service = this;
  var creds = CredentialSvc.get();
  service.getBasePath = function () {
    return [
      'config',
      creds.appId,
      'flows'
    ];
  }

  service.getSchemaBasePath = function () {
   return [
      'config',
      creds.appId,
      'schemas'
    ];
  }

  return service;
}
