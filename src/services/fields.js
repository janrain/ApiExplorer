'use strict';

module.exports = function(CredentialSvc, HttpSvc) {
  var creds = CredentialSvc.get()
  var basePath = [
    'beta',
    'config',
    creds.appId,
    'flows'
  ]

  this.getAll = function(flow) {
    return HttpSvc.get(basePath.concat([flow, 'fields']))
  }

  this.get = function(flow, field) {
    return HttpSvc.get(basePath.concat([flow, 'fields', field]))
  }

  this.saveLocalized = function(flow, locale, field, field_def) {
    return HttpSvc.put(basePath.concat([flow, 'locales', locale, 'fields', field]), field_def)
  }

  return this;
}