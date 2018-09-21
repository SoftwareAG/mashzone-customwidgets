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
  .service('extendedDropdownWidgetDataService', ['widgetDataService', 'formatNumberService', 'typeconstants', 'aggregationConstants',
    function (widgetDataService, formatNumberService, typeconstants, aggregationConstants) {
      /**
       * Utility function that creates one data mapping column
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
      function createDataMappingColumn(dataColumn) {
        var numericColumn = dataColumn.type === typeconstants.NUMBER;
        var format = numericColumn ? dataColumn.format : void 0;
        var precision = numericColumn && format ? formatNumberService.getPrecisionFromFormat(format) : void 0;
        var aggregation = void 0;
        var isNumericColumn = dataColumn.type === typeconstants.NUMBER;

        // var format = isNumericColumn ? formatNumberService.getFormatFromFormatKey(dataColumn.format) : undefined,
        //   precision = isNumericColumn ? formatNumberService.getPrecisionFromFormat(format) : undefined,
        //   aggregation = isNumericColumn && dataColumn.aggregation ? {
        //     type: dataColumn.aggregation
        //   } : undefined;
        return widgetDataService.createDataMappingColumn(
          dataColumn.name,
          dataColumn.type,
          '',
          '',
          dataColumn.newName,
          dataColumn.round,
          precision,
          true,
          aggregation);
      };

      return {
        getDataMapping: function (item) {
          var dataMapping = (item.identifier,
            item.config, {
              columns: []
            });
          if (!item.config.dataMapping)
            return dataMapping;
          // init allColumns every time the data mapping is recalculated... 
          item.config["allColumns"] = [];
          if (item.config && item.config.dataMapping) {
            jQuery.each(item.config.dataMapping, function (dataMappingColumnName, col) {
              if (col) {
                try {
                  if (jQuery.isArray(col)) {
                    // check each single column in a multiple-column-drop column
                    jQuery.each(col, function (i, singleCol) {
                      var dmCol = createDataMappingColumn(singleCol);
                      dataMapping.columns.push(dmCol);
                      copyColumnForSorting(item.config.allColumns, singleCol);
                    });
                  } else {
                    var bCol = createDataMappingColumn(col);
                    dataMapping.columns.push(bCol);
                    copyColumnForSorting(item.config.allColumns, col);
                  }
                } catch (error) {
                  console.error("+-+-+- EGW !!!! error ", error);
                }
              }
            });
          }

          return dataMapping;
        },
        /**
         * Provides the columns that can be used from other widgets to create a filter
         */
        calculateCoordinateList: function (config) {
          var uniqueNames = {},
            coordinateList = [];
          config.dataMapping && config.dataMapping.ddColumn && coordinateList.push({
            name: config.dataMapping.ddColumn.newName,
            type: config.dataMapping.ddColumn.type
          });
          config.dataMapping && config.dataMapping.keyColumn && coordinateList.push({
            name: config.dataMapping.keyColumn.newName,
            type: config.dataMapping.keyColumn.type
          });
          var furtherColumns = config.dataMapping ? config.dataMapping.furtherColumns : void 0;
          return furtherColumns && angular.forEach(furtherColumns, function (furtherColumn) {
              var newColumnName = furtherColumn.newName,
                columnName = furtherColumn.name,
                columnType = furtherColumn.type,
                uniqueColumnName = [columnName, columnType].join();
              newColumnName && newColumnName !== columnName && (uniqueColumnName = [newColumnName, columnType].join()),
                uniqueNames[uniqueColumnName] || (uniqueNames[uniqueColumnName] = !0,
                  coordinateList.push({
                    name: newColumnName || columnName,
                    type: columnType
                  }))
            }),
            coordinateList;
        },
        hasAlwaysASelection: function (config) {
          return !config.addNoSelectionEntry
        },
        getInitialSelection: function (config) {
          if (config.dataMapping && config.dataMapping.ddColumn && config.dataMapping.ddColumn.preSelection) {
            var ddColumnName = config.dataMapping.ddColumn.newName ? config.dataMapping.ddColumn.newName : config.dataMapping.ddColumn.name;
            return {
              cols: [ddColumnName],
              values: [config.dataMapping.ddColumn.preSelection]
            }
          }
        }
      };

      function copyColumnForSorting(allColumns, col) {
        var columnFound = false;
        for (let i = 0; i < allColumns.length; i++) {
          const styleColumn = allColumns[i];
          if (styleColumn.name.localeCompare(col.name) == 0 || (styleColumn.copyFrom != undefined)) {
            jQuery.extend(styleColumn, col);
            allColumns[i] = styleColumn;
            columnFound = true;
            break;
          }
        }
        if (!columnFound && col.copyFrom === undefined) {
          allColumns.push(col);
        }
      };
    }
  ]);