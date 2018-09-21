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
angular.module("extendedDropdownWidgetModule").directive("xtdWidget", [
        "lodashPromise_xdw",
        "jQuery_xdw",
        "UtilX_xdw",
        "filterService",
        "actionService",
        "actionConstants",
        function (lodashPromise, jQuery, UtilX, filterService, actionService, actionConstants) {
            try {
                return {
                    restrict: "A",
                    link: function ($scope, element, attrs) {
                        lodashPromise.then(function (_) {
                            var isDebug = UtilX.debug("Extended Dropdown widget directive has started " + $scope.customWidgetID);
                            var currentSearchTerm = "";
                            var currentSearchPage = 0;

                            function doDraw() {
                                var t0 = performance.now();
                                var results = {
                                    'results': _.flatMap($scope.data, function (d) {
                                        return {
                                            "id": $scope.keyColumnIdx != -1 ? d.values[$scope.keyColumnIdx] : d.values[$scope.ddColumnIdx],
                                            "text": d.values[$scope.ddColumnIdx]
                                        };
                                    }),
                                    "pagination": {
                                        "more": true
                                    }
                                };
                                var t1 = performance.now();
                                console.log("+-+- flattening data took " + (t1 - t0) + " millis");
                                var pageSize = 20;
                                jQuery(element[0]).select2({
                                    placeholder: $scope.config.addNoSelectionEntry ? $scope.config.noSelectionEntry : " ",
                                    allowClear: true,
                                    multiple: $scope.config.multipleSelectionEntry,
                                    // placeholderOption: "first",
                                    // minimumResultsForSearch: 25,
                                    // minimumInputLength: 3,
                                    // initSelection: function (elem, callback) {
                                    //     var id = $(elem).val();
                                    //     console.log("+-+- init selection is... ", id);
                                    //     if (id !== "") {
                                    //         callback(results.results);
                                    //     }
                                    // },
                                    query: function (q) {
                                        // pageSize is number of results to show in dropdown
                                        var qResults;
                                        var select2 = jQuery(element[0]).data('select2');
                                        if ((!q.term || q.term.length == 0) && currentSearchTerm.length == 0) {
                                            qResults = results.results;
                                        } else {
                                            if (q.term.length == 0) {
                                                q.term = currentSearchTerm;
                                                select2.search.val(q.term);
                                            }

                                            qResults = _.filter(results.results, function (e) {
                                                return (q.term === "" || e.text.toUpperCase().indexOf(q.term.toUpperCase()) >= 0);
                                            });
                                            currentSearchTerm = q.term;
                                        }
                                        if (!q.page) {
                                            q['page'] = 1;
                                        }
                                        if (q.page > currentSearchPage) {
                                            currentSearchPage = q.page
                                            q.callback({
                                                results: qResults.slice((currentSearchPage - 1) * pageSize, currentSearchPage * pageSize),
                                                // retrieve more when user hits bottom
                                                more: qResults.length >= q.page * pageSize
                                            });
                                        } else {
                                            if (q.page == 1) {
                                                q.callback({
                                                    results: qResults.slice(0, currentSearchPage * pageSize),
                                                    more: qResults.length >= currentSearchPage * pageSize
                                                });
                                            } else {
                                                q.callback({
                                                    results: qResults.slice((currentSearchPage - 1) * pageSize, currentSearchPage * pageSize),
                                                    more: qResults.length >= currentSearchPage * pageSize
                                                });
                                            }
                                            currentSearchPage += 1;
                                        }
                                    }
                                });
                                if ($scope.selectedOption) {
                                    console.log("+-+- selecting ", $scope.selectedOption);
                                    jQuery(element[0]).select2("data", $scope.selectedOption);
                                }
                                jQuery(element[0]).on("change", onValueSelected);
                                jQuery(element[0]).on("select2-removed", onSelectionRemoved);
                                console.log("+-+- draw finished... ", [$scope, $scope.data]);
                            }

                            // another way of checking size changes
                            // $scope.onSizeChange = function (width, height) {
                            //     UtilX.debug("size changed ", [width,height], isDebug);
                            //     if (!$scope.preview && $scope.ready) {}
                            // };

                            $scope.$watch('ready', function (newValue) {
                                if (!$scope.preview && newValue) {
                                    UtilX.debug("dashboard is ready... ", newValue, isDebug);
                                }
                            });

                            $scope.$watch('dataUpdateCount', function (newValue) {
                                if (!$scope.preview && newValue > 0) {
                                    UtilX.debug("dashboard data was updated... ", [newValue, $scope.data.length], isDebug);
                                    jQuery(element[0]).select2("destroy");
                                    doDraw();
                                }
                            });

                            $scope.$watch('config.multipleSelectionEntry', function (newValue) {
                                UtilX.debug("multiple selection flag was updated... ", [newValue, $scope.ready], isDebug);
                                if ($scope.ready && !$scope.preview) {
                                    jQuery(element[0]).select2("destroy");
                                    doDraw();
                                }
                            });

                            // called when the "Clear Selection" menu entry is used
                            $scope.$on("onDeleteSelection", function () {
                                UtilX.debug("clearing selection", null, isDebug);
                                jQuery(element[0]).select2("val", "");
                            });

                            $scope.$parent.setSelection = function (cols, values) {
                                UtilX.debug("setting selection ", [cols, values, $scope], isDebug);
                                if (cols && cols.length > 0) {
                                    $scope.activeSelection.cols = cols;
                                    $scope.activeSelection.values = values;
                                    var comparisonValuesByIndex = [];
                                    var isKeyCol = false;
                                    var t0 = performance.now();
                                    for (let index = 0; index < cols.length; index++) {
                                        const colNN = cols[index];
                                        var foundCol = _.find($scope.colDefsByIdx, ['newName', colNN]);
                                        isKeyCol = isKeyCol || (foundCol.idx === $scope.keyColumnIdx);
                                        if (foundCol) {
                                            comparisonValuesByIndex[foundCol.idx] = values[index];
                                        }
                                    }
                                    $scope.selectedRow = _.find($scope.data, function (d, i) {
                                        var found = _.intersection(d.values, comparisonValuesByIndex);
                                        return found && found.length > 0;
                                    });
                                    var t1 = performance.now();
                                    UtilX.debug("finding selected columns from DATA took " + (t1 - t0), $scope.selectedRow);
                                    if ($scope.selectedRow) {
                                        $scope.selectedOption = {
                                            'id': isKeyCol ? $scope.selectedRow.values[$scope.keyColumnIdx] : $scope.selectedRow.values[$scope.ddColumnIdx],
                                            'text': $scope.selectedRow.values[$scope.ddColumnIdx]
                                        }
                                    }
                                } else {
                                    delete $scope.selectedOption;
                                    delete $scope.selectedRow;
                                }
                                filterService.onSelectionChange($scope.item.identifier, cols, values);
                                actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_SELECTION_CHANGE, cols, values);
                            };

                            function onValueSelected(evt) {
                                // set the selected value in case it is needed anywhere
                                $scope.selectedOption = jQuery(element[0]).select2("data");
                                // if the option placeholderOption is set, this event is triggered as well when removing choices
                                if (evt.added) {
                                    var cols = [];
                                    var values = [];
                                    if ($scope.config.dataMapping.ddColumn) {
                                        cols.push($scope.config.dataMapping.ddColumn.newName);
                                        values.push(evt.added.text);
                                    }
                                    if ($scope.config.dataMapping.keyColumn) {
                                        cols.push($scope.config.dataMapping.keyColumn.newName);
                                        values.push(evt.added.id);
                                    }
                                    filterService.onSelectionChange($scope.item.identifier, cols, values);
                                    actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_CLICK, cols, values);
                                }
                            }

                            function onSelectionRemoved(evt) {
                                // set the selected value in case it is needed anywhere
                                if ($scope.selectedOption) delete $scope.selectedOption;
                                // console.log("+-+- removed", [evt, cols, values]);
                                var cols = [];
                                var values = [];
                                if ($scope.config.dataMapping.ddColumn) {
                                    cols.push($scope.config.dataMapping.ddColumn.newName);
                                    values.push(null);
                                }
                                if ($scope.config.dataMapping.keyColumn) {
                                    cols.push($scope.config.dataMapping.keyColumn.newName);
                                    values.push(null);
                                }
                                // TODO: review when multiple selection is enabled

                                filterService.onSelectionChange($scope.item.identifier, cols, values);
                                actionService.triggerAction($scope.item.identifier, actionConstants.actionTrigger.ON_CLICK, cols, values);
                            }
                        });
                    }
                };
            } catch (error) {
                console.log("+-+- Error inside directive for " + $scope.customWidgetID, error);
            }
        }
    ])
    .directive("xtdWidgetEmpty", [
        "jQuery_xdw",
        "UtilX_xdw",
        function (jQuery, UtilX) {
            return {
                restrict: "A",
                link: function ($scope, element, attrs) {
                    var isDebug = UtilX.debug("Extended Dropdown widget (no data) directive has started " + $scope.customWidgetID);
                    if (!$scope.data || $scope.data.length == 0) {
                        jQuery(element[0]).select2({
                            placeholder: $scope.config.addNoSelectionEntry ? $scope.config.noSelectionEntry : " ",
                            allowClear: true,
                        });
                    }
                }
            }
        }
    ]);