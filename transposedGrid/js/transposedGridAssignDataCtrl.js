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
angular.module('transposedGridModule')

    /**
     * Controller for the Assign data dialog
     */
    .controller('transposedGridAssignDataCtrl',['$scope','aggregationConstants','typeconstants','numberFormatConstants', 
        function($scope, aggregationConstants, typeconstants, numberFormatConstants){

            /**
             * This function changes the selection state of a column.
             * A column selection triggers the loading of the matching configuration view template.
             * @param column The column that is to be selected
             */
            $scope.columnSelectionHandler = function(column) {
                $scope.selectedColumn = column;
            };

            /**
             * This function is called when a column was dropped in the assign data view template.
             * According to the column data type the column configuration will be predefined.
             * @param column The column that was dropped
             */
            $scope.columnDropHandler = function(column) {
                column.newName = column.name;
                if(column.type === typeconstants.NUMBER){
                    if(!column.aggregation) {
                        column.aggregation = aggregationConstants.AVG;
                    }
                    if(!column.format) {
                        column.format = numberFormatConstants.NUMERIC_FORMAT_PATTERNS[3];
                    }
                    column.round = true;
                } else if(column.type === typeconstants.DATE){
                    column.format = "yyyy-MM-dd'T'HH:mm:ss";
                }
                $scope.columnSelectionHandler(column);
            };

            /**
             * This function is called when the user clicks on the trash icon of a column.
             * If no column is selected the configuration view will be hidden.
             * @param column The column that should be deleted
             */
            $scope.columnDeleteHandler = function(column) {
                if ($scope.selectedColumn === column) {
                    delete $scope.selectedColumn;
                }
            };

            /**
             * Indicates if a column should be marked as selected
             * @param column The column to check
             * @returns {boolean} true if the column should be selected, otherwise false
             */
            $scope.selectColumn = function(column) {
                return $scope.selectedColumn === column;
            };

            /**
             * This function searches for assigned columns and selects the first one found
             */
            // $scope.selectFirstColumnFound = function(){
            //     var foundColumn = undefined;
            //     if($scope.itemClone.config.dataMapping.gridDataColumns != undefined){
            //         foundColumn = $scope.itemClone.config.dataMapping.gridDataColumns;
            //     }

            //     if(foundColumn != undefined){
            //         $scope.columnSelectionHandler(foundColumn);
            //     }
            //     console.log("### first col found is ", $scope.selectedColumn);
            // };

            // $scope.isLabelColSelected = function() {
            //     return $scope.selectedColumn && $scope.itemClone.config.assignedColumns.gridDataColumns == $scope.selectedColumn;
            // };
    
            //There must be one selected column, initially select the first column found
            // $scope.selectFirstColumnFound();

        }
    ])
    // .service('randomColor', ['colourPickerConstants', function(colourPickerConstants) {
    //     return function(){
    //         return colourPickerConstants.COLOURS[Math.floor(Math.random() * colourPickerConstants.COLOURS.length)];
    //     }
    // }])
    ;
