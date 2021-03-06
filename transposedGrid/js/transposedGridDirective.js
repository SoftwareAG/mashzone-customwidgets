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
  .directive('transposedGrid', ['$timeout', 'lodash_tg','jQuery',
    function($timeout, _,jQuery) {
      return {
        restrict: 'EA',
        link: function($scope, element, attrs) {

          function resize() {
            redraw();
          }

          function redraw() {
            if ($scope.data && $scope.data.length != 0) {
              // 100 pixels for the label column width and 20 for the padding... defined in the styles
              var theTableDiv = d3.select(element[0]).select('.list-contents-container');
              var theTable = theTableDiv.select('table');
              var theRows = theTable.node().rows;
              // change the height of the td once angular has finished updating the tree
              $timeout(function() {
                for (var i = 0; i < theRows.length; i++) {
                  var rowHeight = theRows[i].clientHeight;
                  if (rowHeight == 0) {
                    rowHeight = 30;
                  }
                  var theCells = theRows[i].children;
                  if(theCells[0]) {
                    theCells[0].style.height = rowHeight + "px";
                  }
                  jQuery('#' + element[0].id + ' tbody').scroll(function (evt) {
                    jQuery('#' + element[0].id + ' tbody td:nth-child(1)').css("left", jQuery('#' + element[0].id + ' tbody').scrollLeft());
                  });
                }
              });
              theTableDiv.node().style.width = element[0].getBoundingClientRect().width - 20 + "px";
            } else {
              console.log("+*+*+* no data");
            }
          }

          $scope.$watchCollection('[width, height]', _.debounce(function(newValues, oldValues) {
            // console.log("### resizing to ", newValues);
            redraw();
          }, 0, {
            leading: true,
            maxWait: 500
          }));
          // since the data property is an array... 
          $scope.$watchCollection('data', redraw);
        }
      }
    }
  ]);