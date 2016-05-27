'use strict';
var pluck = require('lodash/collection/pluck');

module.exports = function($scope, $stateParams, $sce, LocaleSvc, MailTemplateSvc) {
  'ngInject';

  var flow = $stateParams.flow
  var template = $stateParams.template
  $scope.selectedLocale = 'en-US';
  LocaleSvc
    .getAll(flow)
    .then(function(resp) {
      $scope.locales = pluck(resp.data, 'name')
    });

  $scope.getMailTemplate = function() {
    console.log($scope.selectedLocale)
    return MailTemplateSvc
      .get(flow, $scope.selectedLocale, template)
      .then(function(resp) {
        console.log("got:", resp.data)
        $scope.mailTemplate = resp.data
      });
  }

  $scope.getMailTemplate()

  $scope.isSafeHtml = function() {
    if (!$scope.mailTemplate) return false
    try {
      return !!$sce.getTrustedHtml($scope.mailTemplate.htmlBody);
    } catch(e) {
      return false
    }
  }

  function idleSaveButton() {
    $scope.saveButtonText = "Save Field"
    $scope.saveButtonDisabled = false;
    $scope.saveButtonClasses = [
      'btn',
      'btn-primary',
      'btn-lg',
      'btn-block'
    ]
  }

  function workingSaveButton() {
    $scope.saveButtonText = "Saving..."
    $scope.saveButtonDisabled = true;
    $scope.saveButtonClasses = [
      'btn',
      'btn-primary',
      'btn-lg',
      'btn-block'
    ]
  }

  function successSaveButton() {
    $scope.saveButtonText = "Success!"
    $scope.saveButtonDisabled = false;
    $scope.saveButtonClasses = [
      'btn',
      'btn-success',
      'btn-lg',
      'btn-block'
    ]
    $timeout(idleSaveButton, 2000);
  }

  $scope.save = function() {
    $scope.errors = {};
    workingSaveButton();
    MailTemplateSvc
      .save(
        flow,
        $scope.selectedLocale,
        template,
        $scope.mailTemplate)
      .then(successSaveButton)
      .catch(function(resp) {
        // There's much that can be done with these :)
        $scope.errors = resp.data.errors;
        idleSaveButton();
      });
  }
  idleSaveButton()
};
