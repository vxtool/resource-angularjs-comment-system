(function() {
  'use strict';

  angular
  .module('comments')
  .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', ];

  function IndexController($scope) {
    var vm = this;
  }
})();
