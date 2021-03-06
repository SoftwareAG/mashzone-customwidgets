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
  .config(['dashboardProviderProvider', 'columnTypeConfigUrlServiceProvider', function (dashboardProviderProvider, columnTypeConfigUrlServiceProvider) {
    dashboardProviderProvider.widget('extendedLabelWidget', {
      title: 'Extended Label',
      category: 'ExtendedCharts',
      toolTip: {
        "de": "Erweitertes Label",
        "en": "Extended Label"
      },
      actions: [
        'assignData', 'filter',
        'editName',
        'hideHeader', 'hideBorder',
        'containerStyle', 'widgetStyle',
        'autoRefresh',
        'hLine',
        'selectSize',
        'activateScaling',
        'hLine',
        'isGlobal',
        'hLine',
        'copy', 'paste', 'cut', 'delete',
        'toTop', 'bringForward', 'sendBackward', 'toBack',
        "actions"
      ],
      description: 'Label Widget capable of triggering filter and selection events',
      templateUrl: 'widgets/customWidgets/extendedLabelWidget/partials/extendedLabelWidget.html',
      iconUrl: 'widgets/customWidgets/extendedLabelWidget/assets/images/menu_icon_32x32.png',
      controller: 'extendedLabelWidgetCtrl',
      resolve: {
        widgetInterface: function (config, extendedLabelWidgetDataService) {
          config.widgetInterface = {
            getDataMapping: extendedLabelWidgetDataService.getDataMapping,
            calculateCoordinateList: extendedLabelWidgetDataService.calculateCoordinateList
          };
        }
      },
      actionResolver: {
        resolveAction: function (actionKey) {
          if (actionKey === "selectSize") {
            return {
              name: 'Select Size',
              template: 'widgets/customWidgets/extendedLabelWidget/partials/properties/selectSize.html'
            };
          }
          if (actionKey === "activateScaling") {
            return {
              name: 'Activate Scaling',
              template: 'widgets/customWidgets/extendedLabelWidget/partials/properties/activateScaling.html'
            };
          }
        }
      },
      actionFramework: {
        getActionTriggers: function (widgetConfig, filter) {
          return [{
            key: 'onClick',
            name: 'On click'
          }];
        }
      },
      assignData: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/assignData.html',
      assignColumns: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/assignColumns.html',
      columnProperties: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/columnProperties.html',
      advancedProperties: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/advancedProperties.html',
      // colorProperties: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/colorProperties.html',
      // iconProperties: 'widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/iconProperties.html',
      // viewModeActions: ['deleteSelection', 'pause'],
      viewModeActions: ['pause'],
      container: {
        hideHeader: false,
        hideBorder: false,
        width: 600,
        height: 450,
        contentMinHeight: 60,
        contentMinWidth: 60
      }
    });
    columnTypeConfigUrlServiceProvider.addColumnTypeUrlMapByWidget('extendedLabelWidget', {
      NUMERIC: ['widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'numeric.html'].join('/'),
      DATE: ['widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'date.html'].join('/'),
      TEXT: ['widgets/customWidgets/extendedLabelWidget/partials/assignDataDialog/columnTypeConfigTemplates', 'text.html'].join('/')
    });
  }]);