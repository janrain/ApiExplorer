'use strict';
require('angular-mocks');
var angular = require('angular');
var sinon = require('sinon');
var helpers = require('../helpers');
var defaultCreds = require("../fixtures/credsDefault");
var schemaAttributes = require("../fixtures/schemaAttributes");

describe('SchemaSvc', function() {
  var $q;
  var $rootScope;
  var basePath;
  var schema;
  var attribute;
  var CredentialSvc;
  var HttpSvc;
  var SchemaSvc;

  beforeEach(function() {
    angular.mock.module('capi-ui');
    angular.mock.inject(function(_CredentialSvc_, _HttpSvc_, _$q_, _$rootScope_) {
      CredentialSvc = helpers.makeCredentialSvcStub(_CredentialSvc_);
      CredentialSvc.get.returns(defaultCreds);
      HttpSvc = helpers.makeHttpSvcStub(_$q_, _HttpSvc_);
      $q = _$q_;
      $rootScope = _$rootScope_.$new();
    });
    angular.mock.inject(function(_SchemaSvc_) {
      SchemaSvc = _SchemaSvc_;
    });
    basePath = ['config', defaultCreds.appId, 'schemas'];
    schema = "foo";
    attribute = "bar";
  });
  afterEach(function() {
    helpers.restoreCredentialSvc(CredentialSvc);
    helpers.restoreHttpSvc(HttpSvc);
  });
  describe('getAll', function() {
    it('httpSvc is called with basePath', function() {
      SchemaSvc.getAll();
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath);
    });
  });
  describe('get', function() {
    it('HttpSvc.get is called with schema name', function() {
      SchemaSvc.get(schema);
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat([schema]));
    });
  });
  describe('getAllIntersect', function() {
    it('no schemas is an empty list', function() {
      SchemaSvc.getAllIntersect([])
        .then(function(result) {
          assert.isArray(result.data, "We don't have an array!");
          assert.lengthOf(result.data, 0, "The list isn't empty!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 0);
    });
    it('one schema returns all attributes', function() {
      HttpSvc.get.returns($q.when({ data: schemaAttributes }));
      SchemaSvc.getAllIntersect(["schema1"])
        .then(function(result) {
          assert.deepEqual(result.data, schemaAttributes, "It's not what we expected!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema1"]));
    });
    it('two identical schemas returns all attributes', function() {
      HttpSvc.get.onCall(0).returns($q.when({ data: schemaAttributes }));
      HttpSvc.get.onCall(1).returns($q.when({ data: schemaAttributes }));
      SchemaSvc.getAllIntersect(["schema1", "schema2"])
        .then(function(result) {
          assert.deepEqual(result.data, schemaAttributes, "It's not what we expected!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 2);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema1"]));
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema2"]));
    });
    it('two similar schemas return similarities', function() {
      HttpSvc.get.onCall(0).returns($q.when({ data: schemaAttributes.slice(0,5) }));
      HttpSvc.get.onCall(1).returns($q.when({ data: schemaAttributes.slice(2) }));
      SchemaSvc.getAllIntersect(["schema1", "schema2"])
        .then(function(result) {
          assert.deepEqual(result.data, schemaAttributes.slice(2,5), "It's not what we expected!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 2);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema1"]));
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema2"]));
    });
    it('two disimilar schemas return no attributes', function() {
      HttpSvc.get.onCall(0).returns($q.when({ data: schemaAttributes.slice(0,4) }));
      HttpSvc.get.onCall(1).returns($q.when({ data: schemaAttributes.slice(4) }));
      SchemaSvc.getAllIntersect(["schema1", "schema2"])
        .then(function(result) {
          assert.isArray(result.data, "We don't have an array!");
          assert.lengthOf(result.data, 0, "The list isn't empty!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 2);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema1"]));
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema2"]));
    });
    it('three or more schemas return similarities', function() {
      HttpSvc.get.onCall(0).returns($q.when({ data: schemaAttributes.slice(0,5) }));
      HttpSvc.get.onCall(1).returns($q.when({ data: schemaAttributes.slice(4) }));
      HttpSvc.get.onCall(2).returns($q.when({ data: schemaAttributes.slice(2,7) }));
      SchemaSvc.getAllIntersect(["schema1", "schema2", "schema3"])
        .then(function(result) {
          assert.deepEqual(result.data, schemaAttributes.slice(4,5), "It's not what we expected!");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 3);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema1"]));
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema2"]));
      sinon.assert.calledWith(HttpSvc.get, basePath.concat(["schema3"]));
    });
  });
  describe('getAttribute', function() {
    it('HttpSvc.get is called with schema and attribute', function() {
      SchemaSvc.getAttribute(schema, attribute);
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat([schema, attribute]));
    });
  });
  describe('addAttribute', function() {
    it('HttpSvc.put is called with schema and attribute', function() {
      var attribute_def = { type: "string" };
      SchemaSvc.addAttribute(schema, attribute, attribute_def);
      sinon.assert.callCount(HttpSvc.put, 1);
      sinon.assert.calledWith(HttpSvc.put, basePath.concat([schema, attribute]), attribute_def);
    });
  });
  describe('deleteAttribute', function() {
    it('HttpSvc.delete is called with schema and attribute', function() {
      SchemaSvc.deleteAttribute(schema, attribute);
      sinon.assert.callCount(HttpSvc.delete, 1);
      sinon.assert.calledWith(HttpSvc.delete, basePath.concat([schema, attribute]));
    });
  });
});
