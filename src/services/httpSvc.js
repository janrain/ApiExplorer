'use strict';
var extend = require('lodash/object/extend');
var flow = require('lodash/function/flow');
var partial = require('lodash/function/partial');

module.exports = function($http, CredentialSvc, UtilSvc, CapiBaseDomain) {
  'ngInject';

  var creds = CredentialSvc.get()
  $http.defaults.headers.common.Authorization = UtilSvc.makeAuthHeader(creds)

  function toUrl(path) {
    return UtilSvc.urlize([CapiBaseDomain].concat(path))
  }

  function sendDataVia(method, path, data) {
    return $http[method](toUrl(path), data)
  }

  this.get = flow(toUrl, $http.get)
  this.delete = flow(toUrl, $http.delete)
  this.post = partial(sendDataVia, 'post')
  this.put = partial(sendDataVia, 'put')
  this.patch = partial(sendDataVia, 'patch')

  return this;
}
