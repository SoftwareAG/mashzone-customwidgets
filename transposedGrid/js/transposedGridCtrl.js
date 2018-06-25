/*
 * Copyright © 2013 - 2018 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.                                                            
 *
 */
angular.module('transposedGridModule')

/**
 * Controller for the custom widget
 * The controller provides the widget variables and manages the interactions between data-model and view
 */
.controller('transposedGridCtrl', ['$scope', 'thresholdService', 'thresholdConstants', 'formatNumberService', 'lodash_tg', 'jQuery', 'UtilX_tg',
  function($scope, thresholdService, thresholdConstants, formatNumberService, _, jQuery, UtilX) {

    $scope.customWidgetID = UtilX.generateUUID();
    /**
     * The init function creates all necessary scope variables at widget start up time
     */
    var initWidget = function() {
      //Create a scope object "config" if not present already
      //$scope.config holds the data of the widget settings like the assigned column(s)
      if (!$scope.config) {
        $scope.config = {
          dataMapping: {
            gridDataColumns: []
          }
        };
      }

      //Define a property "assignedColumns" in the widget settings
      //to manage the information about the assigned column(s) in the controller
      if (!$scope.config.assignedColumns) {
        $scope.config.assignedColumns = {};
      }
      $scope.title = $scope.$parent.item.title;
    };

    /**
     * This function is called from the custom widget framework when the requested data from the server returns
     * @param feedResult The data for the assigned and server-requested data source columns
     */
    $scope.setData = function(feedResult) {
      var contents;
      if (feedResult) {
        $scope.data = [];
        if (feedResult.columns && feedResult.columns.length > 0) {
          feedResult.columns.forEach(function(col, idx) {
            $scope.data[idx] = {
              name: col.name,
              values: [col.name]
            }
          });
        }
        if (feedResult.rows && feedResult.rows.length > 0) {
          feedResult.rows.sort(function(a,b){
            return a.values[0] - b.values[0];
          });
          feedResult.rows.forEach(function(row) {
            row.values.forEach(function(value, valIdx) {
              if(feedResult.columns[valIdx].type == 'NUMERIC') {
                value = formatNumberService.formatNumberWithPattern(value, $scope.config.dataMapping.gridDataColumns[valIdx].format);
              }
              $scope.data[valIdx].values.push(value);
            });
          });
        }
        contents = "finished";
      } else {
        contents = "no data available";
      }
      $scope.contents = contents;
    };

    /**
     * This function loads the custom widget settings at widget start up time and stores it in the controller
     * @param config The persisted custom widget settings from the dashboard definition
     */
    $scope.setConfig = function(config) {
      $scope.config = config;
    };

    function checkThreshold(value, th) {
      var color;
      // TODO: check that the values defined in the thresholds are not NaN
      var thValue = parseFloat(th.value.value);
      if (!isNaN(value) && !isNaN(thValue)) switch (th.rule) {
        case thresholdConstants.LTEQ:
          if (value <= thValue) {
            color = th.colour;
          }
          break;
        case thresholdConstants.LT:
          if (value < thValue) {
            color = th.colour;
          }
          break;
        case thresholdConstants.GTEQ:
          if (value >= thValue) {
            color = th.colour;
          }
          break;
        case thresholdConstants.GT:
          if (value > thValue) {
            color = th.colour;
          }
          break;
        case thresholdConstants.BETWEEN:
          if (null != th.value2.value) {
            var thValue2 = parseFloat(th.value2.value);
            if (value < thValue && value > thValue2) {
              color = th.colour;
            }
          }
          break;
        case thresholdConstants.NOTBETWEEN:
          if (null != th.value2.value) {
            var thValue2 = parseFloat(th.value2.value);
            if (value > thValue || value < thValue2) {
              color = th.colour;
            }
          }
          break;
        case thresholdConstants.EQUALS:
          if (value == thValue) {
            color = th.colour;
          }
      }
      return color;
    };
    initWidget();
  }
]);