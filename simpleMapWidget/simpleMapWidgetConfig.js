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

.config(['dashboardProviderProvider', 'columnTypeConfigUrlServiceProvider', function(dashboardProviderProvider, columnTypeConfigUrlServiceProvider) {
  dashboardProviderProvider.widget('simpleMapWidget', {
    title: 'Simple Map Widget',
    category: 'Map',
    toolTip: {
      "de": "Leaflet Maps Widget!",
      "en": "Leaflet Maps Widget!"
    },
    actions: [
      'editName',
      'assignData', 'filter',
      'hLine',
      'editStyle',
      'hLine',
      // 'editLocation',
      'selectMapItems',
      'hLine',
      'isGlobal',
      'hLine',
      'copy', 'paste', 'cut', 'delete',
      'toTop', 'bringForward', 'sendBackward', 'toBack',
      'hideHeader', 'hideBorder',
      "actions"
    ],
    description: 'Map widget based on the Leaflet library and OpenStreetMaps',
    templateUrl: 'widgets/customWidgets/simpleMapWidget/partials/simpleMapWidget.html',
    iconUrl: 'widgets/customWidgets/simpleMapWidget/assets/images/menu_icon_32x32.png',
    controller: 'simpleMapWidgetCtrl',
    resolve: {
      widgetInterface: function(config, simpleMapWidgetDataService) {
        config.widgetInterface = {
          getDataMapping: simpleMapWidgetDataService.getDataMapping,
          calculateCoordinateList: simpleMapWidgetDataService.calculateCoordinateList
        };
      }
    },
    actionResolver: {
      resolveAction: function(actionKey) {
        if (actionKey === "editLocation") {
          return {
            name: 'Location',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/editLocation.html'
          };
        } else if (actionKey === "editStyle") {
          return {
            name: 'Style',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/editStyle.html'
          };
        } else if (actionKey === "selectMapItems") {
          return {
            name: 'Map Items',
            template: 'widgets/customWidgets/simpleMapWidget/partials/properties/selectMapItems.html'
          };
        }
      }
    },
    actionFramework: {
      getActionTriggers: function(widgetConfig, filter) {
        return [{
          key: 'onSelectionChange',
          name: filter("widgetResources")("ACTIONS_ON_SELECTION_CHANGE")
        }];
      }
    },
    assignData: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/assignData.html',
    assignColumns: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/assignColumns.html',
    columnProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnProperties.html',
    advancedProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/advancedProperties.html',
    //thresholdProperties: 'widgets/customWidgets/advancedWidget/partials/assignDataDialog/thresholdProperties.html',
    colorProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/colorProperties.html',
    iconProperties: 'widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/iconProperties.html',
    viewModeActions: ['deleteSelection', 'pause'],
    container: {
      hideHeader: false,
      hideBorder: false,
      width: 600,
      height: 450,
      contentMinHeight: 60,
      contentMinWidth: 60
    }
  });
  columnTypeConfigUrlServiceProvider.addColumnTypeUrlMapByWidget('simpleMapWidget', {
    NUMERIC: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'numeric.html'].join('/'),
    DATE: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'date.html'].join('/'),
    TEXT: ['widgets/customWidgets/simpleMapWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'text.html'].join('/')
  });
}]);