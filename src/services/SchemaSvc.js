'use strict';

var pluck = require('lodash/collection/pluck');
var intersect = require('lodash/array/intersection');

module.exports = function(CredentialSvc, HttpSvc, $q) {
  'ngInject';

  var self = this;

  function basePath() {
    var creds = CredentialSvc.get()
    return [
      'config',
      creds.appId,
      'schemas'
    ];
  }

  // Since lodash 3.10.1 doesn't have intersectionBy, we'll need to create our own
  // Remove this when we move to lodash 4.14.1+
  function intersectionBy(results, property) {
    if(results.length <= 0) return [];
    // pull a list of the specified property and intesect on those
    var propIntersect = intersect.apply(this,
      results.map(function(result) {
        return result.data.map(function(attr) {
          return attr[property];
        });
    }));

    // Build an array of the matching objects
    var result = [];
    var baseSchema = results[0].data;
    for(var i = 0; i < baseSchema.length; i++) {
      if(propIntersect.indexOf(baseSchema[i][property]) != -1) {
        result = result.concat([baseSchema[i]]);
      }
    }

    return result;
  }

  this.getAll = function() {
    return HttpSvc.get(basePath())
  }

  this.get = function(schema) {
    return HttpSvc.get(basePath().concat([schema]))
  }

  this.getAllIntersect = function(schemas) {
      return $q.all(schemas.map(self.get))
        .then(function(results) {
          return { data: intersectionBy(results, 'schemaAttribute') };
        });
  }

  this.getAttribute = function(schema, attribute) {
    return HttpSvc.get(basePath().concat([schema, attribute]))
  }

  this.addAttribute = function(schema, attribute, attribute_def) {
    return HttpSvc.put(basePath().concat([schema, attribute]), attribute_def)
  }

  this.deleteAttribute = function(schema, attribute) {
    return HttpSvc.delete(basePath().concat([schema, attribute]))
  }

  return this;
}
