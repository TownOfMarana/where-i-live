'use strict';

/**
 * @ngdoc function
 * @name whereILiveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whereILiveApp
 */
angular.module('whereILiveApp')
  .controller('MainCtrl', function ($scope, $http, $q) {

    var canceler = $q.defer();

    $scope.searchText = "11555";
    $scope.addresses = [];
    $scope.isLoading = false;
    $scope.selectedAddress = null;
    $scope.detailsVisible = false;

    // When a user clicks on a address result. Show details.
    $scope.showAddressData = function (address) {
      $scope.selectedAddress = address;
      $scope.detailsVisible = true;
    };

    // Watch for changes in search text box
    $scope.$watch('searchText', function (newVal) {
      $scope.detailsVisible = false;
      $scope.addresses = [];

      if ($scope.isLoading) {
        canceler.resolve();
        canceler = $q.defer();
        $scope.isLoading = false;
      }

      if (newVal) {
        getAddresses();
      }
    })

    // Grab address data from ArcGIS REST endpoint
    function getAddresses () {
      $scope.isLoading = true;
      var url = 'http://maranaegov.com/arcgis/rest/services/External/WhatsMyServiceArea/MapServer/1/query?where=ADDRESS+LIKE+%27%25' + $scope.searchText + '%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'
      $http.get(url, {timeout: canceler.promise}).then(function (response) {
          response.data.features.map(function (item) {
            $scope.addresses.push(item.attributes);
          });
          $scope.isLoading = false;
      });
    }

  });
