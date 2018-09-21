/*
 * Copyright © 2017 - 2018 Software AG, Darmstadt, Germany and/or its licensors
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
angular.module('extendedDropdownWidgetModule')
  .controller('extendedDropdownWidgetCtrl', ['$scope', '$rootScope', 'lodashPromise_xdw', 'UtilX_xdw', 'jQuery_xdw', 'dashboardService', 'formatDateService', 'formatNumberService', 'thresholdConstants', 'thresholdService', 'selectionService', 'filterService', 'actionService', 'actionConstants', 'filteroperators',
    function ($scope, $rootScope, lodashPromise, UtilX, jQuery, dashboardService, formatDateService, formatNumberService, thresholdConstants, thresholdService, selectionService, filterService, actionService, actionConstants, filteroperators) {
      lodashPromise.then(function (_) {
        try {
          var isDebug = UtilX.debug("Extended dropdown widget controller loaded...");
          $scope.dataUpdateCount = 0;

          function initWidget() {
            if ($scope.config.autoRefresh === undefined) {
              $scope.config.autoRefresh = true;
            }
            $scope.activeSelection = {cols:[],values:[]};
            // a custom id will be generated to identify the root element of this widget
            $scope.customWidgetID = UtilX.generateUUID();

            $scope.colDefsByIdx = [];
            $scope.data=[];

            // delete $scope.config.properties;
            if (!$scope.config.properties) {
              $scope.config['properties'] = {};
            }
            if (!$scope.config.noSelectionEntry) {
              $scope.config['noSelectionEntry'] = "No selection";
            }
            if (!$scope.config.multipleSelectionEntry) {
              $scope.config['multipleSelectionEntry'] = false;
            }
            if ($scope.$parent.item.title == $scope.$parent.content.title) {
              $scope.title = "";
            } else {
              $scope.title = $scope.$parent.item.title;
            }
            $scope.$parent.item.hideHeader = true;
            $scope.$parent.item.hideBorder = true;
            $scope.showTitle = $scope.$parent.item.hideHeader;
          }

          $scope.setConfig = function (config) {
            UtilX.debug("setting config ", config, isDebug);
            $scope.config = config;
          };

          $scope.setData = function (data) {
            UtilX.debug("setting data called with ", [data, $scope], isDebug);
            if (!$scope.config.dataMapping) {
              console.warn("+-+- [" + $scope.customWidgetID + "] TTWW >> data not available for the chart ", $scope.config.dataMapping);
              return;
            }

            if (data && data.status == 'COMPLETE') {
              if (data.rows.length == 0) {
                console.warn("+-+- TTWW >> no data to be displayed...");
                $scope.data = [];
                $scope.dataUpdateCount += 1;
                // TODO: add something to show this to the user
                return;
              }
              // initialize column indexes needed later
              initIndexes(data);

              if ($scope.ddColumnIdx == -1) {
                console.warn("+-+- TTWW >> the category column is needed to display the charts...");
                // TODO: show some "missing configuration" in chart
                return;
              }
              // if a key column is provided, then reduce the data to only the unique keys
              var t0 = performance.now();
              if ($scope.keyColumnIdx != -1) {
                $scope.data = _.uniqBy(data.rows, function (d) {
                  return d.values[$scope.keyColumnIdx];
                });
              } else {
                $scope.data = _.uniqBy(data.rows, function (d) {
                  return d.values[$scope.ddColumnIdx];
                });
              }
              var t1 = performance.now();
              console.log("+-+- reducing data to unique keys took " + (t1 - t0) + " millis ", [data.rows.length, $scope.data.length]);
              if ($scope.config.sorting && $scope.config.sorting.column) {
                sortData();
              } else {
                $scope.dataUpdateCount += 1;
              }
            }
          };

          // $scope.onSelectionChange = function (row, triggerAction) {
          //   UtilX.debug("Selection changed...", null, isDebug);
          // }

          // $scope.textClicked = function () {
          //   var cols = [$scope.config.dataMapping.keyColumn.newName];
          //   var vals = [$scope.theValue];
          //   filterService.onSelectionChange($scope.item.identifier, cols, vals);
          //   actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_CLICK, cols, vals);
          // };

          $scope.$watch('$parent.item.hideHeader', function (newValue) {
            $scope.showTitle = $scope.$parent.item.hideHeader;
          });

          $scope.$watch('$parent.item.title', function (newValue) {
            if ($scope.$parent.item.title == $scope.$parent.content.title) {
              $scope.title = "";
            } else {
              $scope.title = $scope.$parent.item.title;
            }
          });
          $scope.$watch('config.sorting.column', function (newValue) {
            if ($scope.config.sorting) {
              if ($scope.config.sorting.column) {
                sortData();
              } else {
                $scope.config.sorting.isDesc = false;
              }
            }
            $scope.ready && $rootScope.$broadcast("dashboardDefinitionChanged");
          });
          $scope.$watch('config.sorting.isDesc', function (newValue) {
            if ($scope.config.sorting)
              $scope.config.sorting.column.sortDescending = newValue;
            if ($scope.config.sorting && $scope.config.sorting.column) {
              sortData();
            }
            $scope.ready && $rootScope.$broadcast("dashboardDefinitionChanged");
          });

          var sortData = function () {
            if ($scope.data) {
              $scope.data = _.orderBy($scope.data, function (d) {
                return d.values[$scope.config.sorting.column.idx]
              }, [$scope.config.sorting.isDesc ? "desc" : "asc"]);
              $scope.dataUpdateCount += 1;
            }
          }

          var initIndexes = function (data) {
            $scope.colDefsByIdx = [];
            $scope.ddColumnIdx = $scope.config.dataMapping.ddColumn ? UtilX.findWithAttr(data.columns, 'name', $scope.config.dataMapping.ddColumn.newName) : -1;
            if ($scope.ddColumnIdx != -1) {
              $scope.config.dataMapping.ddColumn["idx"] = $scope.ddColumnIdx;
              $scope.colDefsByIdx[$scope.ddColumnIdx] = $scope.config.dataMapping.ddColumn;
            }

            $scope.keyColumnIdx = $scope.config.dataMapping.keyColumn ? UtilX.findWithAttr(data.columns, 'name', $scope.config.dataMapping.keyColumn.newName) : -1;
            if ($scope.keyColumnIdx != -1) {
              $scope.config.dataMapping.keyColumn["idx"] = $scope.keyColumnIdx;
              $scope.colDefsByIdx[$scope.keyColumnIdx] = $scope.config.dataMapping.keyColumn;
            }

            $scope.furtherColumnsIdxs = $scope.config.dataMapping.furtherColumns.map(function (column) {
              var idx = UtilX.findWithAttr(data.columns, 'name', column.newName);
              column["idx"] = idx;
              $scope.colDefsByIdx[idx] = column;
              return {
                name: column.newName,
                index: idx
              };
            });
          }

          initWidget();
        } catch (error) {
          console.error("+-+- error on xdw ", error);
        }
      });
    }
  ]);