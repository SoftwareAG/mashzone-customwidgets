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
  .config(['dashboardProviderProvider', 'columnTypeConfigUrlServiceProvider', function (dashboardProviderProvider, columnTypeConfigUrlServiceProvider) {
    dashboardProviderProvider.widget('extendedDropdownWidget', {
      title: 'Extended Dropdown Widget',
      category: 'ExtendedCharts',
      toolTip: {
        "de": "Extended Dropdown Widget",
        "en": "Erweitertes Dropdown-Widget"
      },
      actions: [
        'assignData',
        'filter',
        'editName',
        'hideHeader', 'hideBorder',
        'containerStyle', 'widgetStyle',
        'autoRefresh',
        'hLine',
        'isGlobal',
        "hLine",
        "sortingBehaviour", "multipleSelection",
        "hLine",
        "addNoSelectionEntry", "addNoSelectionLabel",
        'hLine',
        'copy', 'paste', 'cut', 'delete',
        'toTop', 'bringForward', 'sendBackward', 'toBack',
        'actions', 'preselection'
      ],
      description: 'Template Widget showing different capabilities of a MashZone NextGen Custom Widget',
      templateUrl: 'widgets/customWidgets/extendedDropdownWidget/partials/extendedDropdownWidget.html',
      iconUrl: 'widgets/customWidgets/extendedDropdownWidget/assets/images/menu_icon_32x32.png',
      controller: 'extendedDropdownWidgetCtrl',
      resolve: {
        widgetInterface: function (config, extendedDropdownWidgetDataService) {
          config.widgetInterface = {
            getDataMapping: extendedDropdownWidgetDataService.getDataMapping,
            calculateCoordinateList: extendedDropdownWidgetDataService.calculateCoordinateList
          };
        }
      },
      actionResolver: {
        resolveAction: function (actionKey) {
          return "addNoSelectionEntry" == actionKey ? {
            name: "No selection",
            template: "widgets/customWidgets/extendedDropdownWidget/partials/properties/addNoSelectionEntry.html"
          } : "addNoSelectionLabel" == actionKey ? {
            name: "No selection label",
            template: "widgets/customWidgets/extendedDropdownWidget/partials/properties/addNoSelectionLabel.html"
          } : "sortingBehaviour" == actionKey ? {
            name: "Sorting",
            template: "widgets/customWidgets/extendedDropdownWidget/partials/properties/sortingBehaviour.html"
          } : "multipleSelection" == actionKey ? {
            name: "Multiple Selection",
            template: "widgets/customWidgets/extendedDropdownWidget/partials/properties/multipleSelection.html"
          } : void 0
        }
        //   resolveAction: function (actionKey) {
        //     if (actionKey === "customAction") {
        //       return {
        //         name: 'Custom Property',
        //         template: 'widgets/customWidgets/extendedDropdownWidget/partials/properties/customProperty.html'
        //       };
        //     }
        //   }
      },
      actionFramework: {
        getActionTriggers: function (widgetConfig, filter) {
          return [{
              key: 'onSelectionChange',
              name: 'On Selection Change'
            }
            // , {
            //   key: 'onClick',
            //   name: 'On Click'
            // }
          ];
        }
      },
      assignData: 'widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/assignData.html',
      assignColumns: 'widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/assignColumns.html',
      columnProperties: 'widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/columnProperties.html',
      advancedProperties: 'widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/advancedProperties.html',
      // thresholdProperties: 'widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/thresholdProperties.html',
      // viewModeActions: ['deleteSelection', 'pause'],
      container: {
        hideHeader: true,
        hideBorder: true,
        width: 200,
        height: 40,
        contentMinHeight: 30,
        contentMinWidth: 60
      }
    });
    columnTypeConfigUrlServiceProvider.addColumnTypeUrlMapByWidget('extendedDropdownWidget', {
      NUMERIC: ['widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'numeric.html'].join('/'),
      DATE: ['widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'date.html'].join('/'),
      TEXT: ['widgets/customWidgets/extendedDropdownWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'text.html'].join('/')
    });
  }]);