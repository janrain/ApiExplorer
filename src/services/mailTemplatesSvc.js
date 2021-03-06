'use strict';

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
    // A non localized endpoint sure would be nice.
    return HttpSvc.get(basePath().concat([flow, 'locales', 'en-US', 'mailTemplates']))
  }

  this.get = function(flow, locale, template) {
    return HttpSvc.get(basePath().concat([flow, 'locales', locale, 'mailTemplates', template]))
  }

  this.save = function(flow, locale, template, data) {
    return HttpSvc.put(basePath().concat([flow, 'locales', locale, 'mailTemplates', template]), data)
  }

  this.serialSave = function(flow, locale, template, data) {
    return HttpSvc.serialPut(basePath().concat([flow, 'locales', locale, 'mailTemplates', template]), data)
  }

  return this;
}
