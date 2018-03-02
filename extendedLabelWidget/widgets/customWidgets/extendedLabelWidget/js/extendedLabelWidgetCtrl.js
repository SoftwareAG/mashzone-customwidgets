angular.module('extendedLabelWidgetModule')
  .controller('extendedLabelWidgetCtrl', ['$scope', 'UtilX_elw', 'lodashPromise_elw', 'jQuery_elw', '$interval', 'formatDateService', 'formatNumberService', 'thresholdConstants', 'thresholdService', 'selectionService', 'filterService', 'actionService', 'actionConstants',
    function ($scope, UtilX, lodashPromise, jQuery, $interval, formatDateService, formatNumberService, thresholdConstants, thresholdService, selectionService, filterService, actionService, actionConstants) {
      lodashPromise.then(function (_) {
        if ($scope.config.autoRefresh === undefined) {
          $scope.config.autoRefresh = true;
        }
        $scope.colDefs = [];

        $scope.config.properties = jQuery.extend(true, {
          showDataType: true,
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
          margin: {},
          isScalable: true,
          labelSize: "large"
        }, $scope.config.properties);
        $scope.config.properties.margin = {
          left: 50,
          top: 80,
          right: 50,
          bottom: 50
        };
        $scope.customWidgetID = UtilX.generateUUID();
        $scope.isZoomed = false;
        if ($scope.$parent.item.title == $scope.$parent.content.title) {
          $scope.title = "";
        } else {
          $scope.title = $scope.$parent.item.title;
        }
        $scope.showTitle = $scope.$parent.item.hideHeader;

        $scope.setConfig = function (config) {
          $scope.config = config;
        };

        var inputDateFormat = d3.time.format.iso; // %Y-%m-%dT%H:%M:%S

        $scope.setData = function (data) {
          if (!$scope.config.dataMapping) {
            console.warn("+-+-+- data not available for the chart");
            return;
          }
          if (data && data.status == 'COMPLETE') {
            // console.log("+-+-+- data is ", data);
            // console.log("+-+-+- config is ", $scope.config);

            $scope.labelColIdx = $scope.config.dataMapping.labelCol ? _.findIndex(data.columns, function (col) {
              return col.name === $scope.config.dataMapping.labelCol.newName
            }) : -1;
            $scope.footerLeftColIdx = $scope.config.dataMapping.footerLeftCol ? _.findIndex(data.columns, function (col) {
              return col.name === $scope.config.dataMapping.footerLeftCol.newName
            }) : -1;
            $scope.footerRightColIdx = $scope.config.dataMapping.footerRightCol ? _.findIndex(data.columns, function (col) {
              return col.name === $scope.config.dataMapping.footerRightCol.newName
            }) : -1;
            $scope.moreColumnsIdxs = $scope.config.dataMapping.moreColumns.map(function (column) {
              var idx = _.findIndex(data.columns, function (col) {
                return col.name == column.newName
              });
              $scope.colDefs[idx] = column;
              return {
                name: column.newName,
                index: idx
              };
            });
            $scope.moreColsIdxs = $scope.config.dataMapping.moreColumns.map(function (column) {
              return {
                name: column.newName,
                index: _.findIndex(data.columns, function (col) {
                  return col.name == column.newName
                })
              };
            });

            if ($scope.labelColIdx != -1) {
              // console.log("+-+-+- data is enough to plot the chart");
              if (data.rows && data.rows.length >= 1) {
                // there is only one value, so no aggregation or whatsoever is needed... only text formatting
                console.log("-+-+-+ formatting for the label column... ", $scope.config.dataMapping.labelCol);
                // sort the data and get only the first value
                switch ($scope.config.dataMapping.labelCol.type) {
                  case 'NUMERIC':
                    $scope.theValue = +data.rows[0].values[0];
                    break;
                  case 'DATE':
                    // TODO: translate the configured formatting into d3 formatting
                    var valAsDate = new Date(data.rows[0].values[0]);
                    var outputDateFormat = d3.time.format("%d.%m.%Y %H:%M:%S %Z");
                    $scope.theValue = outputDateFormat(valAsDate);
                    break;

                  default:
                    $scope.theValue = data.rows[0].values[0];
                    break;
                }
                var theOtherLabel = jQuery("div.the-other-label", "#" + $scope.customWidgetID);
                if (theOtherLabel.length != 0) {
                  var w = $scope.width - $scope.config.properties.margin.left - $scope.config.properties.margin.right;
                  var h = $scope.height - $scope.config.properties.margin.top - $scope.config.properties.margin.bottom;
                  changeFontSize(theOtherLabel, $scope.theValue, w, h);
                }
              } else {
                $scope.theValue = "";
              }
            }
          }
        };

        $scope.isScalable = function () {
          return $scope.config.properties.isScalable;
        }
        $scope.textClicked = function () {
          var cols = [$scope.config.dataMapping.labelCol.newName];
          var vals = [$scope.theValue];
          filterService.onSelectionChange($scope.item.identifier, cols, vals);
          actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_CLICK, cols, vals);
        }

        $scope.$watch('config.properties', function (newVal) {
          $scope.$root.$broadcast("dashboardDefinitionChanged"); // Broadcast so that the config is saved
          console.log("+-+- ELW > is scalable = " + newVal.isScalable);
        }, true);

        $scope.$watch('config.properties.labelSize', function (newVal, oldVal) {
          if (newVal.localeCompare(oldVal) != 0) {
            var theOtherLabel = jQuery("div.the-other-label", "#" + $scope.customWidgetID);
            if (theOtherLabel.length != 0) {
              var w = $scope.width - $scope.config.properties.margin.left - $scope.config.properties.margin.right;
              var h = $scope.height - $scope.config.properties.margin.top - $scope.config.properties.margin.bottom;
              changeFontSize(theOtherLabel, $scope.theValue, w, h);
            }
          }
        }, true);

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

        $scope.$watch("[width, height]", _.debounce(
          function (newValues, oldValues) {
            try {
              if (newValues[0] >= 0 && newValues[1] >= 0 && $scope.theValue) {
                var theOtherLabel = jQuery("div.the-other-label", "#" + $scope.customWidgetID);
                if (theOtherLabel.length != 0) {
                  // find available width and height
                  var w = newValues[0] - $scope.config.properties.margin.left - $scope.config.properties.margin.right;
                  var h = newValues[1] - $scope.config.properties.margin.top - $scope.config.properties.margin.bottom;
                  changeFontSize(theOtherLabel, $scope.theValue, w, h);
                }
              }
            } catch (error) {
              console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
            }
          },
          0, {
            leading: true,
            maxWait: 500
          }
        ));

        function changeFontSize(elem, strVal, w, h) {
          // TODO: check if this is needed for the title header as well
          if (w > 0 && h > 0) {
            var theCanvas = jQuery(".the-canvas", "#" + $scope.customWidgetID);
            var sz = 15;
            if ($scope.config.properties.isScalable) {
              if (theCanvas.length > 0) {
                var fontFamily = elem.css("font-family");
                var font = "";
                var d2 = theCanvas.get(0).getContext("2d");
                var textM = d2.measureText($scope.theValue);
                do {
                  font = sz + "px " + fontFamily;
                  d2.font = font;
                  sz = sz + 1;
                } while (sz < 100 && (d2.measureText($scope.theValue).width < w));
              }
            } else {
              console.log("+-+- ELW > elem height ", elem.outerHeight());
              if (w < h) {
                sz = elem.outerWidth() * .60;
              } else {
                sz = elem.outerHeight() * .9;
              }
            }
            switch ($scope.config.properties.labelSize) {
              case 'large':
                break;
              case 'medium':
                sz = sz * 0.75
                break;
              case 'small':
                sz = sz * .50;
                break;
              default:
                break;
            }
            elem.css('font-size', sz);
          }
        }
      });
    }
  ]);