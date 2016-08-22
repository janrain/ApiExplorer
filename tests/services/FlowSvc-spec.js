'use strict';
require('angular-mocks');
var angular = require('angular');
var sinon = require('sinon');
var helpers = require('../helpers');
var defaultCreds = require("../fixtures/credsDefault");
var flowOverview = require("../fixtures/flowOverview");
var flowBody = require("../fixtures/flow");

describe('FlowSvc', function() {
  var $q;
  var $rootScope;
  var basePath;
  var flow;
  var CredentialSvc;
  var HttpSvc;
  var FlowSvc;

  beforeEach(function() {
    angular.mock.module('capi-ui');
    angular.mock.inject(function(_CredentialSvc_, _HttpSvc_, _$q_, _$rootScope_) {
      CredentialSvc = helpers.makeCredentialSvcStub(_CredentialSvc_);
      CredentialSvc.get.returns(defaultCreds);
      HttpSvc = helpers.makeHttpSvcStub(_$q_, _HttpSvc_);
      $q = _$q_;
      $rootScope = _$rootScope_.$new();
    });
    angular.mock.inject(function(_FlowSvc_) {
      FlowSvc = _FlowSvc_;
    });
    basePath = ['config', defaultCreds.appId, 'flows'];
    flow = "myCoolFlow";
  });
  afterEach(function() {
    helpers.restoreCredentialSvc(CredentialSvc);
    helpers.restoreHttpSvc(HttpSvc);
  });
  describe('getAll', function() {
    it('HttpSvc is called with basePath', function() {
      FlowSvc.getAll();
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath);
    });
  });
  describe('get', function() {
    it('HttpSvc is called with flow name', function() {
      HttpSvc.get.returns($q.when({ data: flowOverview }));
      FlowSvc.get(flow);
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat([flow]));
    });
    it('get always returns schema list', function() {
      delete flowOverview.schemas;
      HttpSvc.get.returns($q.when({ data: flowOverview }));
      FlowSvc.get(flow)
        .then(function(result) {
          assert.isObject(result.data, "flow info is not an object");
          assert.property(result.data, 'schemas', "Schemas doesn't exist in the object");
          assert.isArray(result.data.schemas, "schemas is not a list");
          assert.lengthOf(result.data.schemas, 1, "schemas contains more or less than what we expected");
          assert.include(result.data.schemas, 'user', "schemas contains something other than 'user'");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat([flow]));
    });
    it('get returns schemas specified', function() {
      flowOverview.schemas = ["user", "myCoolSchema"];
      HttpSvc.get.returns($q.when({ data: flowOverview }));
      FlowSvc.get(flow)
        .then(function(result) {
          assert.isObject(result.data, "flow info is not an object");
          assert.property(result.data, 'schemas', "Schemas doesn't exist in the object");
          assert.isArray(result.data.schemas, "schemas is not a list");
          assert.lengthOf(result.data.schemas, 2, "schemas contains more or less than what we expected");
          assert.include(result.data.schemas, 'user', "schemas doesn't contain 'user'");
          assert.include(result.data.schemas, 'myCoolSchema', "schemas doesn't contain myCoolSchema");
        });
      $rootScope.$digest();
      sinon.assert.callCount(HttpSvc.get, 1);
      sinon.assert.calledWith(HttpSvc.get, basePath.concat([flow]));
    });
  });
  describe('save', function() {
    it('HttpSvc is called with flow name and flow body', function() {
      HttpSvc.put.returns($q.when({ data: null }));
      FlowSvc.save(flow, flowBody);
      sinon.assert.callCount(HttpSvc.put, 1);
      sinon.assert.calledWith(HttpSvc.put, basePath.concat([flow]), flowBody);
    });
  });
});
