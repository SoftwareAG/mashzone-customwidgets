angular.module('simpleMapWidgetModule')

.service('simpleMapWidgetDataService', ['widgetDataService', 'formatNumberService', 'typeconstants', 'aggregationConstants',
  function(widgetDataService, formatNumberService, typeconstants, aggregationConstants) {
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
      return widgetDataService.createDataMappingColumn(
        dataColumn.newName,
        dataColumn.type,
        '',
        dataColumn.name,
        dataColumn.newName,
        false,
        undefined,
        true,
        undefined);
    };
    var createDataMappingColumnForThresholdColumnDrops = function(thresholdValue) {
      if (!thresholdValue || !thresholdValue.column) {
        return undefined;
      }
      var thAggregation = { type: thresholdValue.column.aggregation.type };
      return widgetDataService.createDataMappingColumn(
        thresholdValue.column.newName,
        thresholdValue.column.type,
        undefined,
        thresholdValue.column.name,
        '',
        false, -1,
        true,
        thAggregation);
    };

    return {

      // getDataMapping
      getDataMapping: function(item) {
        var dataMapping = {
          columns: []
        };
        if (item.config && item.config.dataMapping) {
          jQuery.each(item.config.dataMapping, function(dataMappingCol, col) {
            if (col) {
              if (jQuery.isArray(col)) {
                jQuery.each(col, function(i, col) {
                  dataMapping.columns.push(createDataMappingColumn(col));
                });
              } else {
                dataMapping.columns.push(createDataMappingColumn(col));
              }
            }
          });
        }
        //Add columns used for the threshold configuration
        //config.properties.thresholdConfig.thresholds
        if (item.config && item.config.properties && item.config.properties.thresholdConfig) {
          for (var i = 0; i < item.config.properties.thresholdConfig.thresholds.length; i++) {
            var threshold = item.config.properties.thresholdConfig.thresholds[i];
            var thColumn = createDataMappingColumnForThresholdColumnDrops(threshold.value);
            if (thColumn) {
              dataMapping.columns.push(thColumn);
            }
            var thColumn2 = createDataMappingColumnForThresholdColumnDrops(threshold.value2);
            if (thColumn2) {
              dataMapping.columns.push(thColumn2);
            }
          }
        }
        return dataMapping;
      },

      calculateCoordinateList: function(config) {
        var list = [];
        if (config.dataMapping) {
          if (config.dataMapping.idColumn) {
            list.push(config.dataMapping.idColumn);
          }
          if (config.dataMapping.labelColumn) {
            list.push(config.dataMapping.labelColumn);
          }
          if (config.dataMapping.typeColumn) {
            list.push(config.dataMapping.typeColumn);
          }
          if (config.dataMapping.statusColumn) {
            list.push(config.dataMapping.statusColumn);
          }
          if (config.dataMapping.latitude) {
            list.push(config.dataMapping.latitude);
          }
          if (config.dataMapping.longitude) {
            list.push(config.dataMapping.longitude);
          }
          config.dataMapping.descColumns.forEach(function(col) {
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