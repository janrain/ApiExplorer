var angular = require('angular');
var flowOverviewResolvers = require('./resolvers/FlowOverviewResolvers')
var homeResolvers = require('./resolvers/HomeResolvers')
var schemaOverviewResolvers = require('./resolvers/SchemaOverviewResolvers')
var attributeOverviewResolvers = require('./resolvers/AttributeOverviewResolvers')
var selectSchemaResolvers = require('./resolvers/SelectSchemaResolvers')
window.jQuery = require('jquery')
require('bootstrap')
require('angular-breadcrumb');
require('angular-drag-and-drop-lists')

angular.module(
  'capi-ui',
  [
    'ncy-angular-breadcrumb',
    'dndLists',
    require('angular-loading-bar'),
    require('angular-sanitize'),
    require('angular-ui-bootstrap'),
    require('angular-ui-router'),
    require('ng-file-upload'),
  ]
)

.config(function($stateProvider, $httpProvider) {
  'ngInject';

  $stateProvider
    // This is just a placeholder, probably do something with this in the
    // future.
    .state('auth', {
      url: '',
      templateUrl: '/partials/login.html',
      controller: function() {},
      ncyBreadcrumb: {
        label: 'Welcome'
      }
    })
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'HomeCtrl',
      resolve: homeResolvers,
      ncyBreadcrumb: {
        label: 'Home'
      }
    })
    .state('flowOverview', {
      url: '/flows/:flow',
      templateUrl: '/partials/flowOverview.html',
      controller: 'FlowOverviewCtrl',
      resolve: flowOverviewResolvers,
      ncyBreadcrumb: {
        label: 'Flow Overview',
        parent: 'home'
      }
    })
    .state('fieldOverview', {
      url: '/flows/:flow/fields/:field',
      templateUrl: '/partials/fieldOverview.html',
      controller: 'FieldOverviewCtrl',
      ncyBreadcrumb: {
        label: 'Field: {{fieldName}}',
        parent: 'flowOverview'
      }
    })
    .state('formOverview', {
      url: '/flows/:flow/forms/:form',
      templateUrl: '/partials/formOverview.html',
      controller: 'FormOverviewCtrl',
      ncyBreadcrumb: {
        label: 'Form: {{form}}',
        parent: 'flowOverview'
      }
    })
    .state('fieldOverviewFromForm', {
      url: '/flows/:flow/forms/:form/fields/:field',
      templateUrl: '/partials/fieldOverview.html',
      controller: 'FieldOverviewCtrl',
      ncyBreadcrumb: {
        label: 'Field: {{fieldName}}',
        parent: 'formOverview'
      }
    })
    .state('schemaOverview', {
      url: '/schema/:schema',
      templateUrl: '/partials/schemaOverview.html',
      controller: 'SchemaOverviewCtrl',
      resolve: schemaOverviewResolvers,
      ncyBreadcrumb: {
        label: 'Schema: {{schema}}',
        parent: 'home'
      }
    })
    .state('attributeCreator', {
      url: '/schema/:schema/createAttribute',
      templateUrl: '/partials/attributeCreator.html',
      controller: 'AttributeCreatorCtrl',
      ncyBreadcrumb: {
        label: 'Create Attribute',
        parent: 'schemaOverview'
      }
    })
    .state('attributeOverview', {
      url: '/schema/:schema/attribute/:attribute',
      templateUrl: '/partials/attributeOverview.html',
      controller: 'AttributeOverviewCtrl',
      resolve: attributeOverviewResolvers,
      ncyBreadcrumb: {
        label: 'Attribute: {{attribute}}',
        parent: 'schemaOverview'
      }
    })
    .state('translations', {
      url: '/flows/:flow/translations',
      templateUrl: '/partials/translations.html',
      controller: 'TranslationsCtrl',
      ncyBreadcrumb: {
        label: 'Translations',
        parent: 'flowOverview'
      }
    })
    .state('mailTemplateOverview', {
      url: '/flows/:flow/mailTemplates/:template',
      templateUrl: '/partials/mailTemplateOverview.html',
      controller: 'MailTemplateCtrl',
      ncyBreadcrumb: {
        label: 'Mail Template',
        parent: 'flowOverview'
      }
    })
    .state('mailTemplatesImport', {
      url: '/flows/:flow/importMailTemplates',
      templateUrl: '/partials/mailTemplatesImport.html',
      controller: 'MailTemplatesImportCtrl',
      resolve: flowOverviewResolvers,
      ncyBreadcrumb: {
        label: 'Import Mail Templates',
        parent: 'flowOverview'
      }
    })
    .state('mailTemplatesExport', {
      url: '/flows/:flow/exportMailTemplates',
      templateUrl: '/partials/mailTemplatesExport.html',
      controller: 'MailTemplatesExportCtrl',
      resolve: flowOverviewResolvers,
      ncyBreadcrumb: {
        label: 'Export Mail Templates',
        parent: 'flowOverview'
      }
    })
    .state('addField', {
      url: '/flows/:flow/addField',
      templateUrl: '/partials/fieldOverview.html',
      controller: 'AddFieldCtrl',
      ncyBreadcrumb: {
        label: 'Add Field',
        parent: 'flowOverview'
      }
    })
    .state('collectNewData', {
      url: '/flows/:flow/collectNewData',
      templateUrl: '/partials/collectNewData.html',
      controller: 'CollectNewDataCtrl',
      ncyBreadcrumb: {
        label: 'Collect New Data',
        parent: 'flowOverview'
      }
    })
    .state('collectNewData.selectAttribute', {
      templateUrl: '/partials/collectNewData-selectAttribute.html',
      controller: 'CollectNewDataSelectAttributeCtrl',
      resolve: selectSchemaResolvers,
      ncyBreadcrumb: {
        label: 'Select Attribute',
        parent: 'collectNewData',
        skip: true
      },
      params: {
        flow: null
      }
    })
    .state('collectNewData.addAttribute', {
      templateUrl: '/partials/collectNewData-addAttribute.html',
      controller: 'CollectNewDataAttributeCreatorCtrl',
      ncyBreadcrumb: {
        label: 'Add Attribute',
        parent: 'collectNewData',
        skip: true
      },
      params: {
        flow: null,
        schemas: null
      }
    })
    .state('collectNewData.addAttributeStatus', {
      templateUrl: '/partials/collectNewData-addAttributeStatus',
      controller: 'CollectNewDataAddAttributeStatusCtrl',
      ncyBreadcrumb: {
        label: 'Add Attribute Status',
        parent: 'collectNewData',
        skip: true
      },
      params: {
        flow: null,
        schemas: null,
        attribute: null,
        results: null
      }
    })
    .state('collectNewData.addField', {
      templateUrl: '/partials/fieldOverview.html',
      controller: 'CollectNewDataAddFieldCtrl',
      ncyBreadcrumb: {
        label: 'Add Field',
        parent: 'collectNewData',
        skip: true
      },
      params: {
        flow: null,
        attribute: null
      }
    })
    .state('collectNewData.addToForm', {
      templateUrl: '/partials/collectNewData-addToForm.html',
      controller: 'CollectNewDataAddToFormCtrl',
      ncyBreadcrumb: {
        label: 'Add Field to Form',
        parent: 'collectNewData',
        skip: true
      },
      params: {
        flow: null,
        field: null
      }
    })

  var commonPutAndPostHeaders = {
    'Content-Type': 'application/json'
  }
  $httpProvider.defaults.headers.post = commonPutAndPostHeaders
  $httpProvider.defaults.headers.put = commonPutAndPostHeaders
})

require('./controllers')
require('./directives')
require('./services')
