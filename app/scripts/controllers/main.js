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

    $scope.searchText = "";
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
    });

    $scope.goBack = function () {
      $scope.detailsVisible = false;
    };

    // Grab address data from ArcGIS REST endpoint
    function getAddresses () {
      $scope.isLoading = true;
      var url = 'https://maranaegov.com/arcgis/rest/services/External/WhatsMyServiceArea/MapServer/1/query?where=ADDRESS+LIKE+%27%25' + $scope.searchText + '%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
      $http.get(url, {timeout: canceler.promise}).then(function (response) {
          response.data.features.map(function (item) {

            var waterCo = item.attributes.Water_Co;

            if (waterCo.toUpperCase().indexOf('MARANA') !== -1) {
              item.attributes.Water_Co = '<a href="http://maranaaz.gov/water" target="_blank">MARANA WATER</a>';
            }
            else if (waterCo.toUpperCase().indexOf('ORO') !== -1) {
              item.attributes.Water_Co = '<a href="https://www.orovalleyaz.gov/town/departments/water-utility" target="_blank">ORO VALLEY WATER</a>';
            }
            else if (waterCo.toUpperCase().indexOf('TUCSON') !== -1) {
              item.attributes.Water_Co = '<a href="https://www.tucsonaz.gov/water" target="_blank">TUCSON WATER</a>';
            }
            else if (waterCo.toUpperCase().indexOf('METRO') !== -1) {
              item.attributes.Water_Co = '<a href="http://www.metrowater.com" target="_blank">METRO WATER</a>';
            }
            else if (waterCo.toUpperCase().indexOf('AVRA') !== -1) {
              item.attributes.Water_Co = '<a href="http://www.avrawater.com" target="_blank">AVRA VALLEY WATER</a>';
            }

            var elecCo = item.attributes.ELEC_CO;

            if (elecCo.toUpperCase().indexOf('TEP') !== -1) {
                item.attributes.ELEC_CO = '<a href="https://www.tep.com/" target="_blank">TEP</a>';
            }
            else if (elecCo.toUpperCase().indexOf('TRICO') !== -1) {
              item.attributes.ELEC_CO = '<a href="https://www.trico.coop" target="_blank">TRICO</a>';
            }

            var fireDist = item.attributes.FIRE_DIST;

            if (fireDist.toUpperCase().indexOf('NORTHWEST') !== -1) {
              item.attributes.FIRE_DIST = '<a href="http://www.northwestfire.org" target="_blank">NORTHWEST FIRE</a>';
            }
            else if (fireDist.toUpperCase().indexOf('AVRA VALLEY') !== -1) {
              item.attributes.FIRE_DIST = '<a href="http://www.avfire.org" target="_blank">AVRA VALLEY FIRE</a>';
            }
            else if (fireDist.toUpperCase().indexOf('PICTURE ROCKS') !== -1) {
              item.attributes.FIRE_DIST = '<a href="http://www.picturerocksfire.org" target="_blank">PICTURE ROCKS FIRE</a>';
            }
            else if (fireDist.toUpperCase().indexOf('MOUNTAIN') !== -1) {
              item.attributes.FIRE_DIST = '<a href="http://www.mountainvistafire.org" target="_blank">MOUNTAIN VISTA FIRE</a>';
            }


            $scope.addresses.push(item.attributes);
          });
          $scope.isLoading = false;
      });
    }

  });
