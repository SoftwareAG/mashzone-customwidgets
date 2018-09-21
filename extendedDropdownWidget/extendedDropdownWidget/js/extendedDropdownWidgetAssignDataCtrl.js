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
    /**
     * Controller for the Assign Data Dialog
     */
    .controller('extendedDropdownWidgetAssignDataCtrl', ['$scope', 'aggregationConstants', 'typeconstants', 'numberFormatConstants', 'formatNumberService',
        function ($scope, aggregationConstants, typeconstants, numberFormatConstants, formatNumberService) {
            $scope.itemClone.config.dataMapping && $scope.itemClone.config.dataMapping.visibleColumn ? $scope.selectedColumn = $scope.itemClone.config.dataMapping.visibleColumn : $scope.selectedColumn = null;
            $scope.selectedColumn = null;
            $scope.columnDeleted = function (column) {
                $scope.selectedColumn === column && delete $scope.selectedColumn
            };
            $scope.isVisibleColumn = function (column) {
                return !$scope.itemClone.config.dataMapping || !$scope.itemClone.config.dataMapping.furtherColumns || $scope.itemClone.config.dataMapping.furtherColumns.indexOf(column) < 0
            };
            $scope.columnSelectionHandler = function (column) {
                $scope.selectedColumn = column,
                    column.type == typeconstants.NUMBER && column.format && "" !== column.format && (column.format = formatNumberService.replaceSeperators(column.format))
            };
            
            $scope.isContextBased = function () {
                return void 0 != $scope.itemClone.context && $scope.itemClone.context.isConsumer
            };
            $scope.selectColumn = function (column) {
                return $scope.selectedColumn === column
            };



            $scope.clearSelection = function () {
                $scope.selectedColumn = null;
                $scope.showThresholdView = false;
            };

            // $scope.columnSelectionHandler = function (column, isSpecialColumnn, currentColumn) {
            //     $scope.clearSelection();
            //     if (column.type == 'NUMERIC' && !column.thresholds) {
            //         column.thresholds = angular.copy(thresholdConstants.defaultThresholds);
            //     }
            //     $scope.selectedColumn = column;
            //     if (isSpecialColumnn) {
            //         $scope.selectedColumn["isSpecialColumnn"] = isSpecialColumnn;
            //     } else {
            //         $scope.selectedColumn["isSpecialColumnn"] = undefined;
            //     }
            // };

            $scope.isDragEnabled = function (column) {
                return true;
            }

            /**
             * Is called after the user drops a column in the component configuration
             * @param column
             */
            $scope.columnDropHandler = function (column, allowThreshold) {
                column.newName = column.name;
                if (column.type === typeconstants.NUMBER) {
                    if (!column.aggregation) {
                        column.aggregation = aggregationConstants.NO;
                    }
                    if (!column.format) {
                        column.format = numberFormatConstants.NUMERIC_FORMAT_PATTERNS[0];
                    }
                    column.round = false;
                } else if (column.type === typeconstants.DATE) {
                    column.format = "yyyy-MM-dd'T'HH:mm:ss";
                }
                $scope.columnSelectionHandler(column);
            };
        }
    ]);