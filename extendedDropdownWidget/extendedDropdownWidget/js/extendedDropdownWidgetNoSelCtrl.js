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
angular.module("extendedDropdownWidgetModule")
  .controller("addNoSelectionCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $scope.addNoSelectionEntry = $scope.widget.config.addNoSelectionEntry,
      $scope.$watch("addNoSelectionEntry", function (newValue, oldValue) {
        newValue != oldValue && ($scope.widget.config.addNoSelectionEntry = newValue,
          $rootScope.$broadcast("dashboardDefinitionChanged"))
      }),
      $scope.$watch("widget.config.noSelectionEntry", function (newValue, oldValue) {
        newValue != oldValue && $rootScope.$broadcast("dashboardDefinitionChanged")
      })
  }])