'use strict';

module.exports = function(CredentialSvc, HttpSvc) {
  'ngInject';

  var creds = CredentialSvc.get()
  var basePath = [
        'config',
    creds.appId,
    'flows'
  ]

  this.getAll = function(flow) {
    // A non localized endpoint sure would be nice.
    return HttpSvc.get(basePath.concat([flow, 'locales', 'en-US', 'mailTemplates']))
  }

  this.get = function(flow, locale, template) {
    return HttpSvc.get(basePath.concat([flow, 'locales', locale, 'mailTemplates', template]))
  }

  this.save = function(flow, locale, template, data) {
    return HttpSvc.put(basePath.concat([flow, 'locales', locale, 'mailTemplates', template]), data)
  }

  return this;
}
