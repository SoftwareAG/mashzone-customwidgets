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
angular.module('extendedLabelWidgetModule')

/**
 * Controller for the Assign Data Dialog
 */
.controller('extendedLabelWidgetAssignDataCtrl',['$scope', 'aggregationConstants', 'typeconstants', 'numberFormatConstants', 'thresholdConstants',
    function($scope, aggregationConstants, typeconstants, numberFormatConstants, thresholdConstants) {
        $scope.selectedColumn = null;

        $scope.clearSelection = function() {
            $scope.selectedColumn = null;
        };
        
        $scope.columnSelectionHandler = function(column) {
            $scope.clearSelection();
            // if (column.type == 'NUMERIC' && !column.aggregation) {
            // }
            $scope.selectedColumn = column;

        };
        
        /**
         * Is called after the user drops a column in the component configu
         * @param column
         */
        $scope.columnDropHandler = function(column, allowThreshold) {
            column.newName = column.name;
            if(column.type === typeconstants.NUMBER){
                if(!column.aggregation) {
                    column.aggregation = aggregationConstants.NO;
                }
                if(!column.format) {
                    column.format = numberFormatConstants.NUMERIC_FORMAT_PATTERNS[0];
                }
                column.round = false;
            } else if(column.type === typeconstants.DATE){
                column.format = "yyyy-MM-dd'T'HH:mm:ss";
            }
            $scope.columnSelectionHandler(column, allowThreshold);
        };

        /**
         * Is called if the user clicks on the trash icon of a column
         * @param column The column that should be deleted
         */
        $scope.columnDeleted = function(column) {
            if ($scope.selectedColumn === column) {
                delete $scope.selectedColumn;
                // TODO: what happens when more than one column are configured with thresholds?
                // $scope.itemClone.config.properties.thresholdConfig.thresholds = angular.copy(thresholdConstants.defaultThresholds);
            }
        };

        /**
         * Indicates if a column should be marked as selected
         * @param column The column to check
         * @returns {boolean} true if the column should be selected, otherwise false
         */
        $scope.isSelected = function(column) {
            return $scope.selectedColumn === column;
        };
    }]);
