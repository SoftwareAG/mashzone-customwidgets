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
angular.module('extendedLabelWidgetModule')
  .service('jQuery_elw', ['$window', function ($window) {
    // License - N/A built into MashZone
    return $window.jQuery;
  }])
  .service('lodashPromise_elw', ['$q', '$window', 'jQuery_elw', function ($q, $window, jQuery) {
    // License - MIT
    var deferred = $q.defer();
    jQuery.getScript("/mashzone/hub/dashboard/widgets/customWidgets/extendedLabelWidget/js/lodash.min.js.src", function () {
      deferred.resolve($window._.noConflict());
    });
    return deferred.promise;
  }])
  .service('UtilX_elw', [function () {
    /**
     * this contains some utils I find useful inside the widgets. Most of it has been taken from internet forums (stackoverflow...)
     * and is therefore not my work
     */
    var UtilX = {
      parseDate: function (x) {
        return d3.time.format("%Y-%m-%dT%H:%M:%S").parse(x);
      },
      generateUUID: function () {
        function s(n) {
          return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
        }
        function h(n) {
          return (n | 0).toString(16);
        }
        return "X" + [s(4) + s(4), s(4), "4" + s(3), h(8 | (Math.random() * 4)) + s(3), Date.now() // s(4) + s(4) + s(4), // UUID version 4 // {8|9|A|B}xxx
          .toString(16)
          .slice(-10) + s(2)
        ].join("-"); // Use timestamp to avoid collisions
      },
      parseShortDate: function (x) {
        return d3.time.format("%Y-%m-%d").parse(x);
      },
      parseHour: function (x) {
        return d3.time.format("%H:%M:%S").parse(x);
      },
      translateDateFormat: function (dateFormat) {
        // TODO: add missing formats
        var dateFormat = dateFormat.replace("yyyy", "%Y");
        dateFormat = dateFormat.replace("MM", "%m");
        dateFormat = dateFormat.replace("dd", "%d");
        dateFormat = dateFormat.replace("T", " ");
        dateFormat = dateFormat.replace("HH", "%H");
        dateFormat = dateFormat.replace("mm", "%M");
        dateFormat = dateFormat.replace("ss", "%S");
        return dateFormat;
      },
      /**
       * this will transpose the data rows in MZNG feed result
       */
      transposeRows: function (a) {
        var sol = [], // return array
          outL = a.length || 0; // length of the outer array
        if (outL == 0) {} else {
          if (a[0] && a[0].hasOwnProperty("values") && a[0].values instanceof Array && a[0].values.length > 0) {
            var inL = a[0].values.length, // length of the inner arrays, which should all be the same
              i;
            for (i = 0; i < inL; i++) {
              sol.push([]); // init transposed array
            }
            for (i = 0; i < outL; i++) {
              for (var j = 0; j < inL; j++) {
                sol[j].push(a[i].values[j]);
              }
            }
          }
        }
        return sol;
      }
    };
    return UtilX;
  }]);