'use strict';

require('angular').module('capi-ui')
.constant('RegionMap', require('./RegionMapCnst'))
.service('CredentialSvc', require('./CredentialSvc'))
.service('FileReaderSvc', require('./FileReaderSvc'))
.service('FieldMetaSvc', require('./fieldMetaSvc'))
.service('FieldSvc', require('./FieldSvc'))
.service('FlowSvc', require('./FlowSvc'))
.service('FormSvc', require('./formsSvc'))
.service('HttpSvc', require('./httpSvc'))
.service('LocaleSvc', require('./localesSvc'))
.service('MailTemplateSvc', require('./mailTemplatesSvc'))
.service('SchemaSvc', require('./SchemaSvc'))
.service('TranslationSvc', require('./translationsSvc'))
.service('UtilSvc', require('./UtilSvc'))
.service('RegionSvc', require('./RegionSvc'))
.service('ZipSvc', require('./ZipSvc'))
.service('NotificationsSvc', require('./NotificationsSvc'))
