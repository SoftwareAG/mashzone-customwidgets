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
 * Data service for the custom widget
 * The data service defines the data mapping - the structure of the data delivered by the server
 */
.service('transposedGridDataService', ['widgetDataService', 'formatNumberService', 'typeconstants',
  function(widgetDataService, formatNumberService, typeconstants) {

    /**
     * Utility function createDataMappingColumn(...) creates one data mapping column
     * @param name The column name in the source, use dataColumn.name
     * @param type The data type of the column ("TEXT", "DATE", "NUMERIC")
     * @param filter Not interesting for this use case, set to '' or undefined
     * @param copyFrom If the user wants to have a source column twice, e.g. to see different aggregations for a numeric column, here he has to define the original column name
     * @param newName If the user has changed the column name please provide dataColumn.newName
     * @param round For numeric columns the user can define if values should be rounded or not. Set to true or false
     * @param precision Specifies precision for numeric columns. There is a utility function in formatNumberService that is called getPrecisionFromFormat
     * that can be used to calculate the precision from a format pattern. Set to undefined for text or date columns.
     * @param keepInResult Not interesting for this use case, set to true
     * @param aggregation Aggregation, if not specified the aggregation in the datamapping column is undefined
     * @returns A datamapping column object
     */
    var createDataMappingColumn =
      function(dataColumn) {
        var isNumericColumn = dataColumn.type === typeconstants.NUMBER;
        var format = isNumericColumn ? formatNumberService.getFormatFromFormatKey(dataColumn.format) : undefined,
          precision = isNumericColumn ? formatNumberService.getPrecisionFromFormat(format) : undefined,
          aggregation = isNumericColumn && dataColumn.aggregation ? { type: dataColumn.aggregation } : undefined;
        return widgetDataService.
        createDataMappingColumn(
          dataColumn.name,
          dataColumn.type,
          null,
          '',
          dataColumn.newName || '',
          dataColumn.round,
          precision,
          true,
          aggregation);
      };

    return {

      /**
       * This function is called by the custom widget framework.
       * It prepares the data handling of the custom widget (item) with the server
       * by creating the data mapping for each configured (assigned) data column
       */
      getDataMapping: function(item) {
        var dataMapping = {
          columns: []
        };
        if (item.config && item.config.dataMapping) {
          var furtherColumns = item.config.dataMapping.gridDataColumns;
          if (furtherColumns) {
            angular.forEach(furtherColumns, function(anyColumn) {
              dataMapping.columns.push(createDataMappingColumn(anyColumn));
            });
          }
        }
        return dataMapping;
      },

      calculateCoordinateList: function(config) {
        var list = [];
        if (config.dataMapping) {
          config.dataMapping.gridDataColumns.forEach(function(col) {
            list.push(col);
          });
        }
        return list.map(function(col) {
          return {
            name: col.newName,
            type: col.type
          }
        });
      }
    };
  }
]);