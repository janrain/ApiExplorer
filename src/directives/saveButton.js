'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    controller: 'SaveButtonCtrl',
    scope: {
      saveFn: '&',
      idleText: '@'
    },
    templateUrl: '/partials/saveButton.html'
  }
}
