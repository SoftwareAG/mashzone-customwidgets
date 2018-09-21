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
angular.module('simpleMapWidgetModule')
  .directive('simpleMap', ['jQuery', 'lodashPromise_smw', 'leafletPromise_smw', 'thresholdService', 'mapStyleService', 'selectionService',
    function(jQuery, lodashPromise, leafletPromise, thresholdService, mapStyleService, selectionService) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          lodashPromise.then(function(_) {
            leafletPromise.then(function(lfMap) {
              try {
                // these are thought to be used with google maps
                var map, infoWindow, oms, tooltip;
                var markerById = {};
                var dataById = $scope.dataById = {};
                var selectedIds = $scope.selectedIds = [];
                var spiderfiedMarkers = [];
                try {
                  createMap();
                  refreshMarkers($scope.flatLocationData);
                } catch (error) {
                  console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
                }
                // create the map
                function createMap() {
                  if (element[0].id === '' || element[0].id === undefined) {
                    return;
                  }
                  element.width($scope.width);
                  element.height($scope.height);
                  if (!$scope.map) {
                    try {
                      $scope.map = lfMap.map(element[0].id, {
                        zoomSnap: 0.1,
                        zoomDelta: 0.1
                      });
                      $scope.map.on('moveend', function(e) {
                        if ($scope.redrawSvg) {
                          $scope.redrawSvg = false;
                          if ($scope.config.properties.showRoutes) {
                            refreshRoutes($scope.routes, $scope.flatLocationData);
                          }
                          refreshMarkers($scope.flatLocationData);
                        } else {
                        }
                      });
                      if ($scope.config.properties.showRoutes) {
                        // In case the routes should be shown, an SVG layer will be added to the map
                        $scope.svg = d3.select($scope.map.getPane('overlayPane')).append("svg");
                        // Arrow to be displayed at the end of the route path
                        $scope.svg.append("svg:defs").selectAll("marker")
                          .data(["end"])
                          .enter()
                          .append("marker")
                          .attr("id", String)
                          .attr("viewBox", "0 -5 10 10")
                          .attr("refX", 10)
                          .attr("refY", 0)
                          .attr("markerWidth", 6)
                          .attr("markerHeight", 6)
                          .attr("orient", "auto")
                          .append("svg:path")
                          .attr("class", "route-marker-end")
                          .attr("d", "M0,-5L10,0L0,5");
                        $scope.svg.append("g")
                          .attr("class", "g-loc-root")
                      }
                    } catch (error) {
                      console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
                    }
                  }
                  var topLeft = lfMap.latLng(84.0525, -172.6171855),
                    bottomRight = lfMap.latLng(-59.1759282, 177.5390625),
                    bounds = lfMap.latLngBounds(topLeft, bottomRight);
                  lfMap.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    // maxZoom: 2,
                    // minZoom: 2,
                    bounds: bounds,
                    reuseTiles: true,
                    id: 'osm',
                    noWrap: true,
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  }).addTo($scope.map);

                  $scope.map.doubleClickZoom.disable();
                  $scope.map.boxZoom.disable();
                  if ($scope.config.properties.showRoutes) {
                    $scope.map.touchZoom.disable();
                    $scope.map.scrollWheelZoom.disable();
                    $scope.map.dragging.disable();
                  }

                  // add the svg element to hold the markers
                  // $scope.svg = d3.select($scope.map.getPane('overlayPane')).append("svg");
                };

                function refreshMarkers(xdata) {
                  if (!xdata) {
                    return;
                  }
                  if ($scope.map) {
                    // TODO: this is probably not needed... check to be removed and use directly xdata
                    var rowsByLabel = _.keyBy(xdata, function(data) { return data.label });
                    var myGlyphIcon;
                    try {
                      var myGlyphIcon = L.divIcon({
                        className: 'marker-div-icon',
                        iconSize: [14, 14]
                      });
                    } catch (error) {
                      console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
                    }

                    _.each(rowsByLabel, function(data, id) {
                      var htmlTag = '<i class="glyphicon glyphicon-map-marker" style="top:0;color: ' + data.color + ';"></i>';
                      myGlyphIcon.options.html = htmlTag;
                      if ($scope.markers[data.label]) {
                        var latlng = L.latLng(data.latitude, data.longitude);
                        if (!$scope.markers[data.label].getLatLng().equals(latlng)) {
                          $scope.markers[data.label].setLatLng(latlng);
                        }
                      } else {
                        var marker = new L.marker([data.latitude, data.longitude], { icon: myGlyphIcon })
                          .bindPopup(id)
                          .addTo($scope.map);
                        $scope.markers[data.label] = marker;
                      }
                    });
                    resizeBounds();
                  }
                };

                function refreshRoutes(rdata, ldata) {
                  // remove duplicated routes... this should be done in the data feed level
                  if ($scope.map && $scope.svg) {
                    if (rdata && rdata.length > 0) {
                      var gLocRoot = $scope.svg.select("g.g-loc-root g.g-loc");
                      if (!gLocRoot.empty()) {
                        gLocRoot.remove();
                      }
                      $scope.svg.select("g.g-loc-root").append("g")
                        .attr("class", "g-loc")
                        .selectAll("path")
                        .data(rdata)
                        .enter()
                        .append("path")
                        .attr("class", function(d) {
                          return "route-link";
                        })
                        .attr("marker-end", "url(#end)")
                        .attr("d", function(d) {
                          var locationStart = ldata.filter(function(row) {
                            return row.label == d.values.origin;
                          });
                          var locationDest = ldata.filter(function(row) {
                            return row.label == d.values.destination;
                          });
                          var startPoint = projectPoint(locationStart[0].longitude, locationStart[0].latitude);
                          var endPoint = projectPoint(locationDest[0].longitude, locationDest[0].latitude);

                          return calcBezierCurve(100, startPoint, endPoint, true);
                        })
                        .style("stroke", function(d) {
                          // override the default value provided by the css class
                          return d.values.status;
                        });
                    }
                  } else {
                    if (!$scope.map) {
                      console.info("[" + $scope.customWidgetID + "] +-+-+- the map has not been initialized... ");
                      return;
                    }
                    if (!$scope.svg) { console.info("[" + $scope.customWidgetID + "] +-+-+- the svg container has not been initialized... "); }
                  }
                };

                function resizeBounds() {
                  if ($scope.markers && Object.keys($scope.markers).length > 0 && $scope.map) {
                    var markerList = [];
                    for (var property in $scope.markers) {
                      if ($scope.markers.hasOwnProperty(property)) {
                        var m = $scope.markers[property];
                        markerList.push(m.getLatLng());
                      }
                    }

                    var newBounds = L.latLngBounds(markerList).pad(0.05);
                    var bounds = L.latLngBounds(newBounds.getNorthEast(), newBounds.getSouthWest());
                    $scope.map.fitBounds(bounds);
                    $scope.map.invalidateSize();
                    $scope.redrawSvg = true;
                  }
                };

                function projectPoint(longi, lat) {
                  var point = $scope.map.latLngToLayerPoint(new L.LatLng(lat, longi));
                  return point;
                };

                /**
                 * Returns an SVG Path to display a Bezier curve between the two given points.
                 * @param {*} distance Distance between the two points. 
                 * @param {*} startPoint Given as X,Y coordinates
                 * @param {*} endPoint Given as X,Y coordinates
                 * @param {Boolean} isBelow True if the path is to be displayed below the line that would connect the two points
                 */
                function calcBezierCurve(distance, startPoint, endPoint, isBelow) {
                  // TODO: improve this function to support when start and end points are equal. 
                  var a = endPoint.x - startPoint.x;
                  var b = endPoint.y - startPoint.y;
                  var dr = Math.sqrt(a * a + b * b);
                  distance = dr / 2.8;
                  var theta = Math.atan(b / a);
                  var costheta = Math.cos(theta);
                  var sintheta = Math.sin(theta);
                  var c = distance * sintheta;
                  var d = distance * costheta;
                  if (isBelow) {
                    c = -c;
                  } else {
                    d = -d
                  }
                  var resultEndX = endPoint.x + c;
                  var resultEndY = endPoint.y + d;
                  var resultStartX = startPoint.x + c;
                  var resultStartY = startPoint.y + d;
                  var path = "M " + startPoint.x + "," + startPoint.y + " C " + resultStartX + "," + resultStartY + " " + resultEndX + "," + resultEndY + " " + endPoint.x + "," + endPoint.y;
                  return path;
                };

                // Watch for data changes. Create the markers.
                $scope.$watch('flatLocationData', function(newValue, oldValue) {
                  if (!$scope.map) {
                    createMap();
                  }
                  refreshMarkers(newValue);
                });

                // Watch for data changes. Create the markers.
                $scope.$watch('routes', function() {
                  if (!$scope.map) {
                    createMap();
                  }
                  // during initialization there is no data and no point in refreshing anything
                  if($scope.config.properties.showRoutes) {
                    refreshRoutes($scope.routes, $scope.flatLocationData);
                  }
                });


                $scope.$watchCollection('[width, height]', _.debounce(function(newValues, oldValues) {
                  element.width(newValues[0]);
                  element.height(newValues[1]);
                  try {
                    if ($scope.map) {
                      var topLeft = L.latLng(84.0525, -172.6171855),
                        bottomRight = L.latLng(-59.1759282, 177.5390625),
                        bounds = L.latLngBounds(topLeft, bottomRight);
                      $scope.map.fitBounds(bounds);
                      $scope.map.panInsideBounds(bounds);
                      $scope.map.invalidateSize();
                      var mapPixelBounds = $scope.map.getPixelBounds()

                      if ($scope.svg) {
                        $scope.svg.attr("width", mapPixelBounds.max.x - mapPixelBounds.min.x)
                          .attr("height", mapPixelBounds.max.y - mapPixelBounds.min.y);
                        $scope.redrawSvg = true;
                      }
                    }
                  } catch (error) {
                    console.log("[" + $scope.customWidgetID + "] +-+-+- error: ", error);
                  }
                }, 0, { leading: true, maxWait: 500 }));
              } catch (error) {
                console.log("[" + $scope.customWidgetID + "] +-+-+- error in the directive ", error);
              }
            });
          });
        }
      };
    }
  ]);