angular.module('simpleMapWidgetModule')
  .controller('simpleMapWidgetCtrl', ['$scope', 'UtilX_smw', 'jQuery', '$interval', 'formatDateService', 'formatNumberService', 'thresholdConstants', 'thresholdService', 'lodashPromise_smw', 'selectionService', 'filterService', 'actionService', 'actionConstants',
    function($scope, UtilX, jQuery, $interval, formatDateService, formatNumberService, thresholdConstants, thresholdService, lodashPromise, selectionService, filterService, actionService, actionConstants) {
      lodashPromise.then(function(_) {
        if (!$scope.config) {
          $scope.config = {
            dataMapping: {
              descColumns: []
            }
          };
        }
        if (!$scope.markers) {
          $scope.markers = [];
        }
        if ($scope.config.autoRefresh === undefined) {
          $scope.config.autoRefresh = true;
        }

        $scope.config.properties = jQuery.extend(true, {
          showDataType: true,
          showMarkers: true,
          showRoutes: false,
          showCloropeth: false,
          location: { lat: 20, lng: 0 },
          zoom: 1,
          autofit: true,
          thresholdConfig: {
            showInactiveState: true,
            visualizationType: thresholdConstants.thresholdVisualizations.COLORIZE,
            inactiveState: {
              colour: '#09C'
            },
            thresholds: []
          },
          iconConfig: {
            settings: [],
            default: { shape: "circle", label: "" }
          },
          apiKey: "",
          style: "minimalLight"
        }, $scope.config.properties);
        $scope.customWidgetID = UtilX.generateUUID();
        $scope.config.editLocation = false;

        $scope.setConfig = function(config) {
          $scope.config = config;
        };

        $scope.setData = function(data) {
          if (!$scope.config.dataMapping) {
            console.warn("+-+-+- data not available for the chart");
            return;
          }
          if ($scope.config.properties.showMarkers && !$scope.config.properties.showRoutes) {
            if (!$scope.config.dataMapping.latitude || !$scope.config.dataMapping.longitude) {
              console.warn("+-+-+- Latitude and/or Longitude data columns not yet configured for the chart");
              return;
            }
          } else if ($scope.config.properties.showRoutes) {
            if (!$scope.config.dataMapping.originLabel || !$scope.config.dataMapping.destinationLabel ||
              !$scope.config.dataMapping.latitudeOrigin || !$scope.config.dataMapping.longitudeOrigin ||
              !$scope.config.dataMapping.latitudeDestination || !$scope.config.dataMapping.longitudeDestination) {
              console.warn("+-+-+- Label, Latitude and/or Longitude data columns not yet configured for the chart");
              return;
            }
          }
          if (data && data.status == 'COMPLETE') {
            if ($scope.config.properties.showMarkers && !$scope.config.properties.showRoutes) {
              var idColIndex = $scope.config.dataMapping.idColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.idColumn.newName }) : -1;
              var labelColIndex = $scope.config.dataMapping.labelColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.labelColumn.newName }) : -1;
              var typeColIndex = $scope.config.dataMapping.typeColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.typeColumn.newName }) : -1;
              var statusColIndex = $scope.config.dataMapping.statusColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.statusColumn.newName }) : -1;
              var latColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.latitude.newName });
              var lngColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.longitude.newName });
              var descColIdxs = $scope.config.dataMapping.descColumns.map(function(column) {
                return { name: column.newName, index: _.findIndex(data.columns, function(col) { return col.name == column.newName }) };
              });

              $scope.flatLocationData = data.rows.map(function(row, index) {
                var result = {
                  id: ~idColIndex ? row.values[idColIndex] : index,
                  label: ~labelColIndex ? row.values[labelColIndex] : '',
                  type: ~typeColIndex ? row.values[typeColIndex] : undefined,
                  status: ~statusColIndex ? row.values[statusColIndex] : undefined,
                  latitude: row.values[latColIndex],
                  longitude: row.values[lngColIndex],
                  descriptions: descColIdxs.map(function(colIdx) { return { name: colIdx.name, value: row.values[colIdx.index] }; })
                };

                result.color = getColor(result.status);
                return result;
              });
            } else if ($scope.config.properties.showRoutes) {
              try {
                // TODO: add checks for existing columns 
                // TODO: add warning for missing columns
                var idColIndex = $scope.config.dataMapping.idColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.idColumn.newName }) : -1;
                var statusColIndex = $scope.config.dataMapping.statusColumn ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.statusColumn.newName }) : -1;
                var originLabelColIndex = $scope.config.dataMapping.originLabel ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.originLabel.newName }) : -1;
                var originLatColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.latitudeOrigin.newName });
                var originLngColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.longitudeOrigin.newName });
                var destLabelColIndex = $scope.config.dataMapping.destinationLabel ? _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.destinationLabel.newName }) : -1;
                var destLatColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.latitudeDestination.newName });
                var destLngColIndex = _.findIndex(data.columns, function(col) { return col.name === $scope.config.dataMapping.longitudeDestination.newName });

                var originNewGroup = d3.nest()
                  .key(function(d) {
                    return d.values[originLabelColIndex];
                  })
                  .rollup(function(d) {
                    return {
                      "count": d.length,
                      "latitude": d[0].values[originLatColIndex],
                      "longitude": d[0].values[originLngColIndex]
                    };
                  })
                  .entries(data.rows);
                var destNewGroup = d3.nest()
                  .key(function(d) {
                    return d.values[destLabelColIndex];
                  })
                  .rollup(function(d) {
                    return {
                      count: d.length,
                      latitude: d[0].values[destLatColIndex],
                      longitude: d[0].values[destLngColIndex]
                    };
                  })
                  .entries(data.rows);
                $scope.locations = _.concat(originNewGroup, destNewGroup);
                $scope.locations = _.uniqBy($scope.locations, 'key');
                $scope.flatLocationData = $scope.locations.map(function(row, index) {
                  var result = {
                    id: index, // not used
                    status: undefined, // only used to get the color for the marker
                    label: row.key, // unique identifier
                    latitude: row.values.latitude,
                    longitude: row.values.longitude
                  };

                  result.color = getColor(result.status);
                  return result;
                });
                // remove the routes where origin and destination are equal
                var rowsWithDiffOriginDest = data.rows.filter(function(row){
                  return row.values[originLabelColIndex] != row.values[destLabelColIndex];
                });
                var routes = d3.nest()
                  .key(function(d) {
                      return d.values[originLabelColIndex] + "_" + d.values[destLabelColIndex];
                  })
                  .rollup(function(d) {
                    return {
                      origin: d[0].values[originLabelColIndex],
                      destination: d[0].values[destLabelColIndex],
                      weight: d3.sum(d, function(row) {
                        return statusColIndex == -1 ? 5 : parseFloat(row.values[statusColIndex]);
                      }),
                      status: function() {
                        var allStatus = d.map(a => a.values[statusColIndex]);
                        return getColor(d3.max(allStatus));
                      }()
                    };
                  })
                  .entries(rowsWithDiffOriginDest);
                var uniqueRoutes = _.uniqWith(routes, function(a, b) {
                  return ((a.values.origin == b.values.origin) && (a.values.destination == b.values.destination)) || (a.values.origin == a.values.destination);
                });
                $scope.routes = routes;
                $scope.redrawSvg = true;
              } catch (error) {
                console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
              }
            }
          }
        };

        function getColor(statusValue) {
          var ac = thresholdService.getAreaConfigByList($scope.config.properties.thresholdConfig.thresholds);
          var matchingThreshold = ac.getThresholdForValue(statusValue);
          return matchingThreshold && matchingThreshold.colour ||
            $scope.config.properties.thresholdConfig.showInactiveState && $scope.config.properties.thresholdConfig.inactiveState.colour ||
            'rgba(0,0,0,0)';
        }

        $scope.onSelection = function(data) {
          var cols = [];
          var vals = [];
          if (data) {
            if ($scope.config.dataMapping.idColumn) {
              cols.push($scope.config.dataMapping.idColumn.newName);
              vals.push(data.id);
            }
            if ($scope.config.dataMapping.typeColumn) {
              cols.push($scope.config.dataMapping.typeColumn.newName);
              vals.push(data.type);
            }
            if ($scope.config.dataMapping.statusColumn) {
              cols.push($scope.config.dataMapping.statusColumn.newName);
              vals.push(data.status);
            }
            if ($scope.config.dataMapping.latitude) {
              cols.push($scope.config.dataMapping.latitude.newName);
              vals.push(data.latitude);
            }
            if ($scope.config.dataMapping.longitude) {
              cols.push($scope.config.dataMapping.longitude.newName);
              vals.push(data.longitude);
            }
            data.descriptions.forEach(function(description) {
              cols.push(description.name);
              vals.push(description.value);
            });
          } else {
            if ($scope.config.dataMapping.idColumn) {
              cols.push($scope.config.dataMapping.idColumn.newName);
            }
            if ($scope.config.dataMapping.typeColumn) {
              cols.push($scope.config.dataMapping.typeColumn.newName);
            }
            if ($scope.config.dataMapping.statusColumn) {
              cols.push($scope.config.dataMapping.statusColumn.newName);
            }
            if ($scope.config.dataMapping.latitude) {
              cols.push($scope.config.dataMapping.latitude.newName);
            }
            if ($scope.config.dataMapping.longitude) {
              cols.push($scope.config.dataMapping.longitude.newName);
            }
            $scope.config.dataMapping.descColumns.forEach(function(col) {
              cols.push(col.name);
            });
            vals = cols.map(function() { return null; });
          }
          filterService.onSelectionChange($scope.item.identifier, cols, vals);
          actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_SELECTION_CHANGE, cols, vals);
        };

        $scope.$watch('config.properties.showRoutes', function(newVal, oldVal) {
          // this get also triggered when the "Assign Data" button is clicked
          // when showRoutes is clicked, the data columns corresponding to the markers will be removed
          // only when the values have changed
          if (oldVal != newVal) {
            for (var property in $scope.config.dataMapping) {
              if (property != 'idColumn') {
                delete $scope.config.dataMapping[property];
              }
            }
          }
          // TODO: save the column configuration to be restored if showRoutes gets switched again
        });

        $scope.$watch('config.properties', function() {
          $scope.$root.$broadcast("dashboardDefinitionChanged"); // Broadcast so that the config is saved
        }, true);


        $scope.$watch('config.editLocation', function(newValue) {
          if (newValue) {
            selectionService.setInlineEditComponent($scope.item.identifier);
          } else {
            selectionService.setInlineEditComponent(undefined);
          }
        });

        $scope.$watch(selectionService.isInInlineMode.bind(this, $scope.item.identifier), function(newValue) {
          $scope.config.editLocation = newValue;
        });
      });
    }
  ]);